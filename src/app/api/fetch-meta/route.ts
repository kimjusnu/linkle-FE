export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

// 파서들 import
import { parseWanted } from "@/parsers/wanted";
import { parseSaramin } from "@/parsers/saramin";
import { parseJobkorea } from "@/parsers/jobkorea";
import { parseCatch } from "@/parsers/catch";
import { parseIncruit } from "@/parsers/incruit";
import { parseWork24 } from "@/parsers/work24";
import { parseJobplanet } from "@/parsers/jobplanet";
import { parseCareer } from "@/parsers/career";
import { parseRocketpunch } from "@/parsers/rocketpunch";
import { parseJasoseol } from "@/parsers/jasoseol";
import { parseSuperookie } from "@/parsers/superookie";
import { parsePeplejob } from "@/parsers/peplejob";
import { parseRallit } from "@/parsers/rallit";
import { parseJumpit } from "@/parsers/jumpit";
import { parseGroupby } from "@/parsers/groupby";
import { parseKWork } from "@/parsers/kwork";
import { parseBusinesspeople } from "@/parsers/businesspeople";
import { parseGeneric } from "@/parsers/generic";

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url || typeof url !== "string" || !url.startsWith("http")) {
    return NextResponse.json(
      { error: "Invalid or missing URL" },
      { status: 400 }
    );
  }

  let browser;

  try {
    // launch
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // user-agent 위장
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    );
    await page.setExtraHTTPHeaders({ "Accept-Language": "ko-KR,ko;q=0.9" });

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 20000,
    });

    try {
      await page.waitForNavigation({
        waitUntil: "domcontentloaded",
        timeout: 5000,
      });
    } catch {
      console.log("🔄 리디렉션 없음 (무시)");
    }

    try {
      await page.waitForSelector("body", { timeout: 10000 });
    } catch {
      console.warn("⚠️ <body> 태그를 찾지 못했어요.");
    }

    const html = await page.content();

    if (html.includes("ERROR: The request could not be satisfied")) {
      await browser.close();
      return NextResponse.json(
        { error: "크롤링이 차단된 페이지입니다.", blocked: true, url },
        { status: 403 }
      );
    }

    const $ = cheerio.load(html);

    // 출처 식별
    const source = (() => {
      if (url.includes("wanted.co.kr")) return "원티드";
      if (url.includes("jumpit")) return "점핏";
      if (url.includes("saramin.co.kr")) return "사람인";
      if (url.includes("jobkorea.co.kr")) return "잡코리아";
      if (url.includes("catch.co.kr")) return "캐치";
      if (url.includes("incruit.com")) return "인크루트";
      if (url.includes("work24.go.kr")) return "고용24";
      if (url.includes("jobplanet.co.kr")) return "잡플래닛";
      if (url.includes("career.co.kr")) return "커리어";
      if (url.includes("rocketpunch.com")) return "로켓펀치";
      if (url.includes("jasoseol.com")) return "자소설닷컴";
      if (url.includes("superookie.com")) return "슈퍼루키";
      if (url.includes("peoplenjob.com")) return "피플앤잡";
      if (url.includes("rallit.com")) return "랠릿";
      if (url.includes("groupby.kr")) return "그룹바이";
      if (url.includes("k-work.or.kr")) return "K-Work";
      if (url.includes("bzpp.co.kr")) return "비즈니스피플";
      return "기타";
    })();

    // 파서 선택
    const parsed = (() => {
      switch (source) {
        case "원티드":
          return parseWanted($);
        case "사람인":
          return parseSaramin($);
        case "잡코리아":
          return parseJobkorea($);
        case "캐치":
          return parseCatch($);
        case "인크루트":
          return parseIncruit($);
        case "고용24":
          return parseWork24($);
        case "잡플래닛":
          return parseJobplanet($);
        case "커리어":
          return parseCareer($);
        case "로켓펀치":
          return parseRocketpunch($);
        case "자소설닷컴":
          return parseJasoseol($);
        case "슈퍼루키":
          return parseSuperookie($);
        case "피플앤잡":
          return parsePeplejob($);
        case "랠릿":
          return parseRallit($);
        case "점핏":
          return parseJumpit($);
        case "그룹바이":
          return parseGroupby($);
        case "K-Work":
          return parseKWork($);
        case "비즈니스피플":
          return parseBusinesspeople($);
        default:
          return parseGeneric($);
      }
    })();

    const result = {
      ...parsed,
      source,
      url,
    };

    console.log("🧠 메타데이터");
    console.log("📌 기업명:", result.company ?? "없음");
    console.log("🌐 출처:", result.source);
    console.log("📌 경력조건:", result.experience ?? "없음");
    console.log("📌 마감일자:", result.deadline ?? "없음");
    console.log("🔗 공고 링크:", result.url);

    await browser.close();
    return NextResponse.json(result);
  } catch (error: unknown) {
    if (browser) await browser.close();
    console.error("❌ 크롤링 실패:", error);
    return NextResponse.json(
      { error: "크롤링에 실패했습니다.", url },
      { status: 500 }
    );
  }
}

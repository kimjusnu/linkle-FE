import { CheerioAPI } from "cheerio";

export function parseRocketpunch($: CheerioAPI) {
  const title = $("title").text().trim();

  // ✅ 기업명 예: "딥블루닷 - B2B Marketing Intern 채용"
  const company = title.split("-")[0].trim();

  const bodyText = $("body").text();

  // ✅ 경력 조건
  const experience =
    bodyText.match(/신입\/경력|신입|경력\s*\d+년|무관/)?.[0] ?? null;

  // ✅ 마감일자
  const deadline =
    bodyText.match(/20\d{2}[년.\-/\s]+[01]?\d[월.\-/\s]+[0-3]?\d[일]?/)?.[0] ??
    null;

  // ✅ 지역: 예시 기준 "서울", "강남구" 등 추출
  const location =
    bodyText.match(
      /(서울|경기|인천|부산|대구|대전|광주|울산|세종|강원|충북|충남|전북|전남|경북|경남|제주)[^\s,)<>{}]{0,20}/
    )?.[0] ?? null;

  return {
    company,
    experience,
    location,
    deadline,
    platform: "로켓펀치",
  };
}

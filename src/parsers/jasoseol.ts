import { CheerioAPI } from "cheerio";

export function parseJasoseol($: CheerioAPI) {
  const title = $("title").text().trim();

  // 공고 상세가 아닌 경우 기본 사이트 타이틀만 반환되므로 예외 처리
  const isLandingPage = title.includes("자소설닷컴") && !title.includes("채용");

  const company = isLandingPage ? null : title.split("-")[0].trim();

  const bodyText = $("body").text();

  const experience =
    bodyText.match(/(신입\/경력|신입|경력\s*\d+\s*년|무관)/)?.[0] ?? null;

  const deadline =
    bodyText.match(
      /20\d{2}[.\-\/년\s]+[01]?\d[.\-\/월\s]+[0-3]?\d[일]?(까지)?/
    )?.[0] ?? null;

  return {
    company,
    experience,
    deadline,
    platform: "자소설닷컴",
  };
}

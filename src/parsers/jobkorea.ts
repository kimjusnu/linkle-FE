import { CheerioAPI } from "cheerio";

export function parseJobkorea($: CheerioAPI) {
  // 회사명 추출
  const company =
    $(".coName").first().text().replace(/\s+/g, "").replace("㈜", "").trim() ||
    "";

  // 경력 조건 추출
  const experienceText = $(".tbCol")
    .find("h4:contains('지원자격')")
    .next()
    .find("dt:contains('경력')")
    .next("dd")
    .text()
    .trim();

  const experience =
    experienceText.match(/신입|경력\s*\d+\s*년|무관|신입[·\/]경력/)?.[0] ??
    experienceText;

  // 지역 추출
  const locationText = $(".tbCol")
    .find("h4:contains('근무조건')")
    .next()
    .find("dt:contains('지역')")
    .next("dd")
    .text()
    .replace(/\s+/g, " ")
    .trim();

  // 마감일 추출
  const deadline =
    $(".artReadPeriod")
      .find("dt:contains('마감일')")
      .next("dd")
      .text()
      .trim() || null;

  return {
    company,
    experience,
    location: locationText,
    deadline,
    platform: "잡코리아",
  };
}

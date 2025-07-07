import { CheerioAPI } from "cheerio";

export function parseJobplanet($: CheerioAPI) {
  const title = $("title").text().trim();

  // 기업명 추출 (head에 있는 title 활용하거나 상세 영역의 .company_name 사용)
  const company =
    ($(".company_info .company_name").text().trim() ||
      title
        .match(/[\(\[]?(주)?[가-힣A-Za-z0-9&㈜\s]+/)?.[0]
        ?.replace("㈜", "")
        .trim()) ??
    null;

  // 경력 추출 (요약 영역에 3~7년 같은 형식)
  const experience =
    $(".recruitment-summary__dt:contains('경력')")
      .next(".recruitment-summary__dd")
      .text()
      .trim() || null;

  // 마감일 추출
  const deadline =
    $(".recruitment-summary__dt:contains('마감일')")
      .next(".recruitment-summary__dd")
      .text()
      .replace(/\s*D-\d+/, "") // D-day 제거
      .trim() || null;

  // 지역 추출
  const location =
    $(".recruitment-summary__dt:contains('근무지역')")
      .next(".recruitment-summary__dd")
      .text()
      .trim() || null;

  // 직무 또는 포지션
  const position = $("h1.ttl").text().trim() || null;

  return {
    company,
    experience,
    deadline,
    location,
    position,
    platform: "잡플래닛",
  };
}

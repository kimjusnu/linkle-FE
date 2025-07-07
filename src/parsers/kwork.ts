import { CheerioAPI } from "cheerio";

export function parseKWork($: CheerioAPI) {
  const title = $("title").text().trim();

  // ✅ 기업명: 제목이나 h3 태그에서 추출
  const companyMatch = title.match(/^\[(.*?)\]/);
  const company =
    companyMatch?.[1]?.trim() ||
    $("th:contains('사업체명')").next("td").text().trim() ||
    $("h3").first().text().trim() ||
    title.split("|")[0].trim();

  const bodyText = $("body").text();

  // ✅ 경력조건: 다양한 표현 대응
  const experience =
    bodyText.match(
      /(신입\/경력|신입|경력\s*\d+년|연차무관|경력무관|무관)/
    )?.[0] ?? null;

  // ✅ 마감일: "마감일" 또는 날짜 포맷 탐색
  const deadline =
    $("th:contains('마감일')").next("td").text().trim() ||
    bodyText.match(/20\d{2}[년.\-/\s]+[01]?\d[월.\-/\s]+[0-3]?\d[일]?/)?.[0] ||
    null;

  // ✅ 지역: "근무지 주소" 또는 "소재지" 우선순위 추출
  const location =
    $("th:contains('근무지 주소')").next("td").text().trim() ||
    $("th:contains('소재지')").next("td").text().trim() ||
    null;

  return {
    company,
    experience,
    location,
    deadline,
    platform: "K-Work",
  };
}

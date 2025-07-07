// src/parsers/wanted.ts
import { CheerioAPI } from "cheerio";

export function parseWanted($: CheerioAPI) {
  // ✅ 기업명: data-company-name 속성을 가진 <a> 태그에서 추출
  const company =
    $("a[data-company-name]").attr("data-company-name")?.trim() || null;

  // ✅ 경력조건: 첫 번째 .Company__Info 클래스 span
  const experience =
    $("span[class*=Company__Info]").eq(1).text().trim() || null;

  // ✅ 지역: 두 번째 .Company__Info 클래스 span
  const location = $("span[class*=Company__Info]").eq(0).text().trim() || null;
  // ✅ 마감일자: body 전체에서 날짜 형식 추출 (예: 2025.07.03)
  const bodyText = $("body").text();
  const deadline =
    bodyText.match(
      /20\d{2}[.\-\/년\s]+[01]?\d[.\-\/월\s]+[0-3]?\d[일]?/
    )?.[0] ?? null;

  return {
    company,
    experience,
    location,
    deadline,
    platform: "원티드",
  };
}

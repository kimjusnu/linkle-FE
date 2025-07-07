import { CheerioAPI } from "cheerio";

export function parseJumpit($: CheerioAPI) {
  const title = $("title").text().trim();

  // ✅ 기업명: <a class="name"> 하이퍼정보 </a> 또는 title로 fallback
  const company =
    $("a.name span").text().trim() ||
    title.match(/^\[(.*?)\]/)?.[1]?.trim() ||
    title.split("-")[0].trim();

  // ✅ 경력: <dt>경력</dt> → <dd>
  const experience =
    $("dt:contains('경력')").next("dd").text().trim().replace(/\s+/g, " ") ||
    null;

  // ✅ 마감일: <dt>마감일</dt> → <dd>
  const deadline =
    $("dt:contains('마감일')").next("dd").text().trim().replace(/\s+/g, " ") ||
    null;

  // ✅ 근무지역: <dt>근무지역</dt> → <dd>
  const location =
    $("dt:contains('근무지역')")
      .next("dd")
      .text()
      .trim()
      .replace(/\s+/g, " ") || null;

  return {
    company,
    experience,
    location,
    deadline,
    platform: "점핏",
  };
}

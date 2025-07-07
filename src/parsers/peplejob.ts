import { CheerioAPI } from "cheerio";

export function parsePeplejob($: CheerioAPI) {
  const title = $("title").text().trim();

  // ✅ 기업명: [기업명] 또는 "-" 앞
  const companyMatch = title.match(/\[(.*?)\]/);
  const company = companyMatch?.[1]?.trim() ?? title.split("-")[0].trim();

  const bodyText = $("body").text();

  // ✅ 경력 조건
  const experience =
    bodyText.match(/신입\/경력|신입|경력\s*\d+\s*년|무관/)?.[0] ?? null;

  // ✅ 마감일 (20XX.XX.XX 형식)
  const deadline =
    bodyText.match(
      /20\d{2}[.\-\/년\s]+[01]?\d[.\-\/월\s]+[0-3]?\d[일]?/
    )?.[0] ?? null;

  // ✅ 근무지역: <li><span>근무지역</span><a>서울 강남</a></li>
  const location =
    $("li:has(span:contains('근무지역')) a").first().text().trim() || null;

  return {
    company,
    experience,
    location,
    deadline,
    platform: "피플앤잡",
  };
}

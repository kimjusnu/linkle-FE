import { CheerioAPI } from "cheerio";

export function parseCareer($: CheerioAPI) {
  const title = $("title").text().trim();

  // 회사명은 title에 [기업명] 형식으로 포함됨
  const companyMatch = title.match(/\[(.*?)\]/);
  const company = companyMatch?.[1] ?? title;

  const bodyText = $("body").text();

  const experience =
    bodyText.match(/(신입|무관|경력\s*\d+\s*년|신입\/경력)/)?.[0] ?? null;

  const deadline =
    bodyText.match(
      /20\d{2}[.\-\/년\s]+[01]?\d[.\-\/월\s]+[0-3]?\d[일]?/
    )?.[0] ?? null;

  return {
    company,
    experience,
    deadline,
  };
}

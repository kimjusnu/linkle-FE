import { CheerioAPI } from "cheerio";

export function parseIncruit($: CheerioAPI) {
  const title = $("title").text().trim();

  // 대괄호 안의 실제 회사명 추출 또는 fallback
  const companyMatch = title.match(/\[(.*?)\]/);
  const company = companyMatch?.[1] ?? title.split(":")[0].trim();

  const bodyText = $("body").text();

  const experience =
    bodyText.match(/(신입\/경력|신입|무관|경력\s*\d+\s*년)/)?.[0] ?? null;

  const deadline =
    bodyText.match(
      /20\d{2}[.\-\/년\s]+[01]?\d[.\-\/월\s]+[0-3]?\d[일]?(까지)?/
    )?.[0] ?? null;

  return {
    company,
    experience,
    deadline,
    platform: "인크루트",
  };
}

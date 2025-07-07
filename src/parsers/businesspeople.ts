import { CheerioAPI } from "cheerio";

export function parseBusinesspeople($: CheerioAPI) {
  const title = $("title").text().trim();

  // 예: "Specialist, Marketing, CoA KR - 하만인터내셔널코리아 채용 - 비즈니스피플"
  const titleParts = title.split(" - ");
  const companyRaw = titleParts.find((part) => part.includes("채용"));
  const company = companyRaw?.replace("채용", "").trim() ?? titleParts[0];

  const bodyText = $("body").text();

  const experience =
    bodyText.match(/(신입|경력\s*\d+\s*년|무관|신입\/경력)/)?.[0] ?? null;

  const deadline =
    bodyText.match(/20\d{2}[년.\-/\s]+[01]?\d[월.\-/\s]+[0-3]?\d[일]?/)?.[0] ??
    null;

  return {
    company,
    experience,
    deadline,
  };
}

import { CheerioAPI } from "cheerio";

export function parseRallit($: CheerioAPI) {
  const title = $("title").text().trim();

  // 예: "아이샵케어 [토스플레이스 자회사] IT Infra Engineer 채용 - 랠릿"
  const company = title.split("-")[0].trim(); // " - 랠릿" 제거

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

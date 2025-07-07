import { CheerioAPI } from "cheerio";

export function parseSuperookie($: CheerioAPI) {
  const title = $("title").text().trim();
  const company = title.split("-")[0].trim();
  const bodyText = $("body").text();

  const experience =
    bodyText.match(/신입\/경력|신입|경력\s*\d+년|무관/)?.[0] ?? null;

  // ✅ 마감일 추출
  const deadlineRawHtml = $("b:contains('접수기간')").parent().next().html();

  let deadline: string | null = null;

  if (deadlineRawHtml) {
    const lines = deadlineRawHtml
      .split(/<br\s*\/?>/i)
      .map((line) => line.replace(/<[^>]*>/g, "").trim());

    const deadlineLine = lines.find((line) => line.includes("마감"));
    const match = deadlineLine?.match(/(\d{2})월\s*(\d{2})일/);

    if (match) {
      const year = new Date().getFullYear();
      const [, mm, dd] = match;
      deadline = `${year}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    }
  }

  // ✅ 위치 추출
  const locationRaw = $("div.bottommargin-xs")
    .filter((_, el) => $(el).text().includes("근무지:"))
    .text()
    .replace(/\s+/g, " ")
    .trim();

  const locationMatch = locationRaw.match(/근무지:\s*([^\-<\n]+)/);
  const location = locationMatch?.[1]?.trim() ?? null;

  return {
    company,
    experience,
    location,
    deadline,
    platform: "슈퍼루키",
  };
}

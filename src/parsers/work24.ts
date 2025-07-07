import { CheerioAPI } from "cheerio";

export function parseWork24($: CheerioAPI) {
  // ✅ 기업명
  const company =
    $("p.corp_info > strong").first().text().trim() ||
    $("title").text().split("|")[0].trim() ||
    null;

  // ✅ 지역
  const location =
    $("em.tit")
      .filter((_, el) => $(el).text().includes("지역"))
      .first()
      .next("p")
      .text()
      .trim() || null;

  // ✅ 마감일자
  const deadline =
    $("strong")
      .filter((_, el) => $(el).text().includes("접수 마감일"))
      .first()
      .next("p")
      .text()
      .trim()
      .replace(/\s+/g, " ") || null;

  // ✅ 경력조건
  const experience =
    getTextByLabel("경력") ??
    $("body")
      .text()
      .match(/신입|경력|무관/)?.[0] ??
    null;

  return {
    company,
    experience,
    location,
    deadline,
    platform: "고용24",
  };

  // 헬퍼 함수
  function getTextByLabel(label: string): string | null {
    const th = $(`th:contains(${label})`).first();
    const td = th.next("td");
    const text = td.text().trim();
    return text || null;
  }
}

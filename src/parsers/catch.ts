import { CheerioAPI } from "cheerio";

export function parseCatch($: CheerioAPI) {
  // 회사명
  const company = $(".recr_pop_title .tit .h2 a").first().text().trim() || null;

  // 경력 (첫 번째 tr 에 한정)
  const experience =
    $("table.box_summary tr")
      .first()
      .find("th:contains('경력')")
      .next("td")
      .text()
      .trim() || null;

  // 근무지
  const location =
    $("table.box_summary th:contains('근무지역')")
      .next("td")
      .text()
      .replace(/\s+/g, " ")
      .trim() || null;

  // 마감일
  const deadlineRaw = $(".box_dday .t1").text().trim(); // ~ 07.13(일) 24시
  const deadlineMatch = deadlineRaw.match(/\d{2}\.\d{2}/); // 07.13
  const today = new Date();
  const year = today.getFullYear();
  const deadline = deadlineMatch ? `${year}.${deadlineMatch[0]}` : null;

  return {
    company,
    experience,
    location,
    deadline,
    platform: "캐치",
  };
}

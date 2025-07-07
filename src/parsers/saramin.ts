import { CheerioAPI } from "cheerio";

export function parseSaramin($: CheerioAPI) {
  // ✅ 기업명 우선순위: a.corp_name > [기업명] 형태
  const company =
    $("a.corp_name").first().text().trim() ||
    (() => {
      const titleText = $("h1.tit_job").text().trim();
      const match = titleText.match(/^\[(.+?)\]/);
      return match ? match[1].trim() : titleText;
    })();

  const getConditionText = (label: string): string | null => {
    const dt = $(`dt:contains(${label})`).first();
    const dd = dt.next("dd").text().trim();
    return dd || null;
  };

  const experience =
    getConditionText("경력") ??
    $("body")
      .text()
      .match(/신입|무관|경력\s*\d+년/)?.[0] ??
    null;

  const deadline =
    getConditionText("마감일") ??
    $("body")
      .text()
      .match(/20\d{2}[.\-\/년\s]+[01]?\d[.\-\/월\s]+[0-3]?\d[일]?/)?.[0] ??
    null;

  const location =
    getConditionText("근무지역") ??
    $("body")
      .text()
      .match(
        /(서울|경기|인천|부산|대구|대전|광주|울산|세종|강원|충북|충남|전북|전남|경북|경남|제주)[^\s,)<>{}]{0,20}/
      )?.[0] ??
    null;

  return {
    company,
    experience,
    location,
    deadline,
    platform: "사람인",
  };
}

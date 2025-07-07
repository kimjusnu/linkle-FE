import { CheerioAPI } from "cheerio";

export function parseGeneric($: CheerioAPI) {
  const title = $("title").text().trim();

  // 기업명 추정: 타이틀 구분자별로 분할
  const company = title.split(/[-|:]/)[0]?.replace(/채용/g, "").trim() || null;

  const bodyText = $("body").text();

  // 경력 조건 추출
  const experienceMatch = bodyText.match(
    /(신입\/경력|신입[·\/]경력|신입\s*가능|경력\s*\d+\s*년|경력\s*무관|무관|신입)/
  );
  const experience = experienceMatch?.[0] ?? null;

  // 마감일 추출: 날짜형식 또는 '상시채용', '채용 시 마감'
  const deadlineMatch = bodyText.match(
    /(20\d{2}[.\-\/년\s]+[01]?\d[.\-\/월\s]+[0-3]?\d[일]?)|상시\s*채용|채용\s*시\s*마감/
  );
  const deadline = deadlineMatch?.[0].replace(/\s+/g, " ").trim() ?? null;

  return {
    company,
    experience,
    deadline,
    platform: "기타",
  };
}

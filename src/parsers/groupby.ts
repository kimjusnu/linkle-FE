import { CheerioAPI } from "cheerio";

export function parseGroupby($: CheerioAPI) {
  // 회사명 추출
  const company =
    $(".job-info-company").text().trim() ||
    $("title").text().replace("채용", "").split("-")[0].trim();

  // 경력 조건 추출
  const experienceText = $("section:contains('자격요건')")
    .find("dt:contains('경력')")
    .next("dd")
    .text()
    .trim();

  const experience =
    experienceText.match(/신입|무관|경력\s*\d+\s*년|신입[·\/]경력/)?.[0] ??
    (experienceText || null);

  // 근무지(지역) 추출
  const locationText = $("section:contains('근무지')")
    .find("dt:contains('근무지')")
    .next("dd")
    .text()
    .replace(/\s+/g, " ")
    .trim();

  const location = locationText || null;

  // 마감일 추출
  const deadline =
    $("section:contains('마감일')")
      .find("dt:contains('마감일')")
      .next("dd")
      .text()
      .trim() || null;

  return {
    company,
    experience,
    location,
    deadline,
    platform: "그룹바이",
  };
}

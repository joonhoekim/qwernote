export function slugify(text: string): string {
  // Convert to URL-safe ASCII string
  const urlSafeString = text
    .normalize('NFD') // 유니코드 정규화
    .replace(/[\u0300-\u036f]/g, '') // 발음 구별 기호 제거
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '') // 문자와 숫자만 유지 (유니코드 지원)
    .replace(/[\s_-]+/g, '-') // 공백을 하이픈으로
    .replace(/^-+|-+$/g, ''); // 양끝 하이픈 제거

  // 한글이 포함된 경우, URL에 안전한 형태로 인코딩
  return encodeURIComponent(urlSafeString);
}

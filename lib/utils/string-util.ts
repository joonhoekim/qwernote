export function removeAtSymbol(text: string): string {
    // 1. %40으로 시작하는지 확인하고 전체 길이가 4자 이상인지 확인
    if (text.startsWith('%40') && text.length >= 4) {
        // 2. %40 제거 (첫 3글자를 제거)
        return text.slice(3);
    }
    // 조건에 맞지 않으면 원래 문자열 반환
    return text;
}

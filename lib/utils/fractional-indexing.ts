// fractional indexing 구현
export function generateOrder(prev?: string, next?: string): string {
    if (!prev) return 'a';
    if (!next) return prev + 'a';

    const length = Math.max(prev.length, next.length);
    const paddedPrev = prev.padEnd(length, 'a');
    const paddedNext = next.padEnd(length, 'a');

    let result = '';
    for (let i = 0; i < length; i++) {
        const prevChar = paddedPrev.charCodeAt(i);
        const nextChar = paddedNext.charCodeAt(i);
        if (prevChar === nextChar) {
            result += String.fromCharCode(prevChar);
        } else {
            const mid = Math.floor((prevChar + nextChar) / 2);
            return result + String.fromCharCode(mid);
        }
    }
    return result + 'n';
}

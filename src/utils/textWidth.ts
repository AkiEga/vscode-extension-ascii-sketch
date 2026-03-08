/**
 * Calculates the display width of a given string.
 * - ASCII characters (0x00 - 0x7F) have width 1 (early return fast-path).
 * - Full-width characters (Japanese, standard full-width symbols, etc.) have width 2.
 * - Other half-width characters have width 1.
 */
export function getTextWidth(text: string): number {
    let width = 0;
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);

        // Fast-path for ASCII characters
        if (charCode >= 0x00 && charCode <= 0x7F) {
            width += 1;
            continue;
        }

        if (isFullWidth(charCode)) {
            width += 2;
        } else {
            width += 1;
        }
    }
    return width;
}

/**
 * Checks if a character code represents a full-width character.
 * Uses a basic range check for common East Asian characters.
 */
function isFullWidth(charCode: number): boolean {
    if (charCode >= 0x1100 &&
        (charCode <= 0x115f || // Hangul Jamo
            charCode === 0x2329 || // LEFT-POINTING ANGLE BRACKET
            charCode === 0x232a || // RIGHT-POINTING ANGLE BRACKET
            (charCode >= 0x2e80 && charCode <= 0xa4cf &&
                charCode !== 0x303f) || // CJK Radicals Supplement .. Yi Radicals
            (charCode >= 0xac00 && charCode <= 0xd7a3) || // Hangul Syllables
            (charCode >= 0xf900 && charCode <= 0xfaff) || // CJK Compatibility Ideographs
            (charCode >= 0xfe10 && charCode <= 0xfe19) || // Vertical forms
            (charCode >= 0xfe30 && charCode <= 0xfe6f) || // CJK Compatibility Forms
            (charCode >= 0xff00 && charCode <= 0xff60) || // Fullwidth Forms
            (charCode >= 0xffe0 && charCode <= 0xffe6)    // Fullwidth Forms
        )) {
        return true;
    }
    return false;
}

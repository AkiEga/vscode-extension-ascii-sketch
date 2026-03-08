import * as assert from 'assert';
import { getTextWidth } from '../src/utils/textWidth';

describe('textWidth Utility', () => {
    it('should correctly measure ASCII characters (width 1)', () => {
        assert.strictEqual(getTextWidth('Hello'), 5);
        assert.strictEqual(getTextWidth('123!@#'), 6);
        assert.strictEqual(getTextWidth('   '), 3);
        assert.strictEqual(getTextWidth(''), 0);
    });

    it('should correctly measure full-width characters (width 2)', () => {
        assert.strictEqual(getTextWidth('こんにちは'), 10); // Hiragana
        assert.strictEqual(getTextWidth('漢字'), 4); // Kanji
        assert.strictEqual(getTextWidth('ＡＢＣ'), 6); // Full-width alphabet
        assert.strictEqual(getTextWidth('１２３'), 6); // Full-width numbers
        assert.strictEqual(getTextWidth('！＠＃'), 6); // Full-width symbols
    });

    it('should correctly measure mixed strings', () => {
        assert.strictEqual(getTextWidth('Hello World'), 11);
        assert.strictEqual(getTextWidth('Hello 世界'), 10); // 5 (Hello) + 1 (space) + 4 (世界)
        assert.strictEqual(getTextWidth('こんにちは World!'), 17); // 10 + 1 (space) + 6 (World!)
    });
});

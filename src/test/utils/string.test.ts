import {fixType, matchSafe} from "../../utils/string";

test('matchSafe can match without throwing errors', () => {
    const noNumbersMatch = matchSafe('i am text only', /[0-9]+/gm);
    const noStringInput = matchSafe(null, /[0-9]+/gm);
    expect(noNumbersMatch).toBeInstanceOf(Array);
    expect(noStringInput).toBeInstanceOf(Array);
});


test('fixType should remove dots in front of types',() => {
    const fixed = fixType('.com.delivery.v1.messages.BatchMessagesRequest');
    expect(fixed).toBe('com.delivery.v1.messages.BatchMessagesRequest');
});
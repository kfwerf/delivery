import {PersistenceRegistry, UrlEntry} from "../../app/persistency/PersistenceRegistry";

test('should add new entry at the bottom', () => {
    const before: UrlEntry[] = [
        { url: 'foo', date: 1624220730214 },
        { url: 'bar', date: 1624220730114 },
        { url: 'baz', date: 1624220730514 },
    ];

    const newEntry = PersistenceRegistry.newEntry('faz');
    const urls = PersistenceRegistry.newUrlEntries(newEntry, 4, before);

    const expected: UrlEntry[] = [
        { url: 'bar', date: 1624220730114 },
        { url: 'baz', date: 1624220730514 },
        newEntry,
        { url: 'foo', date: 1624220730214 },
    ];
    expect(urls).toHaveLength(4);
    expect(urls).toStrictEqual(expected);
});

test('should replace old entry', () => {
    const before: UrlEntry[] = [
        { url: 'foo', date: 1624220730214 },
        { url: 'bar', date: 1624220730114 },
        { url: 'baz', date: 1624220730514 },
    ];

    const newEntry = PersistenceRegistry.newEntry('foo');
    const urls = PersistenceRegistry.newUrlEntries(newEntry, 4, before);

    const expected: UrlEntry[] = [
        { url: 'bar', date: 1624220730114 },
        { url: 'baz', date: 1624220730514 },
        newEntry,
    ];
    expect(urls).toHaveLength(3);
    expect(urls).toStrictEqual(expected);
});

test('should remove earliest entry when limit is reached', () => {
    const before: UrlEntry[] = [
        { url: 'foo', date: 1624220730214 },
        { url: 'bar', date: 1624220730114 },
        { url: 'baz', date: 1624220730514 },
    ];

    const newEntry = PersistenceRegistry.newEntry('faz');
    const urls = PersistenceRegistry.newUrlEntries(newEntry, 3, before);

    const expected: UrlEntry[] = [
        { url: 'baz', date: 1624220730514 },
        newEntry,
        { url: 'foo', date: 1624220730214 },
    ];
    expect(urls).toHaveLength(3);
    expect(urls).toStrictEqual(expected);
});
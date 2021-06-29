import {BodyEntry, PersistenceRegistry, UrlEntry} from "../../app/persistency/PersistenceRegistry";

test('should add new url entry at the bottom', () => {
    const before: UrlEntry[] = [
        { url: 'foo', date: 1624220730214 },
        { url: 'bar', date: 1624220730114 },
        { url: 'baz', date: 1624220730514 },
    ];

    const newEntry = PersistenceRegistry.newUrlEntry('faz');
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

test('should replace old url entry', () => {
    const before: UrlEntry[] = [
        { url: 'foo', date: 1624220730214 },
        { url: 'bar', date: 1624220730114 },
        { url: 'baz', date: 1624220730514 },
    ];

    const newEntry = PersistenceRegistry.newUrlEntry('foo');
    const urls = PersistenceRegistry.newUrlEntries(newEntry, 4, before);

    const expected: UrlEntry[] = [
        { url: 'bar', date: 1624220730114 },
        { url: 'baz', date: 1624220730514 },
        newEntry,
    ];
    expect(urls).toHaveLength(3);
    expect(urls).toStrictEqual(expected);
});

test('should remove earliest url entry when limit is reached', () => {
    const before: UrlEntry[] = [
        { url: 'foo', date: 1624220730214 },
        { url: 'bar', date: 1624220730114 },
        { url: 'baz', date: 1624220730514 },
    ];

    const newEntry = PersistenceRegistry.newUrlEntry('faz');
    const urls = PersistenceRegistry.newUrlEntries(newEntry, 3, before);

    const expected: UrlEntry[] = [
        { url: 'baz', date: 1624220730514 },
        newEntry,
        { url: 'foo', date: 1624220730214 },
    ];
    expect(urls).toHaveLength(3);
    expect(urls).toStrictEqual(expected);
});

test('should add new body entry at the bottom', () => {
    const before: BodyEntry[] = [
        {
            url: 'foo',
            date: 1624220730214,
            method: 'Method/Foo',
            original: '{"request": {"uri":"foo"}}'
        },
        {
            url: 'bar',
            date: 1624220730114,
            method: 'Method/Bar',
            original: '{"request": {"uri":"bar"}}'
        },
        {
            url: 'baz',
            date: 1624220730514,
            method: 'Method/Baz',
            original: '{"request": {"uri":"baz"}}'
        },
    ];

    const newEntry = PersistenceRegistry.newBodyEntry('faz', '{"request": {"uri":"faz"}}', 'Method/Faz');
    const bodyEntries = PersistenceRegistry.newBodyEntries(newEntry, 4, before);

    const expected: BodyEntry[] = [
        {
            url: 'bar',
            date: 1624220730114,
            method: 'Method/Bar',
            original: '{"request": {"uri":"bar"}}'
        },
        {
            url: 'baz',
            date: 1624220730514,
            method: 'Method/Baz',
            original: '{"request": {"uri":"baz"}}'
        },
        newEntry,
        {
            url: 'foo',
            date: 1624220730214,
            method: 'Method/Foo',
            original: '{"request": {"uri":"foo"}}'
        },
    ];
    expect(bodyEntries).toHaveLength(4);
    expect(bodyEntries).toStrictEqual(expected);
});

test('should replace old body entry', () => {
    const before: BodyEntry[] = [
        {
            url: 'foo',
            date: 1624220730214,
            method: 'Method/Foo',
            original: '{"request": {"uri":"foo"}}'
        },
        {
            url: 'bar',
            date: 1624220730114,
            method: 'Method/Bar',
            original: '{"request": {"uri":"bar"}}'
        },
        {
            url: 'baz',
            date: 1624220730514,
            method: 'Method/Baz',
            original: '{"request": {"uri":"baz"}}'
        },
    ];

    const newEntry = PersistenceRegistry.newBodyEntry('foo', '{"request": {"uri":"foo-2"}}', 'Method/Foo');
    const bodyEntries = PersistenceRegistry.newBodyEntries(newEntry, 4, before);

    const expected: BodyEntry[] = [
        {
            url: 'bar',
            date: 1624220730114,
            method: 'Method/Bar',
            original: '{"request": {"uri":"bar"}}'
        },
        {
            url: 'baz',
            date: 1624220730514,
            method: 'Method/Baz',
            original: '{"request": {"uri":"baz"}}'
        },
        newEntry,
    ];
    expect(bodyEntries).toHaveLength(3);
    expect(bodyEntries).toStrictEqual(expected);
});

test('should not replace old body entry when method does not match', () => {
    const before: BodyEntry[] = [
        {
            url: 'foo',
            date: 1624220730214,
            method: 'Method/Foo',
            original: '{"request": {"uri":"foo"}}'
        },
        {
            url: 'bar', date: 1624220730114,
            method: 'Method/Bar',
            original: '{"request": {"uri":"bar"}}'
        },
        {
            url: 'baz',
            date: 1624220730514,
            method: 'Method/Baz',
            original: '{"request": {"uri":"baz"}}'
        },
    ];

    const newEntry = PersistenceRegistry.newBodyEntry('foo', '{"request": {"uri":"foo-2"}}', 'Method/Foo2');
    const bodies = PersistenceRegistry.newBodyEntries(newEntry, 4, before);

    const expected: BodyEntry[] = [
        {
            url: 'bar', date: 1624220730114,
            method: 'Method/Bar',
            original: '{"request": {"uri":"bar"}}'
        },
        {
            url: 'baz',
            date: 1624220730514, method: 'Method/Baz',
            original: '{"request": {"uri":"baz"}}'
        },
        {
            url: 'foo',
            date: 1624220730214, method: 'Method/Foo',
            original: '{"request": {"uri":"foo"}}'
        },
        newEntry,
    ];
    expect(bodies).toHaveLength(4);
    expect(bodies).toStrictEqual(expected);
});

test('should not replace old body entry when url does not match', () => {
    const before: BodyEntry[] = [
        {
            url: 'foo',
            date: 1624220730214,
            method: 'Method/Foo',
            original: '{"request": {"uri":"foo"}}'
        },
        {
            url: 'bar',
            date: 1624220730114,
            method: 'Method/Bar',
            original: '{"request": {"uri":"bar"}}'
        },
        {
            url: 'baz',
            date: 1624220730514,
            method: 'Method/Baz',
            original: '{"request": {"uri":"baz"}}'
        },
    ];

    const newEntry = PersistenceRegistry.newBodyEntry('foo2', '{"request": {"uri":"foo-2"}}', 'Method/Foo');
    const bodies = PersistenceRegistry.newBodyEntries(newEntry, 4, before);

    const expected: BodyEntry[] = [
        {
            url: 'bar',
            date: 1624220730114,
            method: 'Method/Bar',
            original: '{"request": {"uri":"bar"}}'
        },
        {
            url: 'baz',
            date: 1624220730514,
            method: 'Method/Baz',
            original: '{"request": {"uri":"baz"}}'
        },
        {
            url: 'foo',
            date: 1624220730214,
            method: 'Method/Foo',
            original: '{"request": {"uri":"foo"}}'
        },
        newEntry,
    ];
    expect(bodies).toHaveLength(4);
    expect(bodies).toStrictEqual(expected);
});

test('should remove earliest body entry when limit is reached', () => {
    const before: BodyEntry[] = [
        {
            url: 'foo',
            date: 1624220730214,
            method: 'Method/Foo',
            original: '{"request": {"uri":"foo"}}'
        },
        {
            url: 'bar',
            date: 1624220730114,
            method: 'Method/Bar',
            original: '{"request": {"uri":"bar"}}'
        },
        {
            url: 'baz',
            date: 1624220730514,
            method: 'Method/Baz',
            original: '{"request": {"uri":"baz"}}'
        },
    ];

    const newEntry = PersistenceRegistry.newBodyEntry('faz', '{"request": {"uri":"faz"}}', 'Method/Faz');
    const bodyEntries = PersistenceRegistry.newBodyEntries(newEntry, 3, before);

    const expected: BodyEntry[] = [
        {
            url: 'baz',
            date: 1624220730514,
            method: 'Method/Baz',
            original: '{"request": {"uri":"baz"}}'
        },
        newEntry,
        {
            url: 'foo',
            date: 1624220730214,
            method: 'Method/Foo',
            original: '{"request": {"uri":"foo"}}'
        },
    ];
    expect(bodyEntries).toHaveLength(3);
    expect(bodyEntries).toStrictEqual(expected);
});
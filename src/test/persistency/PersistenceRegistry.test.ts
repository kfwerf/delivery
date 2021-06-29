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
            example: '{"request":{"uri":"foo"}}',
            body: '{"request":{"uri":"foo-update"}}',
        },
        {
            url: 'bar',
            date: 1624220730114,
            method: 'Method/Bar',
            example: '{"request":{"uri":"bar"}}',
            body: '{"request":{"uri":"bar-update"}}',
        },
        {
            url: 'baz',
            date: 1624220730514,
            method: 'Method/Baz',
            example: '{"request":{"uri":"baz"}}',
            body: '{"request":{"uri":"baz-update"}}',
        },
    ];

    const newEntry = PersistenceRegistry.newBodyEntry(
        'faz',
        'Method/Faz',
        {"request":{"uri":"faz"}},
        {"request":{"uri":"faz-update"}}
    );
    const bodyEntries = PersistenceRegistry.newBodyEntries(newEntry, 4, before);

    const expected: BodyEntry[] = [
        {
            url: 'bar',
            date: 1624220730114,
            method: 'Method/Bar',
            example: '{"request":{"uri":"bar"}}',
            body: '{"request":{"uri":"bar-update"}}',
        },
        {
            url: 'baz',
            date: 1624220730514,
            method: 'Method/Baz',
            example: '{"request":{"uri":"baz"}}',
            body: '{"request":{"uri":"baz-update"}}',
        },
        newEntry,
        {
            url: 'foo',
            date: 1624220730214,
            method: 'Method/Foo',
            example: '{"request":{"uri":"foo"}}',
            body: '{"request":{"uri":"foo-update"}}',
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
            example: '{"request":{"uri":"foo"}}',
            body: '{"request":{"uri":"foo-update"}}',
        },
        {
            url: 'bar',
            date: 1624220730114,
            method: 'Method/Bar',
            example: '{"request":{"uri":"bar"}}',
            body: '{"request":{"uri":"bar-update"}}',
        },
        {
            url: 'baz',
            date: 1624220730514,
            method: 'Method/Baz',
            example: '{"request":{"uri":"baz"}}',
            body: '{"request":{"uri":"baz-update"}}',
        },
    ];

    const newEntry = PersistenceRegistry.newBodyEntry(
        'foo',
        'Method/Foo',
        {"request":{"uri":"foo"}},
        {"request":{"uri":"foo-update"}}
    );
    const bodyEntries = PersistenceRegistry.newBodyEntries(newEntry, 4, before);

    const expected: BodyEntry[] = [
        {
            url: 'bar',
            date: 1624220730114,
            method: 'Method/Bar',
            example: '{"request":{"uri":"bar"}}',
            body: '{"request":{"uri":"bar-update"}}',
        },
        {
            url: 'baz',
            date: 1624220730514,
            method: 'Method/Baz',
            example: '{"request":{"uri":"baz"}}',
            body: '{"request":{"uri":"baz-update"}}',
        },
        newEntry,
    ];
    expect(bodyEntries).toStrictEqual(expected);
    expect(bodyEntries).toHaveLength(3);
});

test('should not replace old body entry when method does not match', () => {
    const before: BodyEntry[] = [
        {
            url: 'foo',
            date: 1624220730214,
            method: 'Method/Foo',
            example: '{"request":{"uri":"foo"}}',
            body: '{"request":{"uri":"foo-update"}}',
        },
        {
            url: 'bar', date: 1624220730114,
            method: 'Method/Bar',
            example: '{"request":{"uri":"bar"}}',
            body: '{"request":{"uri":"bar-update"}}',
        },
        {
            url: 'baz',
            date: 1624220730514,
            method: 'Method/Baz',
            example: '{"request":{"uri":"baz"}}',
            body: '{"request":{"uri":"baz-update"}}',
        },
    ];

    const newEntry = PersistenceRegistry.newBodyEntry(
        'foo',
        'Method/Foo2',
        {"request":{"uri":"foo"}},
        {"request":{"uri":"foo-update"}}
    );
    const bodies = PersistenceRegistry.newBodyEntries(newEntry, 4, before);

    const expected: BodyEntry[] = [
        {
            url: 'bar', date: 1624220730114,
            method: 'Method/Bar',
            example: '{"request":{"uri":"bar"}}',
            body: '{"request":{"uri":"bar-update"}}',
        },
        {
            url: 'baz',
            date: 1624220730514, method: 'Method/Baz',
            example: '{"request":{"uri":"baz"}}',
            body: '{"request":{"uri":"baz-update"}}',
        },
        {
            url: 'foo',
            date: 1624220730214, method: 'Method/Foo',
            example: '{"request":{"uri":"foo"}}',
            body: '{"request":{"uri":"foo-update"}}',
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
            example: '{"request":{"uri":"foo"}}',
            body: '{"request":{"uri":"foo-update"}}',
        },
        {
            url: 'bar',
            date: 1624220730114,
            method: 'Method/Bar',
            example: '{"request":{"uri":"bar"}}',
            body: '{"request":{"uri":"bar-update"}}',
        },
        {
            url: 'baz',
            date: 1624220730514,
            method: 'Method/Baz',
            example: '{"request":{"uri":"baz"}}',
            body: '{"request":{"uri":"baz-update"}}',
        },
    ];

    const newEntry = PersistenceRegistry.newBodyEntry(
        'foo2',
        'Method/Foo',
        {"request":{"uri":"foo"}},
        {"request":{"uri":"foo-update"}}
    );
    const bodies = PersistenceRegistry.newBodyEntries(newEntry, 4, before);

    const expected: BodyEntry[] = [
        {
            url: 'bar',
            date: 1624220730114,
            method: 'Method/Bar',
            example: '{"request":{"uri":"bar"}}',
            body: '{"request":{"uri":"bar-update"}}',
        },
        {
            url: 'baz',
            date: 1624220730514,
            method: 'Method/Baz',
            example: '{"request":{"uri":"baz"}}',
            body: '{"request":{"uri":"baz-update"}}',
        },
        {
            url: 'foo',
            date: 1624220730214,
            method: 'Method/Foo',
            example: '{"request":{"uri":"foo"}}',
            body: '{"request":{"uri":"foo-update"}}',
        },
        newEntry,
    ];
    expect(bodies).toHaveLength(4);
    expect(bodies).toStrictEqual(expected);
});

test('should not replace old body entry when example does not match', () => {
    const before: BodyEntry[] = [
        {
            url: 'foo',
            date: 1624220730214,
            method: 'Method/Foo',
            example: '{"request":{"uri":"foo"}}',
            body: '{"request":{"uri":"foo-update"}}',
        },
        {
            url: 'bar',
            date: 1624220730114,
            method: 'Method/Bar',
            example: '{"request":{"uri":"bar"}}',
            body: '{"request":{"uri":"bar-update"}}',
        },
        {
            url: 'baz',
            date: 1624220730514,
            method: 'Method/Baz',
            example: '{"request":{"uri":"baz"}}',
            body: '{"request":{"uri":"baz-update"}}',
        },
    ];

    const newEntry = PersistenceRegistry.newBodyEntry(
        'foo',
        'Method/Foo',
        {"request":{"uri":"foo-si-ba"}},
        {"request":{"uri":"foo-update"}}
    );
    const bodies = PersistenceRegistry.newBodyEntries(newEntry, 4, before);

    const expected: BodyEntry[] = [
        {
            url: 'bar',
            date: 1624220730114,
            method: 'Method/Bar',
            example: '{"request":{"uri":"bar"}}',
            body: '{"request":{"uri":"bar-update"}}',
        },
        {
            url: 'baz',
            date: 1624220730514,
            method: 'Method/Baz',
            example: '{"request":{"uri":"baz"}}',
            body: '{"request":{"uri":"baz-update"}}',
        },
        {
            url: 'foo',
            date: 1624220730214,
            method: 'Method/Foo',
            example: '{"request":{"uri":"foo"}}',
            body: '{"request":{"uri":"foo-update"}}',
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
            example: '{"request":{"uri":"foo"}}',
            body: '{"request":{"uri":"foo-update"}}',
        },
        {
            url: 'bar',
            date: 1624220730114,
            method: 'Method/Bar',
            example: '{"request":{"uri":"bar"}}',
            body: '{"request":{"uri":"bar-update"}}',
        },
        {
            url: 'baz',
            date: 1624220730514,
            method: 'Method/Baz',
            example: '{"request":{"uri":"baz"}}',
            body: '{"request":{"uri":"baz-update"}}',
        },
    ];

    const newEntry = PersistenceRegistry.newBodyEntry(
        'faz',
        'Method/Faz',
        {"request":{"uri":"faz"}},
        {"request":{"uri":"faz-update"}}
    );
    const bodyEntries = PersistenceRegistry.newBodyEntries(newEntry, 3, before);

    const expected: BodyEntry[] = [
        {
            url: 'baz',
            date: 1624220730514,
            method: 'Method/Baz',
            example: '{"request":{"uri":"baz"}}',
            body: '{"request":{"uri":"baz-update"}}',
        },
        newEntry,
        {
            url: 'foo',
            date: 1624220730214,
            method: 'Method/Foo',
            example: '{"request":{"uri":"foo"}}',
            body: '{"request":{"uri":"foo-update"}}',
        },
    ];
    expect(bodyEntries).toHaveLength(3);
    expect(bodyEntries).toStrictEqual(expected);
});
export const isScalar = (str: string): boolean => str.indexOf('.') === -1;

export function toScalar(type: string): string|number|boolean|null {
    switch (type) {
        case 'string':
        case 'bytes':
            return '';
        case 'double':
        case 'float':
        case 'int32':
        case 'int64':
        case 'uint32':
        case 'uint64':
        case 'sint32':
        case 'sint64':
        case 'fixed32':
        case 'fixed64':
        case 'sfixed32':
        case 'sfixed64':
            return 0;
        case 'bool':
            return true;
        default:
            return null;
    }
}

export function toScalarKey(type: string): string|number {
    const key = toScalar(type);
    if (typeof key === 'number' || typeof  key === 'string') {
        return key;
    }
    return '';
}
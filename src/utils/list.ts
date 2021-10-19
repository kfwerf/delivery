export const dedupe = (value: never, index: number, array: []): boolean => array.indexOf(value) === index;

export default dedupe;

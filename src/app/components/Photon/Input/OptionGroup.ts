export default class OptionGroup {
    private readonly label: string;
    private readonly value: string;

    constructor(label: string, value: string) {
        this.label = label;
        this.value = value;
    }

    getLabel(): string {
        return this.label;
    }

    getValue(): string {
        return this.value;
    }

    toObject() {
        return { label: this.label, value: this.value };
    }
}
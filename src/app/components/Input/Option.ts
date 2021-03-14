export default class Option {
    private readonly optgroup: string;
    private readonly text: string;
    private readonly value: string;

    constructor(optgroup: string, text: string, value: string) {
        this.optgroup = optgroup;
        this.text = text;
        this.value = value;
    }

    getOptGroup(): string {
        return this.optgroup;
    }

    getText(): string {
        return this.text;
    }

    getValue(): string {
        return this.value;
    }

    toObject() {
        return { optgroup: this.optgroup, text: this.text, value: this.value };
    }
}
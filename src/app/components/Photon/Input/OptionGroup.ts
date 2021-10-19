export type OptionGroupObject = {
  label: string;
  value: string;
};

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

  toObject(): OptionGroupObject {
    const { label, value } = this;
    return { label, value };
  }
}

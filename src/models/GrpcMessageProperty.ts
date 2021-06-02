import { isScalar } from "../utils/conversion";
import {fixType} from "../utils/string";

export default class GrpcMessageProperty {
    private readonly line: string;

    private readonly type: string;

    private readonly key: string;

    private readonly ordinal: number;

    private readonly oneOfKey: string; // FIXME: might want to do this different

    constructor(line: string, type: string, key: string, ordinal: number, oneOfKey = '') {
      this.line = line;
      this.type = fixType(type);
      this.key = key;
      this.ordinal = ordinal;
      this.oneOfKey = oneOfKey;
    }

    public isPrimitive(): boolean {
      return isScalar(this.type);
    }

    public getType(): string {
      return this.type;
    }

    public getKey(): string {
      return this.key;
    }

    public getOrdinal(): number {
        return this.ordinal;
    }

    public isRepeated(): boolean {
        return this.type.startsWith('repeated');
    }

    public isMapped(): boolean {
        return this.type.startsWith('map<');
    }

    public getOneOfKey(): string {
        return this.oneOfKey;
    }
}

import GrpcMessage from "../models/GrpcMessage";

export default class GrpcTypeRegistry {
    private idxTable: string[]; // For seeing when things got added, reverse dependency list
    private registry: Map<string, GrpcMessage>;

    constructor() {
        this.registry = new Map<string, GrpcMessage>();
        this.idxTable = [];
    }

    register(type: GrpcMessage) {
        this.registry.set(type.getPath(), type);
        this.idxTable.push(type.getPath());
        return this;
    }

    get(path: string): GrpcMessage {
        return this.registry.get(path);
    }

    listByDependency(): GrpcMessage[] {
       return Array.from(this.registry.values())
            .sort((a, b) => a.getDependencies().length - b.getDependencies().length);
    }
}
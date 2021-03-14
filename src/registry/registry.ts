import GrpcMessage from "../models/GrpcMessage";
import GrpcService from "../models/GrpcService";
import GrpcRpc from "../models/GrpcRpc";

export default class GrpcTypeRegistry {
    private registryMessage: Map<string, GrpcMessage>;
    private registryService: Map<string, GrpcService>;

    constructor() {
        this.registryMessage = new Map<string, GrpcMessage>();
        this.registryService = new Map<string, GrpcService>();
    }

    registerMessage(type: GrpcMessage) {
        this.registryMessage.set(type.getPath(), type);
        return this;
    }

    registerService(type: GrpcService) {
        this.registryService.set(type.getPath(), type);
        return this;
    }

    getMessage(path: string): GrpcMessage {
        return this.registryMessage.get(path);
    }

    getService(path: string): GrpcService {
        return this.registryService.get(path);
    }

    getRpc(path: string): GrpcRpc {
        const rpcs = Array.from(this.registryService.values())
            .map(service => service.getRpcList())
            .reduce((a,b) => a.concat(b), []);

        return rpcs.filter(rpc => rpc.getPath() === path)[0];
    }

    listMessages(): GrpcMessage[] {
        return Array.from(this.registryMessage.values());
    }

    listServices(): GrpcService[] {
        return Array.from(this.registryService.values());
    }

    listMessagesByDependency(): GrpcMessage[] {
        return Array.from(this.registryMessage.values())
            .sort((a, b) => a.getDependencies().length - b.getDependencies().length);
    }
}
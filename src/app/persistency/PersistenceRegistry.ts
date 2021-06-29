import {GrpcMessageRecord} from "../../models/GrpcMessage";

export type UrlEntry = { url: string, date: number };
export type BodyEntry = {
    url: string,
    date: number,
    example: string,
    body: string,
    method: string,
};

const LOCAL_URL_KEY = 'URL';
const LOCAL_BODY_KEY = 'BODY';
const MAX_LIMIT = 50;

export class PersistenceRegistry {
    private static fromLocalStorage(key: string) {
        return JSON.parse(localStorage.getItem(key) || '[]');
    }

    private static toLocalStorage(key: string, entries: any[] = []) {
        return localStorage.setItem(key, JSON.stringify(entries));
    }

    private static UrlEntriesFromLocalStorage(): UrlEntry[] {
        return PersistenceRegistry.fromLocalStorage(LOCAL_URL_KEY) as UrlEntry[];
    }

    private static UrlEntriesToLocalStorage(urlEntries: UrlEntry[] = []) {
        return PersistenceRegistry.toLocalStorage(LOCAL_URL_KEY, urlEntries);
    }

    public static newUrlEntries(newEntry: UrlEntry, limit: number = MAX_LIMIT, beforeEntries: UrlEntry[] = PersistenceRegistry.UrlEntriesFromLocalStorage()): UrlEntry[] {
        return beforeEntries
            .filter(entry => entry.url !== newEntry.url)
            .sort((a, b) => b.date - a.date)
            .slice(0, limit - 1)
            .concat([newEntry])
            .sort((a, b) => a.url.localeCompare(b.url));
    }

    public static newUrlEntry(url: string): UrlEntry {
        const date = new Date().getTime();
        return { url, date };
    }

    public setUrl(newEntry: UrlEntry) {
        PersistenceRegistry.UrlEntriesToLocalStorage(PersistenceRegistry.newUrlEntries(newEntry));
    }

    public getUrls(): UrlEntry[] {
        return PersistenceRegistry.UrlEntriesFromLocalStorage();
    }

    public clearUrls() {
        PersistenceRegistry.UrlEntriesToLocalStorage([]);
    }

    private static BodyEntriesFromLocalStorage(): BodyEntry[] {
        return PersistenceRegistry.fromLocalStorage(LOCAL_BODY_KEY) as BodyEntry[];
    }

    private static BodyEntriesToLocalStorage(bodyEntries: BodyEntry[] = []) {
        return PersistenceRegistry.toLocalStorage(LOCAL_BODY_KEY, bodyEntries);
    }

    public static newBodyEntry(url: string, method: string, example: GrpcMessageRecord, body: GrpcMessageRecord): BodyEntry {
        const date = new Date().getTime();
        return { url, method, date, example: JSON.stringify(example), body: JSON.stringify(body) };
    }

    public static newBodyEntries(newEntry: BodyEntry, limit: number = MAX_LIMIT, beforeEntries: BodyEntry[] = PersistenceRegistry.BodyEntriesFromLocalStorage()): BodyEntry[] {
        return beforeEntries
            .filter(entry => {
                const hasUrl = entry.url === newEntry.url;
                const hasMethod = entry.method === newEntry.method;
                const hasExample = entry.example == newEntry.example;
                const isSame = hasUrl && hasMethod && hasExample;
                return !isSame;
            })
            .sort((a, b) => b.date - a.date)
            .slice(0, limit - 1)
            .concat([newEntry])
            .sort((a, b) => a.url.localeCompare(b.url));
    }


    public setBody(newEntry: BodyEntry) {
        PersistenceRegistry.BodyEntriesToLocalStorage(PersistenceRegistry.newBodyEntries(newEntry));
    }

    public getBodies(): BodyEntry[] {
        return PersistenceRegistry.BodyEntriesFromLocalStorage();
    }

    public getBody(url: string, method: string, example: GrpcMessageRecord): BodyEntry {
        const newEntry = PersistenceRegistry.newBodyEntry(url, method, example, {});
        const foundEntries = this.getBodies().filter(entry => {
            const hasUrl = entry.url === newEntry.url;
            const hasMethod = entry.method === newEntry.method;
            const hasExample = entry.example == newEntry.example;
            return hasUrl && hasMethod && hasExample;
        });
        return foundEntries[0] || PersistenceRegistry.newBodyEntry(url, method, example, example);
    }

    public clearBodies() {
        PersistenceRegistry.BodyEntriesToLocalStorage([]);
    }

}

const registry = new PersistenceRegistry();
export default registry;
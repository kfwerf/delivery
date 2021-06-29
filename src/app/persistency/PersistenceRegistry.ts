import * as Url from "url";
import * as url from "url";

export type UrlEntry = { url: string, date: number };
export type BodyEntry = {
    url: string,
    date: number,
    original: string,
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

    public setUrl(url: string) {
        PersistenceRegistry.UrlEntriesToLocalStorage(PersistenceRegistry.newUrlEntries(PersistenceRegistry.newUrlEntry(url)));
    }

    public getUrls() {
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

    public static newBodyEntry(url: string, original: string, method: string): BodyEntry {
        const date = new Date().getTime();
        return { url, date, original, method };
    }

    public static newBodyEntries(newEntry: BodyEntry, limit: number = MAX_LIMIT, beforeEntries: BodyEntry[] = PersistenceRegistry.BodyEntriesFromLocalStorage()): BodyEntry[] {
        return beforeEntries
            .filter(entry => {
                const isUrl = entry.url === newEntry.url;
                const isMethod = entry.method === newEntry.method;
                const isSame = isUrl && isMethod;
                return !isSame;
            })
            .sort((a, b) => b.date - a.date)
            .slice(0, limit - 1)
            .concat([newEntry])
            .sort((a, b) => a.url.localeCompare(b.url));
    }


    public setBody(url: string, original: string, method: string) {
        PersistenceRegistry.BodyEntriesToLocalStorage(PersistenceRegistry.newBodyEntries(PersistenceRegistry.newBodyEntry(url, original, method)));
    }

    public getBodies() {
        return PersistenceRegistry.BodyEntriesFromLocalStorage();
    }

    public clearBodies() {
        PersistenceRegistry.BodyEntriesToLocalStorage([]);
    }

}

const registry = new PersistenceRegistry();
export default registry;
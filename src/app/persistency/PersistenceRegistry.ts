export type UrlEntry = { url: string, date: number };

const LOCAL_KEY = 'URL';
const MAX_LIMIT = 50;

export class PersistenceRegistry {
    private static fromLocalStorage(): UrlEntry[] {
        return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
    }

    private static toLocalStorage(urlEntries: UrlEntry[] = []) {
        return localStorage.setItem(LOCAL_KEY, JSON.stringify(urlEntries));
    }

    public static newEntry(url: string): UrlEntry {
        const date = new Date().getTime();
        return { url, date };
    }

    public static newUrlEntries(newEntry: UrlEntry, limit: number = MAX_LIMIT, beforeEntries: UrlEntry[] = PersistenceRegistry.fromLocalStorage()): UrlEntry[] {
        return beforeEntries
            .filter(entry => entry.url !== newEntry.url)
            .sort((a, b) => b.date - a.date)
            .slice(0, limit - 1)
            .concat([newEntry])
            .sort((a, b) => a.url.localeCompare(b.url));
    }

    public setUrl(url: string) {
        PersistenceRegistry.toLocalStorage(PersistenceRegistry.newUrlEntries(PersistenceRegistry.newEntry(url)));
    }

    public getUrls() {
        return PersistenceRegistry.fromLocalStorage();
    }

    public clearUrls() {
        PersistenceRegistry.toLocalStorage([]);
    }
}

const registry = new PersistenceRegistry();
export default registry;
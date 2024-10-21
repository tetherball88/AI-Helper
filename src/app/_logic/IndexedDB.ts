
export class IndexedDbService<DataType> {
    private db: IDBDatabase | null
    constructor(private dbName: string, private storeName: string) {
        this.dbName = dbName;
        this.storeName = storeName;
        this.db = null;
    }
    
    private getResult(event: any) {
        return event.target.result as any
    }

    // Initialize the database
    init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: 'id' });
                }
            };

            request.onsuccess = (event) => {
                this.db = (event.target as IDBOpenDBRequest).result;
                resolve(undefined);
            };

            request.onerror = (event) => {
                console.error('Database error:', (event.target as IDBOpenDBRequest).error);
                reject((event.target as IDBOpenDBRequest).error);
            };
        });
    }

    // Add or update an item
    async addItem(item: DataType) {
        if (!this.db) {
            await this.init()
        }

        const db = this.db as IDBDatabase

        return new Promise<DataType>((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(item); // Use put for adding or updating

            request.onsuccess = () => {
                resolve(item);
            };

            request.onerror = (event) => {
                console.error('Add/Update Item error:', (event.target as IDBOpenDBRequest).error);
                reject((event.target as IDBOpenDBRequest).error);
            };
        });
    }

    // Get an item by key
    async getItem(key: string) {
        if (!this.db) {
            await this.init()
        }

        const db = this.db as IDBDatabase

        return new Promise<DataType>((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);

            request.onsuccess = (event) => {
                resolve(this.getResult(event));
            };

            request.onerror = (event) => {
                console.error('Get Item error:', (event.target as IDBOpenDBRequest).error);
                reject((event.target as IDBOpenDBRequest).error);
            };
        });
    }

    // Delete an item by key
    async deleteItem(key: string ) {
        if (!this.db) {
            await this.init()
        }

        const db = this.db as IDBDatabase

        return new Promise<void>((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(key);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = (event) => {
                console.error('Delete Item error:', (event.target as IDBOpenDBRequest).error);
                reject((event.target as IDBOpenDBRequest).error);
            };
        });
    }

    // Get all items
    async getAllItems() {
        if (!this.db) {
            await this.init()
        }

        const db = this.db as IDBDatabase

        return new Promise<DataType[]>((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = (event) => {
                resolve(this.getResult(event));
            };

            request.onerror = (event) => {
                console.error('Get All Items error:', (event.target as IDBOpenDBRequest).error);
                reject((event.target as IDBOpenDBRequest).error);
            };
        });
    }
}

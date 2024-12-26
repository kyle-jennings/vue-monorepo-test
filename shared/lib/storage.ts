// eslint-disable-next-line max-classes-per-file
abstract class StorageWrapper {
  // All storage data will be stored under this namespace
  public static readonly STORAGE_PREFIX = 'test-app';

  protected storage: Storage;

  public constructor(storage: Storage) {
    this.storage = storage;
  }

  public getItem(key: string): unknown {
    const storageObj = this.getStorageData();

    if (!storageObj) {
      return null;
    }

    return storageObj[key] || null;
  }

  public setItem(key: string, value: unknown): void {
    const storageObj = this.getStorageData();
    storageObj[key] = value;

    this.setStorageData(storageObj);
  }

  public removeItem(key: string): void {
    const storageObj = this.getStorageData();

    if (storageObj[key]) {
      delete storageObj[key];
    }

    this.setStorageData(storageObj);
  }

  public clear(): void {
    this.storage.removeItem(StorageWrapper.STORAGE_PREFIX);
  }

  private getStorageData(): any {
    return JSON.parse(this.storage.getItem(StorageWrapper.STORAGE_PREFIX) || '{}');
  }

  private setStorageData(data: unknown): void {
    this.storage.setItem(StorageWrapper.STORAGE_PREFIX, JSON.stringify(data));
  }
}

class LocalStorageWrapper extends StorageWrapper {
  constructor() {
    super(window.localStorage);
  }
}

class SessionStorageWrapper extends StorageWrapper {
  constructor() {
    super(window.sessionStorage);
  }
}

export {
  StorageWrapper,
  LocalStorageWrapper,
  SessionStorageWrapper,
};

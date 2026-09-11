import { createFilePersistDriver } from "./file-driver";
import {
  isExplicitWipe,
  markPersistReady,
  persistNow,
  registerPersistSaver,
  setHydrating,
  type PersistDriver,
} from "./persist-hook";
import {
  captureSnapshot,
  isVacantSnapshot,
  restoreSnapshot,
  snapshotTextHasUserData,
  type AppSnapshot,
} from "./snapshot";

export type { PersistDriver };

const memory = new Map<string, string>();
const MEMORY_KEY = "puffpuffstop-snapshot";
const MEMORY_BACKUP_KEY = "puffpuffstop-snapshot.bak";

export function createMemoryPersistDriver(
  store: Map<string, string> = memory,
): PersistDriver {
  return {
    read() {
      return store.get(MEMORY_KEY) ?? null;
    },
    write(value: string) {
      store.set(MEMORY_KEY, value);
    },
    readBackup() {
      return store.get(MEMORY_BACKUP_KEY) ?? null;
    },
    writeBackup(value: string) {
      store.set(MEMORY_BACKUP_KEY, value);
    },
  };
}

let driver: PersistDriver = createMemoryPersistDriver();

function save(): void {
  const wipe = isExplicitWipe();
  const snapshot = captureSnapshot();
  const payload = JSON.stringify(snapshot);
  const existing = driver.read();
  if (existing && typeof (existing as Promise<unknown>).then === "function") {
    void Promise.resolve(existing).then((value) => {
      applyGuardedWrite(value, snapshot, payload, wipe);
    });
    return;
  }
  applyGuardedWrite(existing as string | null, snapshot, payload, wipe);
}

function applyGuardedWrite(
  existing: string | null,
  snapshot: AppSnapshot,
  payload: string,
  wipe: boolean,
): void {
  if (!wipe && isVacantSnapshot(snapshot) && existing && snapshotTextHasUserData(existing)) {
    return;
  }
  if (
    existing &&
    snapshotTextHasUserData(existing) &&
    !isVacantSnapshot(snapshot)
  ) {
    driver.writeBackup?.(existing);
  }
  void Promise.resolve(driver.write(payload));
}

registerPersistSaver(save);

export function setPersistDriver(next: PersistDriver): void {
  driver = next;
}

export function resetPersistDriver(): void {
  memory.clear();
  driver = createMemoryPersistDriver();
  markPersistReady();
}

async function restoreRaw(raw: string | null): Promise<boolean> {
  if (!raw) return false;
  try {
    return restoreSnapshot(JSON.parse(raw));
  } catch {
    return false;
  }
}

export async function hydrateFromDriver(): Promise<boolean> {
  setHydrating(true);
  try {
    const primary = await Promise.resolve(driver.read());
    if (await restoreRaw(primary)) return true;
    const backup = driver.readBackup
      ? await Promise.resolve(driver.readBackup())
      : null;
    return restoreRaw(backup);
  } finally {
    setHydrating(false);
  }
}

export async function bootPersist(): Promise<boolean> {
  setHydrating(true);
  try {
    const fileDriver = await createFilePersistDriver();
    if (fileDriver) {
      setPersistDriver(fileDriver);
    }
    return await hydrateFromDriver();
  } finally {
    setHydrating(false);
    markPersistReady();
  }
}

export { persistNow };

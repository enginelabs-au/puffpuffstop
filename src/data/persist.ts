import { createFilePersistDriver } from "./file-driver";
import {
  persistNow,
  registerPersistSaver,
  setHydrating,
  type PersistDriver,
} from "./persist-hook";
import { captureSnapshot, restoreSnapshot } from "./snapshot";

export type { PersistDriver };

const memory = new Map<string, string>();
const MEMORY_KEY = "puffpuffstop-snapshot";

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
  };
}

let driver: PersistDriver = createMemoryPersistDriver();

function save(): void {
  void Promise.resolve(driver.write(JSON.stringify(captureSnapshot())));
}

registerPersistSaver(save);

export function setPersistDriver(next: PersistDriver): void {
  driver = next;
}

export function resetPersistDriver(): void {
  memory.clear();
  driver = createMemoryPersistDriver();
}

export async function hydrateFromDriver(): Promise<boolean> {
  const raw = await Promise.resolve(driver.read());
  if (!raw) return false;
  setHydrating(true);
  try {
    return restoreSnapshot(JSON.parse(raw));
  } catch {
    return false;
  } finally {
    setHydrating(false);
  }
}

export async function bootPersist(): Promise<boolean> {
  const fileDriver = await createFilePersistDriver();
  if (fileDriver) {
    setPersistDriver(fileDriver);
  }
  return hydrateFromDriver();
}

export { persistNow };

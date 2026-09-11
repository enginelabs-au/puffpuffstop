export type PersistDriver = {
  read(): string | null | Promise<string | null>;
  write(value: string): void | Promise<void>;
  readBackup?(): string | null | Promise<string | null>;
  writeBackup?(value: string): void | Promise<void>;
};

let hydrating = false;
let persistReady = true;
let explicitWipe = false;
let saver: (() => void) | null = null;

export function setHydrating(value: boolean): void {
  hydrating = value;
}

export function registerPersistSaver(fn: () => void): void {
  saver = fn;
}

export function markPersistReady(): void {
  persistReady = true;
}

export function persistNow(): void {
  if (hydrating || !persistReady) return;
  saver?.();
}

export function isExplicitWipe(): boolean {
  return explicitWipe;
}

export function runExplicitWipe(write: () => void): void {
  explicitWipe = true;
  try {
    write();
  } finally {
    explicitWipe = false;
  }
}

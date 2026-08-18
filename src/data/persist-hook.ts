export type PersistDriver = {
  read(): string | null | Promise<string | null>;
  write(value: string): void | Promise<void>;
};

let hydrating = false;
let saver: (() => void) | null = null;

export function setHydrating(value: boolean): void {
  hydrating = value;
}

export function registerPersistSaver(fn: () => void): void {
  saver = fn;
}

export function persistNow(): void {
  if (hydrating) return;
  saver?.();
}

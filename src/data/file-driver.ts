import type { PersistDriver } from "./persist-hook";

const SNAPSHOT_FILE = "puffpuffstop-snapshot.json";

type SnapshotFile = {
  exists: boolean;
  text(): Promise<string>;
  write(content: string): void;
  create(options?: { overwrite?: boolean }): void;
};

type ModernFileSystem = {
  File: new (...pathParts: unknown[]) => SnapshotFile;
  Paths?: { document?: unknown };
};

export async function createFilePersistDriver(): Promise<PersistDriver | null> {
  try {
    const FS = (await import("expo-file-system")) as unknown as ModernFileSystem;
    if (typeof FS.File !== "function" || !FS.Paths?.document) return null;
    const directory = FS.Paths.document;
    return {
      async read() {
        try {
          const file = new FS.File(directory, SNAPSHOT_FILE);
          if (!file.exists) return null;
          return await file.text();
        } catch {
          return null;
        }
      },
      async write(value: string) {
        const file = new FS.File(directory, SNAPSHOT_FILE);
        if (!file.exists) {
          file.create({ overwrite: true });
        }
        file.write(value);
      },
    };
  } catch {
    return null;
  }
}

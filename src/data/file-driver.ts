import type { PersistDriver } from "./persist-hook";

const SNAPSHOT_FILE = "puffpuffstop-snapshot.json";
const SNAPSHOT_BACKUP_FILE = "puffpuffstop-snapshot.bak.json";

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
        return readNamed(FS, directory, SNAPSHOT_FILE);
      },
      async write(value: string) {
        writeNamed(FS, directory, SNAPSHOT_FILE, value);
      },
      async readBackup() {
        return readNamed(FS, directory, SNAPSHOT_BACKUP_FILE);
      },
      async writeBackup(value: string) {
        writeNamed(FS, directory, SNAPSHOT_BACKUP_FILE, value);
      },
    };
  } catch {
    return null;
  }
}

async function readNamed(
  FS: ModernFileSystem,
  directory: unknown,
  name: string,
): Promise<string | null> {
  try {
    const file = new FS.File(directory, name);
    if (!file.exists) return null;
    return await file.text();
  } catch {
    return null;
  }
}

function writeNamed(
  FS: ModernFileSystem,
  directory: unknown,
  name: string,
  value: string,
): void {
  const file = new FS.File(directory, name);
  if (!file.exists) {
    file.create({ overwrite: true });
  }
  file.write(value);
}

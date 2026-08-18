export type DeviceType = "disposable" | "pod" | "refillable";

export type BrandRow = {
  id: string;
  name: string;
  deviceType: DeviceType | null;
  puffsPerStandardDevice: number | null;
};

export const CATALOG_BRAND_NAMES = [
  "IGET",
  "Alibarbar",
  "Elf Bar",
  "Lost Mary",
  "Geek Bar",
  "Vuse",
  "JUUL",
  "RELX",
] as const;

export const BRAND_CATALOG: readonly BrandRow[] = [];

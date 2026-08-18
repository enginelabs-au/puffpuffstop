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

/** Estimation defaults only. Not a recommendation to buy any brand. */
export const BRAND_CATALOG: readonly BrandRow[] = [
  { id: "iget", name: "IGET", deviceType: "disposable", puffsPerStandardDevice: 3500 },
  { id: "alibarbar", name: "Alibarbar", deviceType: "disposable", puffsPerStandardDevice: 5000 },
  { id: "elf-bar", name: "Elf Bar", deviceType: "disposable", puffsPerStandardDevice: 600 },
  { id: "lost-mary", name: "Lost Mary", deviceType: "disposable", puffsPerStandardDevice: 600 },
  { id: "geek-bar", name: "Geek Bar", deviceType: "disposable", puffsPerStandardDevice: 5000 },
  { id: "vuse", name: "Vuse", deviceType: "pod", puffsPerStandardDevice: 300 },
  { id: "juul", name: "JUUL", deviceType: "pod", puffsPerStandardDevice: 200 },
  { id: "relx", name: "RELX", deviceType: "pod", puffsPerStandardDevice: 400 },
];

export function catalogBrandById(id: string): BrandRow | undefined {
  return BRAND_CATALOG.find((row) => row.id === id);
}

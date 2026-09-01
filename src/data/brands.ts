export type DeviceType = "disposable" | "pod" | "refillable";

export type BrandRow = {
  id: string;
  name: string;
  deviceType: DeviceType | null;
  puffsPerStandardDevice: number | null;
};

export type VapeProduct = {
  id: string;
  brandId: string;
  name: string;
  deviceType: DeviceType;
  claimedPuffs: number;
  confirmedNicotineMgMl: readonly number[];
  sourceNote: string;
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

/**
 * Manufacturer or official-listing claims only.
 * Puff counts are “up to” marketing figures. Nicotine lists only strengths
 * that appear on official or widely documented product specs for that SKU.
 */
export const VAPE_PRODUCTS: readonly VapeProduct[] = [
  {
    id: "iget-bar-3500",
    brandId: "iget",
    name: "Bar 3500",
    deviceType: "disposable",
    claimedPuffs: 3500,
    confirmedNicotineMgMl: [50],
    sourceNote: "IGET Bar listing: up to 3500 puffs, 5% (50 mg/ml).",
  },
  {
    id: "iget-legend",
    brandId: "iget",
    name: "Legend",
    deviceType: "disposable",
    claimedPuffs: 4000,
    confirmedNicotineMgMl: [50],
    sourceNote: "IGET Legend listing: up to 4000 puffs, 5% (50 mg/ml).",
  },
  {
    id: "iget-moon",
    brandId: "iget",
    name: "Moon",
    deviceType: "disposable",
    claimedPuffs: 5000,
    confirmedNicotineMgMl: [50],
    sourceNote: "IGET Moon listing: up to 5000 puffs, 5% (50 mg/ml).",
  },
  {
    id: "iget-hot",
    brandId: "iget",
    name: "Hot",
    deviceType: "disposable",
    claimedPuffs: 5500,
    confirmedNicotineMgMl: [50],
    sourceNote: "IGET Hot listing: up to 5500 puffs, 5% (50 mg/ml).",
  },
  {
    id: "iget-bar-pro",
    brandId: "iget",
    name: "Bar Pro",
    deviceType: "disposable",
    claimedPuffs: 10000,
    confirmedNicotineMgMl: [50],
    sourceNote: "IGET Bar Pro listing: up to 10,000 puffs, 5% (50 mg/ml).",
  },
  {
    id: "iget-one-12000",
    brandId: "iget",
    name: "ONE 12000",
    deviceType: "disposable",
    claimedPuffs: 12000,
    confirmedNicotineMgMl: [50],
    sourceNote: "IGET ONE listing: up to 12,000 puffs, 5% (50 mg/ml).",
  },
  {
    id: "alibarbar-ingot-9000",
    brandId: "alibarbar",
    name: "Ingot 9000",
    deviceType: "disposable",
    claimedPuffs: 9000,
    confirmedNicotineMgMl: [50],
    sourceNote: "ALIBARBAR Ingot listing: up to 9000 puffs, 5% (50 mg/ml).",
  },
  {
    id: "elfbar-600",
    brandId: "elf-bar",
    name: "600",
    deviceType: "disposable",
    claimedPuffs: 600,
    confirmedNicotineMgMl: [20],
    sourceNote: "Elf Bar 600 TPD listing: 600 puffs, 20 mg/ml (2%).",
  },
  {
    id: "elfbar-1500",
    brandId: "elf-bar",
    name: "1500",
    deviceType: "disposable",
    claimedPuffs: 1500,
    confirmedNicotineMgMl: [20],
    sourceNote: "Elf Bar 1500 TPD listing: 1500 puffs, 20 mg/ml.",
  },
  {
    id: "lost-mary-bm600",
    brandId: "lost-mary",
    name: "BM600",
    deviceType: "disposable",
    claimedPuffs: 600,
    confirmedNicotineMgMl: [20],
    sourceNote: "Lost Mary BM600 TPD listing: 600 puffs, 20 mg/ml.",
  },
  {
    id: "lost-mary-os5000",
    brandId: "lost-mary",
    name: "OS5000",
    deviceType: "disposable",
    claimedPuffs: 5000,
    confirmedNicotineMgMl: [50],
    sourceNote: "Lost Mary OS5000 US listing: up to 5000 puffs, 5% (50 mg/ml).",
  },
  {
    id: "geek-bar-pulse",
    brandId: "geek-bar",
    name: "Pulse",
    deviceType: "disposable",
    claimedPuffs: 15000,
    confirmedNicotineMgMl: [50],
    sourceNote: "Geek Bar Pulse US listing: up to 15,000 puffs, 5% (50 mg/ml).",
  },
  {
    id: "vuse-alto-pod",
    brandId: "vuse",
    name: "Alto pod",
    deviceType: "pod",
    claimedPuffs: 270,
    confirmedNicotineMgMl: [18, 50],
    sourceNote: "Vuse Alto US pods: about 270 puffs; 1.8% and 5% nicotine.",
  },
  {
    id: "juul-pod",
    brandId: "juul",
    name: "JUUL pod",
    deviceType: "pod",
    claimedPuffs: 200,
    confirmedNicotineMgMl: [35, 59],
    sourceNote: "JUUL Labs US: about 200 puffs/pod; 3% (35 mg/ml) and 5% (59 mg/ml).",
  },
  {
    id: "relx-classic-pod",
    brandId: "relx",
    name: "Classic pod",
    deviceType: "pod",
    claimedPuffs: 380,
    confirmedNicotineMgMl: [18, 30, 50],
    sourceNote: "RELX classic pod listings: about 380 puffs; 1.8%, 3%, and 5% by market.",
  },
];

export const BRAND_CATALOG: readonly BrandRow[] = [
  { id: "iget", name: "IGET", deviceType: "disposable", puffsPerStandardDevice: 3500 },
  { id: "alibarbar", name: "Alibarbar", deviceType: "disposable", puffsPerStandardDevice: 9000 },
  { id: "elf-bar", name: "Elf Bar", deviceType: "disposable", puffsPerStandardDevice: 600 },
  { id: "lost-mary", name: "Lost Mary", deviceType: "disposable", puffsPerStandardDevice: 600 },
  { id: "geek-bar", name: "Geek Bar", deviceType: "disposable", puffsPerStandardDevice: 15000 },
  { id: "vuse", name: "Vuse", deviceType: "pod", puffsPerStandardDevice: 270 },
  { id: "juul", name: "JUUL", deviceType: "pod", puffsPerStandardDevice: 200 },
  { id: "relx", name: "RELX", deviceType: "pod", puffsPerStandardDevice: 380 },
];

export function catalogBrandById(id: string): BrandRow | undefined {
  return BRAND_CATALOG.find((row) => row.id === id);
}

export function catalogProductById(id: string): VapeProduct | undefined {
  return VAPE_PRODUCTS.find((row) => row.id === id);
}

export function productsForBrand(brandId: string): VapeProduct[] {
  return VAPE_PRODUCTS.filter((row) => row.brandId === brandId);
}

export function nicotineOptionsForProduct(product: VapeProduct | undefined): number[] {
  return product ? [...product.confirmedNicotineMgMl] : [];
}

export function sanitizeDecimalText(raw: string): string {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  const dot = cleaned.indexOf(".");
  if (dot < 0) return cleaned;
  return `${cleaned.slice(0, dot + 1)}${cleaned.slice(dot + 1).replace(/\./g, "")}`;
}

export function decimalToNumber(text: string): number | null {
  if (text === "" || text === "." || text.endsWith(".")) return null;
  if (!/^\d*\.\d+$|^\d+$/.test(text)) return null;
  const value = Number(text);
  return Number.isFinite(value) ? value : null;
}

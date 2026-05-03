// lib/slugify.ts

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function citySlug(city: string): string {
  // "Austin, TX" -> "austin-tx"; "New York, NY" -> "new-york-ny"
  return slugify(city);
}

export function unslugifyCity(slug: string): string {
  // "austin-tx" -> "Austin, Tx" (display only — never round-trip queries through this)
  const parts = slug.split("-");
  if (parts.length < 2) {
    return parts.map(capitalize).join(" ");
  }
  const stateCode = parts[parts.length - 1];
  const cityWords = parts.slice(0, -1).map(capitalize).join(" ");
  return `${cityWords}, ${stateCode.toUpperCase()}`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

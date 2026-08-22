// Shared helpers for the paginated blog index and search.
// Lifted from the forbes.et implementation so both sites behave identically.

export const PAGE_SIZE = 12;

export function parsePage(raw: string | string[] | undefined): number {
  const n = Number(Array.isArray(raw) ? raw[0] : raw);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

// Slice bounds for GROQ [$start...$end] (end exclusive).
export function sliceRange(page: number, size: number): { start: number; end: number } {
  const start = (page - 1) * size;
  return { start, end: start + size };
}

export function pageCount(total: number, size: number): number {
  return Math.max(1, Math.ceil(total / size));
}

// Turn a raw user query into a wildcarded GROQ `match` string: each token gets
// a trailing `*` for prefix matching ("vector db" → "vector* db*"). Returns
// null when there's nothing searchable so callers can short-circuit.
export function toMatchQuery(raw: string | undefined): string | null {
  if (!raw) return null;
  const tokens = raw
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.replace(/[^\p{L}\p{N}]+/gu, ""))
    .filter(Boolean)
    .slice(0, 8);
  if (tokens.length === 0) return null;
  return tokens.map((t) => `${t}*`).join(" ");
}

export function formatDate(iso: string | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

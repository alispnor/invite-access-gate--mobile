/** Normaliza respostas `{ rows | data, count | total }` ou array simples. */
export function extractListRows<T>(response: unknown): T[] {
  if (response == null) return [];
  if (Array.isArray(response)) return response as T[];
  if (typeof response !== 'object') return [];
  const o = response as Record<string, unknown>;
  const rows = o.rows ?? o.data;
  return Array.isArray(rows) ? (rows as T[]) : [];
}

export function extractListTotal(response: unknown): number {
  if (response == null || typeof response !== 'object') return 0;
  const o = response as Record<string, unknown>;
  const t = o.total ?? o.count;
  return typeof t === 'number' ? t : 0;
}

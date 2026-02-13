export function daysBetweenUTC(startISO: string, end: Date) {
  const [y, m, d] = startISO.split("-").map(Number);
  const startUTC = Date.UTC(y, m - 1, d);
  const endUTC = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  const diffMs = endUTC - startUTC;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

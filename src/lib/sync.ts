// The first moment the static pages go stale with nothing changed on GitHub: the new year, for
// the footer's ©.
export function staleAt(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear() + 1, 0, 1));
}

// The first moment the static pages go stale with nothing changed on GitHub: the date of the
// next scheduled post, or the new year for the footer's ©.
export function staleAt(publishDates: Date[], now: Date): Date {
  const newYear = new Date(Date.UTC(now.getUTCFullYear() + 1, 0, 1));
  return publishDates
    .filter(date => date > now)
    .reduce((first, date) => (date < first ? date : first), newYear);
}

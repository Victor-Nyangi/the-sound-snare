// Replaces moment(), which was ~70 KB gzipped, not tree-shakeable and in
// maintenance mode upstream, for a single date format.
const formatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** e.g. "Thursday, 12 January 2023" */
export function formatDate(value: string | number | Date): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return formatter.format(date);
}

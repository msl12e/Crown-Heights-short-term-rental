export function formatPrice(cents: number): string {
  return `$${cents.toLocaleString("en-US")}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function nights(checkIn: Date | string, checkOut: Date | string): number {
  const a = typeof checkIn === "string" ? new Date(checkIn) : checkIn;
  const b = typeof checkOut === "string" ? new Date(checkOut) : checkOut;
  return Math.max(
    1,
    Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)),
  );
}

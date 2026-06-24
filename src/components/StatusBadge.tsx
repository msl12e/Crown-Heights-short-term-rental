import type { BookingStatus, PropertyStatus } from "@prisma/client";

export default function StatusBadge({
  status,
}: {
  status: PropertyStatus | BookingStatus;
}) {
  return (
    <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatPrice, nights } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";
import { cancelBookingAction } from "@/lib/actions/bookings";

export default async function GuestBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ requested?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "GUEST") redirect("/dashboard");

  const { requested } = await searchParams;

  const bookings = await prisma.booking.findMany({
    where: { guestId: user.id },
    orderBy: { createdAt: "desc" },
    include: { property: true },
  });

  return (
    <section className="section">
      <div className="page-head">
        <h2>My Bookings</h2>
        <Link href="/properties" className="btn">
          Browse Properties
        </Link>
      </div>

      {requested && (
        <div className="alert alert-success">
          Booking requested! The host will review your request.
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="empty">
          You have no bookings yet.{" "}
          <Link href="/properties" style={{ color: "var(--blue)" }}>
            Find a stay
          </Link>
          .
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Dates</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => {
              const n = nights(b.checkIn, b.checkOut);
              return (
                <tr key={b.id}>
                  <td>
                    <Link href={`/properties/${b.propertyId}`}>
                      {b.property.title}
                    </Link>
                  </td>
                  <td>
                    {formatDate(b.checkIn)} – {formatDate(b.checkOut)} ({n}{" "}
                    {n === 1 ? "night" : "nights"})
                  </td>
                  <td>{formatPrice(b.property.pricePerNight * n)}</td>
                  <td>
                    <StatusBadge status={b.status} />
                  </td>
                  <td>
                    {b.status === "REQUESTED" || b.status === "CONFIRMED" ? (
                      <form action={cancelBookingAction}>
                        <input type="hidden" name="bookingId" value={b.id} />
                        <button className="btn btn-sm btn-danger">
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <span style={{ color: "var(--muted)" }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";
import {
  confirmBookingAction,
  declineBookingAction,
} from "@/lib/actions/bookings";

export default async function HostDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "HOST") redirect("/dashboard");

  const { submitted } = await searchParams;

  const [properties, bookings] = await Promise.all([
    prisma.property.findMany({
      where: { hostId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.booking.findMany({
      where: { property: { hostId: user.id } },
      orderBy: { createdAt: "desc" },
      include: { property: true, guest: true },
    }),
  ]);

  return (
    <section className="section">
      <div className="page-head">
        <h2>Host Dashboard</h2>
        <Link href="/dashboard/host/new" className="btn">
          + List a Property
        </Link>
      </div>

      {submitted && (
        <div className="alert alert-success">
          Property submitted! It will appear publicly once an admin approves it.
        </div>
      )}

      <h3 style={{ marginBottom: 16, color: "var(--navy)" }}>Your Listings</h3>
      {properties.length === 0 ? (
        <div className="empty">
          You haven&apos;t listed any properties yet.
        </div>
      ) : (
        <table className="table" style={{ marginBottom: 44 }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.id}>
                <td>
                  <Link href={`/properties/${p.id}`}>{p.title}</Link>
                </td>
                <td>{p.location}</td>
                <td>{formatPrice(p.pricePerNight)}/night</td>
                <td>
                  <StatusBadge status={p.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3 style={{ marginBottom: 16, color: "var(--navy)" }}>
        Booking Requests
      </h3>
      {bookings.length === 0 ? (
        <div className="empty">No booking requests yet.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Guest</th>
              <th>Dates</th>
              <th>Guests</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.property.title}</td>
                <td>{b.guest.name}</td>
                <td>
                  {formatDate(b.checkIn)} – {formatDate(b.checkOut)}
                </td>
                <td>{b.guests}</td>
                <td>
                  <StatusBadge status={b.status} />
                </td>
                <td>
                  {b.status === "REQUESTED" ? (
                    <div className="inline-form">
                      <form action={confirmBookingAction}>
                        <input type="hidden" name="bookingId" value={b.id} />
                        <button className="btn btn-sm btn-success">
                          Confirm
                        </button>
                      </form>
                      <form action={declineBookingAction}>
                        <input type="hidden" name="bookingId" value={b.id} />
                        <button className="btn btn-sm btn-danger">
                          Decline
                        </button>
                      </form>
                    </div>
                  ) : (
                    <span style={{ color: "var(--muted)" }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

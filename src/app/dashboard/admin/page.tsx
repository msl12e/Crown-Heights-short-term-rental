import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatPrice } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";
import {
  approvePropertyAction,
  rejectPropertyAction,
} from "@/lib/actions/properties";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");

  const [pending, allProperties, bookings] = await Promise.all([
    prisma.property.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: { host: true },
    }),
    prisma.property.findMany({
      orderBy: { createdAt: "desc" },
      include: { host: true },
    }),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: { property: true, guest: true },
    }),
  ]);

  return (
    <section className="section">
      <div className="page-head">
        <h2>Admin Dashboard</h2>
      </div>

      <h3 style={{ marginBottom: 16, color: "var(--navy)" }}>
        Pending Review ({pending.length})
      </h3>
      {pending.length === 0 ? (
        <div className="empty">No listings awaiting review.</div>
      ) : (
        <table className="table" style={{ marginBottom: 44 }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Host</th>
              <th>Location</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((p) => (
              <tr key={p.id}>
                <td>
                  <Link href={`/properties/${p.id}`}>{p.title}</Link>
                </td>
                <td>{p.host.name}</td>
                <td>{p.location}</td>
                <td>{formatPrice(p.pricePerNight)}/night</td>
                <td>
                  <div className="inline-form">
                    <form action={approvePropertyAction}>
                      <input type="hidden" name="propertyId" value={p.id} />
                      <button className="btn btn-sm btn-success">Approve</button>
                    </form>
                    <form action={rejectPropertyAction}>
                      <input type="hidden" name="propertyId" value={p.id} />
                      <button className="btn btn-sm btn-danger">Reject</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3 style={{ marginBottom: 16, color: "var(--navy)" }}>
        All Listings ({allProperties.length})
      </h3>
      {allProperties.length === 0 ? (
        <div className="empty">No listings yet.</div>
      ) : (
        <table className="table" style={{ marginBottom: 44 }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Host</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {allProperties.map((p) => (
              <tr key={p.id}>
                <td>
                  <Link href={`/properties/${p.id}`}>{p.title}</Link>
                </td>
                <td>{p.host.name}</td>
                <td>
                  <StatusBadge status={p.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3 style={{ marginBottom: 16, color: "var(--navy)" }}>
        All Bookings ({bookings.length})
      </h3>
      {bookings.length === 0 ? (
        <div className="empty">No bookings yet.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Guest</th>
              <th>Dates</th>
              <th>Status</th>
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
                <td>
                  <StatusBadge status={b.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

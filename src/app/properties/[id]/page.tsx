import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";
import BookingForm from "@/components/BookingForm";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [property, user] = await Promise.all([
    prisma.property.findUnique({ where: { id }, include: { host: true } }),
    getCurrentUser(),
  ]);

  if (!property) notFound();

  const isOwnerOrAdmin =
    user && (user.id === property.hostId || user.role === "ADMIN");

  if (property.status !== "APPROVED" && !isOwnerOrAdmin) {
    notFound();
  }

  return (
    <section className="section">
      <div className="detail-grid">
        <div
          className="detail-img"
          style={{ backgroundImage: `url(${property.imageUrl})` }}
        />

        <div className="detail-info">
          {property.status !== "APPROVED" && (
            <p style={{ marginBottom: 10 }}>
              <StatusBadge status={property.status} />
            </p>
          )}
          <h2>{property.title}</h2>
          <p className="loc" style={{ color: "var(--muted)" }}>
            {property.location}
          </p>
          <div className="meta-row" style={{ marginTop: 12 }}>
            <span>{property.bedrooms} bedrooms</span>
            <span>Up to {property.maxGuests} guests</span>
            <span>Hosted by {property.host.name}</span>
          </div>
          <p className="desc">{property.description}</p>

          {!user && (
            <div className="booking-box">
              <p className="price" style={{ fontSize: 22, marginBottom: 12 }}>
                {formatPrice(property.pricePerNight)} <span>/ night</span>
              </p>
              <p style={{ marginBottom: 16, color: "var(--muted)" }}>
                Log in as a guest to request a booking.
              </p>
              <Link href="/login" className="btn btn-block">
                Log In to Book
              </Link>
            </div>
          )}

          {user && user.role === "GUEST" && (
            <BookingForm
              propertyId={property.id}
              pricePerNight={property.pricePerNight}
              maxGuests={property.maxGuests}
            />
          )}

          {user && user.role !== "GUEST" && (
            <div className="booking-box">
              <p style={{ color: "var(--muted)" }}>
                Bookings can only be requested from a guest account.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PropertyCard from "@/components/PropertyCard";

export default async function Home() {
  const featured = await prisma.property.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h2>Find The Perfect Stay In Crown Heights</h2>
          <p>
            Browse approved short-term rental properties or submit your own
            property for review.
          </p>
          <Link href="/properties" className="btn">
            Browse Properties
          </Link>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="card">
            <h3>Hosts</h3>
            <p>
              Submit your property for admin approval and start accepting
              guests.
            </p>
          </div>
          <div className="card">
            <h3>Guests</h3>
            <p>
              Browse properties and request bookings directly through the
              platform.
            </p>
          </div>
          <div className="card">
            <h3>Admin Approval</h3>
            <p>Every listing is carefully reviewed before publication.</p>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section">
          <h2 className="section-title">Featured Stays</h2>
          <p className="section-sub">
            A few of our recently approved properties.
          </p>
          <div className="property-grid">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <Link href="/properties" className="btn btn-secondary">
              View All Properties
            </Link>
          </div>
        </section>
      )}
    </>
  );
}

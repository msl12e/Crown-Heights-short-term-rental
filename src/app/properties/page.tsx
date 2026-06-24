import { prisma } from "@/lib/prisma";
import PropertyCard from "@/components/PropertyCard";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const properties = await prisma.property.findMany({
    where: {
      status: "APPROVED",
      ...(query
        ? {
            OR: [
              { title: { contains: query } },
              { location: { contains: query } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="section">
      <h2 className="section-title">Browse Properties</h2>
      <p className="section-sub">
        Approved short-term rentals in Crown Heights.
      </p>

      <form
        method="get"
        style={{ display: "flex", gap: 12, maxWidth: 520, margin: "0 auto 36px" }}
      >
        <input
          name="q"
          defaultValue={query}
          placeholder="Search by title or location…"
          style={{
            flex: 1,
            padding: "11px 14px",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 15,
          }}
        />
        <button type="submit" className="btn">
          Search
        </button>
      </form>

      {properties.length === 0 ? (
        <div className="empty">
          No properties found{query ? ` for “${query}”` : ""}. Check back soon.
        </div>
      ) : (
        <div className="property-grid">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </section>
  );
}

import Link from "next/link";
import type { Property } from "@prisma/client";
import { formatPrice } from "@/lib/format";

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <Link href={`/properties/${property.id}`} className="property-card">
      <div
        className="thumb"
        style={{ backgroundImage: `url(${property.imageUrl})` }}
      />
      <div className="body">
        <h3>{property.title}</h3>
        <p className="loc">{property.location}</p>
        <div className="meta-row">
          <span>{property.bedrooms} bd</span>
          <span>Up to {property.maxGuests} guests</span>
        </div>
        <p className="price">
          {formatPrice(property.pricePerNight)} <span>/ night</span>
        </p>
      </div>
    </Link>
  );
}

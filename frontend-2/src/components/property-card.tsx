import { ArrowUpRight, BedDouble, MapPin } from "lucide-react";
import Link from "next/link";

type Building = {
  id: string;
  name?: string;
  address?: string;
  city?: string;
  buildingImage?: string;
  image?: string;
  numberOfFloors?: number;
};
export function PropertyCard({ building }: { building: Building }) {
  return (
    <article className="property-card">
      <div
        className="property-image"
        style={{
          backgroundImage: `url(${building.buildingImage ?? building.image ?? "/property-placeholder.svg"})`,
        }}
      >
        <span className="eyebrow">Verified residence</span>
      </div>
      <div className="property-content">
        <div>
          <h3>{building.name ?? "Untitled building"}</h3>
          <p className="muted">
            <MapPin size={14} />
            {building.address ?? building.city ?? "Location in details"}
          </p>
        </div>
        <p className="muted property-meta">
          <BedDouble size={14} />
          {building.numberOfFloors
            ? `${building.numberOfFloors} floors`
            : "Flexible rooms"}
        </p>
        <Link className="text-link" href={`/properties/${building.id}`}>
          View residence <ArrowUpRight size={15} />
        </Link>
      </div>
    </article>
  );
}

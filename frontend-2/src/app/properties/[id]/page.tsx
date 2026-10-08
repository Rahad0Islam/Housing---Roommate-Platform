"use client";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BedDouble, MapPin } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BookingPanel } from "@/components/booking-panel";
import { api } from "@/lib/api";

type Building = {
  id: string;
  name?: string;
  address?: string;
  city?: string;
  description?: string;
  buildingImage?: string;
  numberOfFloors?: number;
  flats?: { id: string; flatNumber: string }[];
};
export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useQuery({
    queryKey: ["building", id],
    queryFn: () => api<Building>(`/buildings/${id}`),
    enabled: Boolean(id),
  });
  if (isLoading)
    return (
      <main className="page-wrap container">
        <div className="skeleton" />
      </main>
    );
  if (error || !data)
    return (
      <main className="page-wrap container">
        <div className="empty-state">
          <h2>Residence unavailable</h2>
          <p>This listing may have moved or is not accessible right now.</p>
          <Link className="text-link" href="/properties">
            <ArrowLeft size={15} /> Back to properties
          </Link>
        </div>
      </main>
    );
  return (
    <main className="detail-page container">
      <Link className="text-link" href="/properties">
        <ArrowLeft size={15} /> Back to residences
      </Link>
      <div className="detail-hero">
        <div
          className="detail-image"
          style={{
            backgroundImage: `url(${data.buildingImage ?? "/property-placeholder.svg"})`,
          }}
        />
        <div className="detail-copy">
          <p className="kicker">Verified residence</p>
          <h1>{data.name ?? "Residence"}</h1>
          <p className="muted">
            <MapPin size={15} />
            {data.address ?? data.city ?? "Location available in details"}
          </p>
          <p>
            {data.description ??
              "A thoughtfully managed residence with flexible room options and a clear path from discovery to move-in."}
          </p>
          <div className="detail-facts">
            <span>
              <BedDouble size={17} />
              {data.numberOfFloors
                ? `${data.numberOfFloors} floors`
                : "Room availability"}
            </span>
            <span>Managed on Havenly</span>
          </div>
          <BookingPanel flats={data.flats} />
        </div>
      </div>
    </main>
  );
}

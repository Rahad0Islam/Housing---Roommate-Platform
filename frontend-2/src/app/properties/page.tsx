"use client";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { PropertyCard } from "@/components/property-card";
import { api } from "@/lib/api";

type Building = {
  id: string;
  name?: string;
  address?: string;
  city?: string;
  buildingImage?: string;
  image?: string;
  numberOfFloors?: number;
};
export default function PropertiesPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useQuery({
    queryKey: ["buildings", search],
    queryFn: () =>
      api<Building[]>(
        `/buildings${search ? `?searchTerm=${encodeURIComponent(search)}` : ""}`,
      ),
  });
  return (
    <main className="page-wrap container">
      <div className="page-intro">
        <p className="kicker">The residence index</p>
        <h1>
          Find your next <em>place.</em>
        </h1>
        <p>Real homes, clear details, and a better way to make a move.</p>
      </div>
      <div className="search-bar">
        <Search size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by building or city"
          aria-label="Search properties"
        />
        <button
          className="icon-button"
          type="button"
          aria-label="Property filters"
        >
          <SlidersHorizontal size={17} />
        </button>
      </div>
      {isLoading ? (
        <div className="property-grid">
          {[1, 2, 3].map((i) => (
            <div className="skeleton" key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="empty-state">
          <h2>Properties are taking a moment</h2>
          <p>Check that the backend is running, then refresh this page.</p>
        </div>
      ) : data?.length ? (
        <div className="property-grid">
          {data.map((building) => (
            <PropertyCard key={building.id} building={building} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No residences found</h2>
          <p>Try a broader search or check back as new homes are added.</p>
        </div>
      )}
    </main>
  );
}

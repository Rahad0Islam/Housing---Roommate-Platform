"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBuildings } from "@/hooks/building.hook";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BuildingIcon,
  MapPinIcon,
  HomeIcon,
  SearchIcon,
  LayersIcon,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function BuildingsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract URL parameters
  const pageParam = searchParams.get("page") || "1";
  const searchParam = searchParams.get("searchTerm") || "";
  const cityParam = searchParams.get("city") || "";

  // Local state for inputs
  const [searchInput, setSearchInput] = useState(searchParam);
  const [cityInput, setCityInput] = useState(cityParam);

  // Use a simple debounce for the search input
  // Wait, I need a debounce hook, I will create one or use a simple timeout approach

  useEffect(() => {
    const handler = setTimeout(() => {
      updateUrl(searchInput, cityInput, 1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput, cityInput]);

  const updateUrl = (searchTerm: string, city: string, page: number) => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm) params.set("searchTerm", searchTerm);
    else params.delete("searchTerm");

    if (city) params.set("city", city);
    else params.delete("city");

    if (page > 1) params.set("page", page.toString());
    else params.delete("page");

    const newUrl = `?${params.toString()}`;
    if (searchParams.toString() !== params.toString()) {
      router.push(newUrl, { scroll: false });
    }
  };

  const {
    data: response,
    isLoading,
    isError,
  } = useBuildings({
    page: parseInt(pageParam, 10),
    limit: 10,
    searchTerm: searchParam,
    city: cityParam,
  });

  const buildings = response?.data || [];
  const meta = response?.meta;

  const handlePageChange = (newPage: number) => {
    updateUrl(searchInput, cityInput, newPage);
  };

  return (
    <div className="page-container gradient-mesh py-12 md:py-16">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Explore the collection
          </p>
          <h1 className="font-heading text-4xl font-bold tracking-tight">
            Discover Properties
          </h1>
          <p className="mt-3 text-muted-foreground">
            Find the perfect building, flat, or room for your needs.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="surface mb-10 flex flex-col gap-4 p-4 sm:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search buildings, locations..."
            className="bg-muted/40 pl-10"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="relative flex-1 sm:max-w-xs">
          <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="City (e.g. Sylhet)"
            className="bg-muted/40 pl-10"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[240px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Unable to load buildings
          </h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Something went wrong while loading the available properties.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      ) : buildings.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <BuildingIcon className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
            No buildings found
          </h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Try changing your search or filters.
          </p>
          <Button
            onClick={() => {
              setSearchInput("");
              setCityInput("");
            }}
            className="mt-4"
            variant="outline"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {buildings.map((building) => (
              <Link
                key={building.id}
                href={`/buildings/${building.id}`}
                className="group h-full"
              >
                <Card className="motion-rise h-full overflow-hidden border-border/70 bg-card/90 shadow-lg shadow-slate-950/5 transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/15">
                  <div className="relative h-60 w-full overflow-hidden bg-gradient-to-br from-primary/20 via-emerald-500/10 to-slate-950/20">
                    {building.buildingImage ? (
                      <img
                        src={building.buildingImage}
                        alt={building.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center text-primary/50">
                        <BuildingIcon className="mb-2 h-14 w-14 opacity-60" />
                        <span className="text-sm font-medium">
                          No Image Available
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
                      <div>
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
                          Featured property
                        </p>
                        <p className="flex items-center gap-1.5 text-sm text-white/85">
                          <MapPinIcon className="h-4 w-4 text-emerald-300" />
                          {building.city}
                        </p>
                      </div>
                      <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-md">
                        Explore property
                      </span>
                    </div>
                    {building.numberOfFlats > 0 && (
                      <Badge className="absolute right-4 top-4 border border-white/30 bg-white/90 text-gray-900 shadow-lg backdrop-blur-md hover:bg-white dark:bg-gray-900/90 dark:text-gray-100">
                        {building.numberOfFlats} Flats
                      </Badge>
                    )}
                  </div>
                  <CardContent className="flex h-[calc(100%-15rem)] flex-col justify-between p-6">
                    <div>
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <h2 className="line-clamp-1 text-xl font-bold tracking-tight transition-colors group-hover:text-primary">
                          {building.name}
                        </h2>
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
                      </div>
                      <div className="mb-4 flex items-center text-sm text-muted-foreground">
                        <MapPinIcon className="mr-1.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="line-clamp-1">
                          {building.address}, {building.city}
                        </span>
                      </div>
                      <p className="mb-5 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {building.description}
                      </p>
                    </div>

                    <div>
                      <div className="mb-5 grid grid-cols-2 gap-3 border-y border-border/70 py-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2 rounded-xl bg-primary/[0.06] px-3 py-2">
                          <LayersIcon className="h-4 w-4 text-primary" />
                          <span>{building.numberOfFloors} Floors</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/[0.07] px-3 py-2">
                          <HomeIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          <span>
                            {building.flats?.length || 0} Flats Available
                          </span>
                        </div>
                      </div>

                      {building.amenities && building.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {building.amenities.slice(0, 3).map((amenity) => (
                            <Badge
                              key={amenity.id}
                              variant="secondary"
                              className="border border-primary/10 bg-primary/[0.07] text-xs font-normal text-primary hover:bg-primary/15 dark:bg-primary/10 dark:text-primary-foreground"
                            >
                              {amenity.name}
                            </Badge>
                          ))}
                          {building.amenities.length > 3 && (
                            <Badge
                              variant="secondary"
                              className="border border-border/70 bg-muted text-xs font-normal text-muted-foreground"
                            >
                              +{building.amenities.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="mt-auto flex items-center justify-between gap-3">
                        <div className="truncate text-xs font-medium text-muted-foreground">
                          Listed by {building.owner?.name || "Owner"}
                        </div>
                        <Button
                          variant="ghost"
                          className="h-auto shrink-0 rounded-full bg-primary/10 px-4 py-2 font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          View details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(meta.page - 1)}
                disabled={meta.page === 1}
                className="bg-white dark:bg-gray-800"
              >
                &larr; Previous
              </Button>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mx-4">
                Page {meta.page} of {meta.totalPages}
              </div>
              <Button
                variant="outline"
                onClick={() => handlePageChange(meta.page + 1)}
                disabled={meta.page === meta.totalPages}
                className="bg-white dark:bg-gray-800"
              >
                Next &rarr;
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function BuildingsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-12 px-4">
          <Skeleton className="h-[400px] w-full" />
        </div>
      }
    >
      <BuildingsPageContent />
    </Suspense>
  );
}

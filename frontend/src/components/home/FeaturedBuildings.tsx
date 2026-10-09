"use client";

import Link from "next/link";
import { ArrowRight, Building2, Home, Layers3, MapPin } from "lucide-react";
import { useBuildings } from "@/hooks/building.hook";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedBuildings() {
  const { data: response, isLoading, isError } = useBuildings({ limit: 3 });
  const buildings = response?.data || [];

  return (
    <section className="relative overflow-hidden px-4 py-24">
      <div className="absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-primary/[0.07] via-transparent to-transparent" />
      <div className="page-container">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Explore available spaces
            </p>
            <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight md:text-4xl">
              Find a place that feels like home
            </h2>
            <p className="text-muted-foreground">
              Browse trusted properties, compare amenities, and discover rooms
              that fit your lifestyle.
            </p>
          </div>
          <Link href="/buildings">
            <Button variant="outline" className="rounded-full">
              View all buildings <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading && (
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-[430px] rounded-3xl" />
            ))}
          </div>
        )}

        {!isLoading && !isError && buildings.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3">
            {buildings.map((building) => (
              <Link
                key={building.id}
                href={`/buildings/${building.id}`}
                className="group"
              >
                <Card className="h-full overflow-hidden border-border/70 bg-card/90 shadow-lg shadow-slate-950/5 transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/15">
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary/25 via-emerald-500/10 to-slate-950/20">
                    {building.buildingImage ? (
                      <img
                        src={building.buildingImage}
                        alt={building.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-primary/50">
                        <Building2 className="h-16 w-16" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                    <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3 text-white">
                      <div>
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
                          Featured property
                        </p>
                        <p className="flex items-center gap-1.5 text-sm text-white/85">
                          <MapPin className="h-4 w-4 text-emerald-300" />
                          {building.city}
                        </p>
                      </div>
                      {building.numberOfFlats > 0 && (
                        <Badge className="border-white/20 bg-white/15 text-white backdrop-blur-md hover:bg-white/25">
                          {building.numberOfFlats} flats
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <h3 className="line-clamp-1 text-xl font-bold tracking-tight transition-colors group-hover:text-primary">
                        {building.name}
                      </h3>
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
                    </div>
                    <p className="mb-5 flex items-center gap-1.5 truncate text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0 text-primary" />
                      {building.address}, {building.city}
                    </p>
                    <div className="mb-5 grid grid-cols-2 gap-3 border-y border-border/70 py-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2 rounded-xl bg-primary/[0.06] px-3 py-2">
                        <Layers3 className="h-4 w-4 text-primary" />
                        {building.numberOfFloors} floors
                      </span>
                      <span className="flex items-center gap-2 rounded-xl bg-emerald-500/[0.07] px-3 py-2">
                        <Home className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        {building.flats?.length || 0} available
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate text-xs font-medium text-muted-foreground">
                        Listed by {building.owner?.name || "Owner"}
                      </span>
                      <span className="shrink-0 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        View details
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && !isError && buildings.length === 0 && (
          <div className="rounded-3xl border border-dashed border-primary/25 bg-primary/[0.04] px-6 py-14 text-center">
            <Building2 className="mx-auto mb-4 h-10 w-10 text-primary/60" />
            <p className="font-semibold">New properties are arriving soon.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Explore the full marketplace to see all available listings.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

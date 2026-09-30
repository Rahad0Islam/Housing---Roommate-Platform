"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Building2, CheckCircle2 } from "lucide-react";

import { useBuilding } from "@/hooks/buildings.hook";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  const { data, isLoading, isError } = useBuilding(id);
  
  const property = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 pt-24 px-4 dark:bg-zinc-950">
        <div className="mx-auto max-w-5xl animate-pulse space-y-8">
          <div className="h-10 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-64 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-4 w-1/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Property not found</h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">The property you are looking for does not exist or has been removed.</p>
          <Link href="/properties">
            <Button className="mt-6">Back to Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-24 pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/properties" className="mb-8 inline-flex items-center text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to search
        </Link>

        {/* Gallery Placeholder */}
        <div className="mb-12 h-64 w-full overflow-hidden rounded-3xl bg-zinc-200 sm:h-96 dark:bg-zinc-800 relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400">
             <Building2 className="h-16 w-16 mb-4" />
             <span>Image Gallery Placeholder</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-12">
            {/* Header Info */}
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {property.name}
              </h1>
              <div className="mt-4 flex items-center text-lg text-zinc-600 dark:text-zinc-400">
                <MapPin className="mr-2 h-5 w-5 text-zinc-400" />
                {property.address}, {property.city}
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <section>
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">About this property</h2>
                <p className="mt-4 leading-7 text-zinc-600 dark:text-zinc-400">
                  {property.description}
                </p>
              </section>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">Amenities</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {property.amenities.map((amenity) => (
                    <div key={amenity.id} className="flex items-center text-zinc-600 dark:text-zinc-400">
                      <CheckCircle2 className="mr-3 h-5 w-5 text-green-500" />
                      {amenity.name}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Flats / Rooms */}
            {property.flats && property.flats.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">Available Flats & Rooms</h2>
                <div className="space-y-6">
                  {property.flats.map((flat) => (
                    <Card key={flat.id} className="overflow-hidden">
                      <CardHeader className="bg-zinc-100 dark:bg-zinc-900/50">
                        <CardTitle className="text-lg">Flat {flat.flatNumber} (Floor {flat.floor})</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        {/* We would render rooms here if they are populated inside flat.rooms */}
                        <div className="p-6 text-sm text-zinc-600 dark:text-zinc-400">
                          Room details will be displayed here based on backend population.
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Interested in booking?</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8">
                Select a room below or contact the owner to secure your space.
              </p>
              <Button className="w-full h-14 text-lg font-semibold bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-xl">
                Start Booking
              </Button>
              <p className="mt-4 text-center text-xs text-zinc-500">
                You won't be charged yet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

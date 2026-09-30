"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Building2, MapPin, Search } from "lucide-react";

import { useBuildings } from "@/hooks/buildings.hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

function PropertiesList() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(search);

  // In a real implementation we'd pass query params to the hook
  const { data, isLoading, isError } = useBuildings({ search: searchTerm });
  
  const properties = data?.data || [];

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="mb-12 md:flex md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Discover Properties
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Find your next flat, room, or building across our verified listings.
            </p>
          </div>
          <div className="mt-6 flex max-w-md flex-1 gap-x-4 md:mt-0 md:justify-end">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                type="text"
                placeholder="Search location or building..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 bg-white dark:bg-zinc-900"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse bg-zinc-100 dark:bg-zinc-900/50">
                <div className="h-48 w-full bg-zinc-200 dark:bg-zinc-800 rounded-t-xl" />
                <CardContent className="p-6 space-y-4">
                  <div className="h-4 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-900/10">
            <p className="text-lg text-red-600 dark:text-red-400">Failed to load properties. Please try again.</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-16 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <Building2 className="mx-auto h-12 w-12 text-zinc-400" />
            <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">No properties found</h3>
            <p className="mt-2 text-zinc-500">Try adjusting your search filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <Link key={property.id} href={`/properties/${property.id}`} className="group block">
                <Card className="h-full overflow-hidden transition-all hover:shadow-lg dark:hover:border-zinc-700">
                  <div className="h-48 w-full bg-zinc-200 dark:bg-zinc-800 relative">
                    {/* Placeholder for actual image */}
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                      <Building2 className="h-12 w-12" />
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {property.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                      <MapPin className="mr-2 h-4 w-4" />
                      {property.address}, {property.city}
                    </div>
                    {property.description && (
                      <p className="text-sm text-zinc-500 line-clamp-2">
                        {property.description}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button variant="ghost" className="w-full justify-between">
                      View Details
                      <span className="text-blue-600 dark:text-blue-400">→</span>
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50 pt-24"><div className="mx-auto max-w-7xl px-4 animate-pulse h-96 bg-zinc-200 rounded-xl" /></div>}>
      <PropertiesList />
    </Suspense>
  );
}

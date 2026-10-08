"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBuildings } from "@/hooks/building.hook";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BuildingIcon, MapPinIcon, HomeIcon, SearchIcon, LayersIcon } from "lucide-react";
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

  const { data: response, isLoading, isError } = useBuildings({
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
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Discover Properties
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Find the perfect building, flat, or room for your needs.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search buildings, locations..."
            className="pl-9 bg-gray-50 dark:bg-gray-900 border-transparent focus-visible:ring-primary"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="relative flex-1 sm:max-w-xs">
          <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="City (e.g. Sylhet)"
            className="pl-9 bg-gray-50 dark:bg-gray-900 border-transparent focus-visible:ring-primary"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Unable to load buildings</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Something went wrong while loading the available properties.</p>
          <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
            Try Again
          </Button>
        </div>
      ) : buildings.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <BuildingIcon className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No buildings found</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Try changing your search or filters.</p>
          <Button 
            onClick={() => { setSearchInput(""); setCityInput(""); }} 
            className="mt-4" 
            variant="outline"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buildings.map((building) => (
              <Link key={building.id} href={`/buildings/${building.id}`} className="group h-full">
                <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <div className="relative h-56 w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
                    {building.buildingImage ? (
                      <img 
                        src={building.buildingImage} 
                        alt={building.name} 
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                        <BuildingIcon className="w-12 h-12 mb-2 opacity-50" />
                        <span className="text-sm font-medium">No Image Available</span>
                      </div>
                    )}
                    {building.numberOfFlats > 0 && (
                      <Badge className="absolute top-3 right-3 bg-white/90 text-gray-900 hover:bg-white dark:bg-gray-900/90 dark:text-gray-100 backdrop-blur-sm">
                        {building.numberOfFlats} Flats
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-5 flex flex-col justify-between h-[calc(100%-14rem)]">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors text-gray-900 dark:text-gray-100">
                          {building.name}
                        </h2>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <MapPinIcon className="w-4 h-4 mr-1 shrink-0" />
                        <span className="line-clamp-1">{building.address}, {building.city}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                        {building.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                        <div className="flex items-center gap-1.5">
                          <LayersIcon className="w-4 h-4" />
                          <span>{building.numberOfFloors} Floors</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <HomeIcon className="w-4 h-4" />
                          <span>{building.flats?.length || 0} Flats Available</span>
                        </div>
                      </div>
                      
                      {building.amenities && building.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {building.amenities.slice(0, 3).map((amenity) => (
                            <Badge key={amenity.id} variant="secondary" className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 font-normal text-xs text-gray-700 dark:text-gray-200">
                              {amenity.name}
                            </Badge>
                          ))}
                          {building.amenities.length > 3 && (
                            <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700 font-normal text-xs text-gray-700 dark:text-gray-200">
                              +{building.amenities.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Listed by {building.owner?.name || "Owner"}
                        </div>
                        <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10 p-0 h-auto font-semibold">
                          View Details &rarr;
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
    <Suspense fallback={<div className="container mx-auto py-12 px-4"><Skeleton className="h-[400px] w-full" /></div>}>
      <BuildingsPageContent />
    </Suspense>
  );
}

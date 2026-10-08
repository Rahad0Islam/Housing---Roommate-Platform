"use client";

import React, { use } from "react";
import { useBuildingDetails } from "@/hooks/building.hook";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { BuildingIcon, MapPinIcon, LayersIcon, CheckCircle2Icon, HomeIcon, ArrowLeftIcon, InfoIcon, BathIcon, BedIcon, MaximizeIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BuildingDetailsPage({
  params,
}: {
  params: Promise<{ buildingId: string }>;
}) {
  const router = useRouter();
  const { buildingId } = use(params);

  const { data: response, isLoading, isError } = useBuildingDetails(buildingId);
  const building = response?.data;

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-[400px] w-full rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <Skeleton className="h-[200px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !building) {
    return (
      <div className="container mx-auto py-20 px-4">
        <div className="text-center bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 py-16">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Building not found</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">The property you're looking for doesn't exist or couldn't be loaded.</p>
          <Button onClick={() => router.push("/buildings")} className="mt-6" variant="outline">
            Browse All Buildings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-20">
      {/* Navigation */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/buildings">Buildings</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{building.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 -ml-4 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (Left Column) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Section */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 rounded-md">
                  Building
                </Badge>
                {building.numberOfFlats > 0 && (
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900">
                    Available Flats
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                {building.name}
              </h1>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <MapPinIcon className="w-5 h-5 mr-1.5 shrink-0 text-primary/70" />
                <span className="text-lg">{building.address}, {building.city}</span>
              </div>
            </div>

            {/* Image Section */}
            <div className="w-full h-[300px] sm:h-[400px] rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800 relative shadow-sm border border-gray-100 dark:border-gray-800 group">
              {building.buildingImage ? (
                <img 
                  src={building.buildingImage} 
                  alt={building.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                  <BuildingIcon className="w-20 h-20 mb-4 opacity-40" />
                  <span className="text-lg font-medium">No Image Available</span>
                </div>
              )}
            </div>

            {/* Description */}
            <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <InfoIcon className="w-6 h-6 mr-2 text-primary" />
                About this building
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {building.description || "No description provided."}
                </p>
              </div>
            </section>

            {/* Amenities */}
            <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Amenities & Features</h2>
              {building.amenities && building.amenities.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {building.amenities.map((amenity) => (
                    <div key={amenity.id} className="flex items-center text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                      <CheckCircle2Icon className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                      <span className="font-medium">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No amenities listed.</p>
              )}
            </section>
          </div>

          {/* Sidebar (Right Column) */}
          <div className="space-y-8">
            {/* Quick Info Card */}
            <Card className="bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden rounded-2xl">
              <div className="bg-primary/5 p-4 border-b border-primary/10">
                <h3 className="font-semibold text-primary flex items-center text-lg">
                  <BuildingIcon className="w-5 h-5 mr-2" />
                  Property Overview
                </h3>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-gray-400">Total Floors</span>
                    <span className="font-bold text-gray-900 dark:text-white">{building.numberOfFloors}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-gray-400">Listed Flats</span>
                    <span className="font-bold text-gray-900 dark:text-white">{building.flats?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-gray-400">City</span>
                    <span className="font-bold text-gray-900 dark:text-white capitalize">{building.city}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-500 dark:text-gray-400">Added</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {new Date(building.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Flats Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
            <HomeIcon className="w-8 h-8 mr-3 text-primary" />
            Available Flats
          </h2>
          
          {building.flats && building.flats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {building.flats.map((flat) => (
                <Link key={flat.id} href={`/buildings/${building.id}/flats/${flat.id}`} className="group h-full">
                  <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/50 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-2xl relative">
                    <div className="absolute top-0 right-0 p-4">
                      <Badge className={
                        flat.status === "AVAILABLE" 
                          ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }>
                        {flat.status}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                          Flat {flat.flatNumber}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                          Floor {flat.floorNumber}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-4 gap-x-2 my-6">
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <BedIcon className="w-5 h-5 mr-2 text-primary/70" />
                          <span className="font-medium">{flat.bedrooms} Beds</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <BathIcon className="w-5 h-5 mr-2 text-primary/70" />
                          <span className="font-medium">{flat.bathrooms} Baths</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <MaximizeIcon className="w-5 h-5 mr-2 text-primary/70" />
                          <span className="font-medium">{flat.totalArea} sqft</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <LayersIcon className="w-5 h-5 mr-2 text-primary/70" />
                          <span className="font-medium">{flat.balcony} Balcony</span>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold text-gray-900 dark:text-white">{flat.rooms?.length || 0}</span> Rooms listed
                        </div>
                        <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10 p-0 h-auto font-semibold">
                          View Flat &rarr;
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-800 shadow-sm">
              <HomeIcon className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">No flats available</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-sm mx-auto">This building currently has no listed flats. Check back later or explore other properties.</p>
              <Button onClick={() => router.push("/buildings")} className="mt-6" variant="outline">
                Browse Other Buildings
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

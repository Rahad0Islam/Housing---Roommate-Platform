"use client";

import React, { use } from "react";
import { useBuildingDetails } from "@/hooks/building.hook";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  HomeIcon,
  ArrowLeftIcon,
  BathIcon,
  BedIcon,
  MaximizeIcon,
  LayersIcon,
  DoorClosedIcon,
  CheckCircle2Icon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FlatDetailsPage({
  params,
}: {
  params: Promise<{ buildingId: string; flatId: string }>;
}) {
  const router = useRouter();
  const { buildingId, flatId } = use(params);

  const { data: response, isLoading, isError } = useBuildingDetails(buildingId);
  const building = response?.data;

  const flat = building?.flats?.find((f) => f.id === flatId);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Skeleton className="h-8 w-64 mb-8" />
        <Skeleton className="h-[250px] w-full rounded-2xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[300px] rounded-xl" />
          <Skeleton className="h-[300px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !building || !flat) {
    return (
      <div className="container mx-auto py-20 px-4">
        <div className="text-center bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 py-16">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Flat not found
          </h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            The flat you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Button
            onClick={() => router.push(`/buildings/${buildingId}`)}
            className="mt-6"
            variant="outline"
          >
            Back to Building
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-mesh min-h-screen pb-20">
      {/* Navigation */}
      <div className="border-b border-border/70 bg-background/70 backdrop-blur-xl">
        <div className="page-container py-4">
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
                <BreadcrumbLink href={`/buildings/${building.id}`}>
                  {building.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Flat {flat.flatNumber}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="page-container py-8 md:py-12">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 -ml-4 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Flat Overview Header */}
        <div className="relative mb-12 overflow-hidden rounded-3xl border border-primary/15 bg-primary/[0.06] p-8 shadow-lg shadow-primary/5 sm:p-10">
          <div className="absolute top-0 right-0 p-6 md:p-10">
            <Badge
              className={`text-sm py-1.5 px-4 rounded-full ${
                flat.status === "AVAILABLE"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              {flat.status}
            </Badge>
          </div>

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <HomeIcon className="w-6 h-6 text-primary" />
              <span className="text-primary font-semibold tracking-wider uppercase text-sm">
                Flat Details
              </span>
            </div>
            <h1 className="mb-8 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
              Flat {flat.flatNumber}
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              <div>
                <div className="text-gray-500 dark:text-gray-400 mb-1 text-sm flex items-center">
                  <LayersIcon className="w-4 h-4 mr-1" /> Floor
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {flat.floorNumber}
                </div>
              </div>
              <div>
                <div className="text-gray-500 dark:text-gray-400 mb-1 text-sm flex items-center">
                  <BedIcon className="w-4 h-4 mr-1" /> Bedrooms
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {flat.bedrooms}
                </div>
              </div>
              <div>
                <div className="text-gray-500 dark:text-gray-400 mb-1 text-sm flex items-center">
                  <BathIcon className="w-4 h-4 mr-1" /> Bathrooms
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {flat.bathrooms}
                </div>
              </div>
              <div>
                <div className="text-gray-500 dark:text-gray-400 mb-1 text-sm flex items-center">
                  <MaximizeIcon className="w-4 h-4 mr-1" /> Area
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {flat.totalArea}{" "}
                  <span className="text-sm font-normal text-gray-500">
                    sqft
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <DoorClosedIcon className="w-8 h-8 mr-3 text-primary" />
              Available Rooms
            </h2>
            <span className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-full text-sm">
              {flat.rooms?.length || 0} Listed
            </span>
          </div>

          {flat.rooms && flat.rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {flat.rooms.map((room) => (
                <Link
                  key={room.id}
                  href={`/buildings/${building.id}/flats/${flat.id}/rooms/${room.id}`}
                  className="group h-full"
                >
                  <Card className="flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative h-56 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {room.roomImage ? (
                        <img
                          src={room.roomImage}
                          alt={room.name}
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                          <DoorClosedIcon className="w-12 h-12 mb-2 opacity-50" />
                          <span className="text-sm font-medium">No Image</span>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <Badge
                          className={`backdrop-blur-md shadow-sm ${
                            room.status === "AVAILABLE"
                              ? "bg-green-500/90 text-white hover:bg-green-600"
                              : "bg-gray-800/90 text-gray-200 hover:bg-gray-900"
                          }`}
                        >
                          {room.status}
                        </Badge>
                        {room.roomType && (
                          <Badge
                            variant="secondary"
                            className="bg-white/90 text-gray-900 backdrop-blur-md shadow-sm"
                          >
                            {room.roomType.replace("_", " ")}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="mb-4">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                          {room.name}
                        </h3>
                      </div>

                      <div className="bg-primary/5 rounded-xl p-4 mb-6">
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            Monthly Rent
                          </span>
                          <span className="text-xl font-bold text-primary">
                            ৳{Number(room.monthlyRent).toLocaleString()}
                          </span>
                        </div>
                        {room.dailyRent && Number(room.dailyRent) > 0 && (
                          <div className="flex justify-between items-end">
                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                              Daily Rent
                            </span>
                            <span className="text-base font-semibold text-gray-700 dark:text-gray-300">
                              ৳{Number(room.dailyRent).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 mb-6 flex-1">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <CheckCircle2Icon className="w-4 h-4 mr-2 text-primary/70" />
                          <span>
                            Max Occupants:{" "}
                            <strong className="text-gray-900 dark:text-white">
                              {room.maxOccupants}
                            </strong>
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <CheckCircle2Icon className="w-4 h-4 mr-2 text-primary/70" />
                          <span>
                            Available Beds:{" "}
                            <strong className="text-gray-900 dark:text-white">
                              {room.availableBed}
                            </strong>
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <CheckCircle2Icon className="w-4 h-4 mr-2 text-primary/70" />
                          <span>
                            {room.furnished ? "Furnished" : "Unfurnished"}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto">
                        <Button className="w-full font-semibold group-hover:shadow-md transition-all">
                          View Room Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800 shadow-sm">
              <DoorClosedIcon className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                No rooms available
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                There are currently no rooms listed for this flat.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

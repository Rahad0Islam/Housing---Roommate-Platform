"use client";

import React, { use } from "react";
import { useBuildingDetails } from "@/hooks/building.hook";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeftIcon, DoorClosedIcon, CheckCircle2Icon, CalendarIcon, UsersIcon, BedSingleIcon, HomeIcon, WalletIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RoomDetailsPage({
  params,
}: {
  params: Promise<{ buildingId: string; flatId: string; roomId: string }>;
}) {
  const router = useRouter();
  const { buildingId, flatId, roomId } = use(params);

  const { data: response, isLoading, isError } = useBuildingDetails(buildingId);
  const building = response?.data;
  
  const flat = building?.flats?.find(f => f.id === flatId);
  const room = flat?.rooms?.find(r => r.id === roomId);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-[400px] w-full rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="h-[200px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !building || !flat || !room) {
    return (
      <div className="container mx-auto py-20 px-4">
        <div className="text-center bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 py-16">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Room not found</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">The room you're looking for doesn't exist or couldn't be loaded.</p>
          <Button onClick={() => router.push(`/buildings/${buildingId}/flats/${flatId}`)} className="mt-6" variant="outline">
            Back to Flat
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
                <BreadcrumbLink href={`/buildings/${building.id}`}>{building.name}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/buildings/${building.id}/flats/${flat.id}`}>Flat {flat.flatNumber}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{room.name}</BreadcrumbPage>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Main Content (Left Column) */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className={
                  room.status === "AVAILABLE" 
                    ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                }>
                  {room.status}
                </Badge>
                {room.roomType && (
                  <Badge variant="outline" className="uppercase tracking-wider text-xs">
                    {room.roomType.replace("_", " ")}
                  </Badge>
                )}
                {room.furnished && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Furnished
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                {room.name}
              </h1>
              <div className="flex items-center text-gray-500 dark:text-gray-400 mb-6">
                <HomeIcon className="w-4 h-4 mr-1.5" />
                <span>Inside Flat {flat.flatNumber}, Floor {flat.floorNumber}</span>
              </div>
            </div>

            {/* Image Section */}
            <div className="w-full h-[300px] sm:h-[450px] rounded-3xl overflow-hidden bg-gray-200 dark:bg-gray-800 relative shadow-sm border border-gray-100 dark:border-gray-800 group">
              {room.roomImage ? (
                <img 
                  src={room.roomImage} 
                  alt={room.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                  <DoorClosedIcon className="w-20 h-20 mb-4 opacity-40" />
                  <span className="text-lg font-medium">No Image Available</span>
                </div>
              )}
            </div>
            
            <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">Room Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <UsersIcon className="w-6 h-6 text-primary mr-4 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Capacity</h4>
                    <p className="text-gray-500 dark:text-gray-400">Up to {room.maxOccupants} occupants allowed</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <BedSingleIcon className="w-6 h-6 text-primary mr-4 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Availability</h4>
                    <p className="text-gray-500 dark:text-gray-400">{room.availableBed} beds currently available</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <HomeIcon className="w-6 h-6 text-primary mr-4 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Furnishing</h4>
                    <p className="text-gray-500 dark:text-gray-400">{room.furnished ? "Fully furnished and ready to move in" : "Unfurnished, bring your own furniture"}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CalendarIcon className="w-6 h-6 text-primary mr-4 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Available From</h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      {room.availableFrom ? new Date(room.availableFrom).toLocaleDateString() : "Immediately"}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar (Right Column) */}
          <div className="space-y-8">
            <Card className="bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden rounded-3xl sticky top-24">
              <div className="bg-primary/5 p-6 sm:p-8 border-b border-primary/10">
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">Monthly Rent</p>
                  <div className="text-4xl font-extrabold text-primary">
                    ৳{Number(room.monthlyRent).toLocaleString()}
                    <span className="text-lg text-gray-500 dark:text-gray-400 font-normal"> /mo</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 sm:p-8">
                {room.dailyRent && Number(room.dailyRent) > 0 && (
                  <div className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <WalletIcon className="w-5 h-5 mr-2 text-primary/60" />
                      Daily Rent Option
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">৳{Number(room.dailyRent).toLocaleString()} /day</span>
                  </div>
                )}
                
                <div className="py-6 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Status</span>
                    <span className={`font-semibold ${room.status === "AVAILABLE" ? "text-green-600 dark:text-green-400" : "text-gray-700 dark:text-gray-300"}`}>
                      {room.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Type</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{room.roomType?.replace("_", " ")}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Available Beds</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{room.availableBed} of {room.maxOccupants}</span>
                  </div>
                </div>

                {room.status === "AVAILABLE" && (
                  <div className="mt-4">
                    <Button className="w-full h-12 text-lg font-bold shadow-lg hover:shadow-primary/25 transition-all">
                      Book this Room
                    </Button>
                    <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                      You will be redirected to contact the owner or complete the booking process.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

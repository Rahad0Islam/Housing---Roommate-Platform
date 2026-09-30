"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Building2, CheckCircle2, BedDouble, Users, CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";

import { useBuilding } from "@/hooks/buildings.hook";
import { useCreateBooking } from "@/hooks/booking.hook";
import { useUser } from "@/hooks/auth.hook";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function BookingModal({ room, flat, building, children }: any) {
  const router = useRouter();
  const { data: userData } = useUser();
  const user = userData?.data;
  
  const createBookingMutation = useCreateBooking();
  const [open, setOpen] = useState(false);
  
  const [rentType, setRentType] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleBooking = async () => {
    if (!user) {
      toast.error("You must be logged in to book a room");
      router.push("/login");
      return;
    }
    if (user.role !== "TENANT") {
      toast.error("Only tenants can book rooms");
      return;
    }
    if (!rentType || !startDate || !endDate) {
      toast.error("Please fill in all booking details");
      return;
    }

    try {
      const res = await createBookingMutation.mutateAsync({
        roomId: room.id,
        rentType,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      toast.success("Booking request created successfully!");
      setOpen(false);
      // Redirect to booking details to pay
      router.push(`/dashboard/tenant/bookings/${res.data.id}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create booking request");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={true as any}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Book {room.name}</DialogTitle>
          <div className="text-sm text-zinc-500 mt-1">
            {building.name} - Flat {flat.flatNo}
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900 p-3 rounded-md border">
            <div>
              <p className="text-sm text-zinc-500">Monthly Rent</p>
              <p className="font-bold">৳{room.monthlyRent}</p>
            </div>
            {room.dailyRent && (
              <div className="text-right">
                <p className="text-sm text-zinc-500">Daily Rent</p>
                <p className="font-bold">৳{room.dailyRent}</p>
              </div>
            )}
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">Rent Type</label>
            <Select onValueChange={(val) => setRentType(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select short/long term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SHORT_TERM">Short Term (Max 30 days)</SelectItem>
                <SelectItem value="LONG_TERM">Long Term (Min 90 days)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Start Date</label>
              <Popover>
                <PopoverTrigger asChild={true as any}>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} disabled={(date) => date < new Date() || date < new Date(room.availableFrom)} />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">End Date</label>
              <Popover>
                <PopoverTrigger asChild={true as any}>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} disabled={(date) => !startDate || date <= startDate} />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <Button 
          className="w-full bg-[#E2136E] hover:bg-[#b00f56] text-white" 
          onClick={handleBooking}
          disabled={createBookingMutation.isPending}
        >
          {createBookingMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Request Booking
        </Button>
      </DialogContent>
    </Dialog>
  );
}

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

        {/* Gallery */}
        <div className="mb-12 h-64 w-full overflow-hidden rounded-3xl bg-zinc-200 sm:h-96 dark:bg-zinc-800 relative">
          {(property as any).buildingImage ? (
            <img src={(property as any).buildingImage} alt={property.name} className="object-cover w-full h-full" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400">
               <Building2 className="h-16 w-16 mb-4" />
               <span>No Image Available</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {property.name}
              </h1>
              <div className="mt-4 flex items-center text-lg text-zinc-600 dark:text-zinc-400">
                <MapPin className="mr-2 h-5 w-5 text-zinc-400" />
                {property.address}, {property.city}
              </div>
            </div>

            {property.description && (
              <section>
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">About this property</h2>
                <p className="mt-4 leading-7 text-zinc-600 dark:text-zinc-400">
                  {property.description}
                </p>
              </section>
            )}

            {property.amenities && property.amenities.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">Amenities</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {property.amenities.map((amenity: any) => (
                    <div key={amenity.id} className="flex items-center text-zinc-600 dark:text-zinc-400">
                      <CheckCircle2 className="mr-3 h-5 w-5 text-green-500" />
                      {amenity.name}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">Available Flats & Rooms</h2>
              <div className="space-y-6">
                {!property.flats || property.flats.length === 0 ? (
                  <p className="text-zinc-500">No flats listed for this property yet.</p>
                ) : (
                  property.flats.map((flat: any) => (
                    <Card key={flat.id} className="overflow-hidden border-zinc-200 shadow-sm">
                      <CardHeader className="bg-zinc-50 dark:bg-zinc-900/50 pb-4">
                        <CardTitle className="text-lg flex justify-between items-center">
                          <span>Flat {flat.flatNo}</span>
                          <Badge variant="outline">Floor {flat.floor}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                          {!flat.rooms || flat.rooms.length === 0 ? (
                            <div className="p-6 text-sm text-zinc-500">No rooms listed in this flat.</div>
                          ) : (
                            flat.rooms.map((room: any) => (
                              <div key={room.id} className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">{room.name}</h4>
                                    <Badge variant={room.availableBed > 0 ? "secondary" : "outline"} className={room.availableBed > 0 ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
                                      {room.availableBed > 0 ? `${room.availableBed} beds available` : "Full"}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center text-xs text-zinc-500 gap-4 mt-2">
                                    <span className="flex items-center"><BedDouble className="w-3 h-3 mr-1" /> {room.roomType}</span>
                                    <span className="flex items-center"><Users className="w-3 h-3 mr-1" /> Max {room.maxOccupants}</span>
                                  </div>
                                </div>
                                <div className="flex flex-col justify-between items-end">
                                  <div className="text-right mb-2">
                                    <p className="font-bold text-lg text-zinc-900 dark:text-zinc-50">৳{room.monthlyRent}<span className="text-xs text-zinc-500 font-normal">/mo</span></p>
                                  </div>
                                  <BookingModal room={room} flat={flat} building={property}>
                                    <Button 
                                      size="sm" 
                                      className="bg-zinc-900 text-white hover:bg-zinc-800"
                                      disabled={room.availableBed === 0}
                                    >
                                      Book Now
                                    </Button>
                                  </BookingModal>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Interested in booking?</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8">
                Select a room from the list on the left to secure your space.
              </p>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800 text-center text-sm text-zinc-500">
                You will not be charged until your booking is created and you choose to pay.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

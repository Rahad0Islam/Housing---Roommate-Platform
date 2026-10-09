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
  ArrowLeftIcon,
  DoorClosedIcon,
  CheckCircle2Icon,
  CalendarIcon,
  UsersIcon,
  BedSingleIcon,
  HomeIcon,
  WalletIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGetMe } from "@/hooks/auth.hook";
import { useCreateBooking } from "@/hooks/booking.hook";
import { useCreateBkashPayment } from "@/hooks/bkashPayment.hook";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function RoomDetailsPage({
  params,
}: {
  params: Promise<{ buildingId: string; flatId: string; roomId: string }>;
}) {
  const router = useRouter();
  const { buildingId, flatId, roomId } = use(params);

  const { data: response, isLoading, isError } = useBuildingDetails(buildingId);
  const building = response?.data;

  const flat = building?.flats?.find((f) => f.id === flatId);
  const room = flat?.rooms?.find((r) => r.id === roomId);

  const { data: user } = useGetMe();
  const { mutate: createBooking, isPending: isBooking } = useCreateBooking();
  const { mutate: createBkashPayment, isPending: isPaying } =
    useCreateBkashPayment();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rentType, setRentType] = useState("SHORT_TERM");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const diffTime = Math.abs(
      new Date(end).getTime() - new Date(start).getTime(),
    );
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (rentType === "LONG_TERM") {
      return Number(room?.monthlyRent || 0);
    }
    const days = calculateDays(startDate, endDate);
    return Number(room?.dailyRent || 0) * days;
  };

  const onPreBook = () => {
    if (!user) {
      toast.error("Please login first to book a room");
      router.push(
        `/login?redirect=/buildings/${buildingId}/flats/${flatId}/rooms/${roomId}`,
      );
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      toast.error("Start date must be before end date");
      return;
    }

    const days = calculateDays(startDate, endDate);
    if (rentType === "SHORT_TERM" && days > 30) {
      toast.error("Short term booking cannot exceed 30 days");
      return;
    }

    if (rentType === "LONG_TERM" && days < 90) {
      toast.error("Long term booking must be at least 90 days");
      return;
    }

    setIsDialogOpen(true);
  };

  const handleBooking = () => {
    createBooking(
      {
        roomId,
        rentType,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      },
      {
        onSuccess: (res) => {
          const bookingId = res.data.id;
          // Successfully created booking, now initiate bKash payment
          createBkashPayment(
            { bookingId, paymentType: "BOOKING" },
            {
              onSuccess: (paymentRes) => {
                if (paymentRes.data?.paymentUrl) {
                  window.location.href = paymentRes.data.paymentUrl;
                } else {
                  toast.error("Invalid payment URL received");
                }
              },
              onError: (error: any) => {
                toast.error(error.message || "Failed to initiate payment");
              },
            },
          );
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.data?.message ||
            error?.message ||
            "Booking failed";
          toast.error(errorMessage);
        },
      },
    );
  };

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
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Room not found
          </h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            The room you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Button
            onClick={() =>
              router.push(`/buildings/${buildingId}/flats/${flatId}`)
            }
            className="mt-6"
            variant="outline"
          >
            Back to Flat
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
                <BreadcrumbLink
                  href={`/buildings/${building.id}/flats/${flat.id}`}
                >
                  Flat {flat.flatNumber}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{room.name}</BreadcrumbPage>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Main Content (Left Column) */}
          <div className="space-y-8">
            <div className="surface p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge
                  className={
                    room.status === "AVAILABLE"
                      ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                  }
                >
                  {room.status}
                </Badge>
                {room.roomType && (
                  <Badge
                    variant="outline"
                    className="uppercase tracking-wider text-xs"
                  >
                    {room.roomType.replace("_", " ")}
                  </Badge>
                )}
                {room.furnished && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary"
                  >
                    Furnished
                  </Badge>
                )}
              </div>
              <h1 className="mb-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                {room.name}
              </h1>
              <div className="flex items-center text-gray-500 dark:text-gray-400 mb-6">
                <HomeIcon className="w-4 h-4 mr-1.5" />
                <span>
                  Inside Flat {flat.flatNumber}, Floor {flat.floorNumber}
                </span>
              </div>
            </div>

            {/* Image Section */}
            <div className="group relative h-[300px] w-full overflow-hidden rounded-3xl border border-border/70 bg-muted shadow-xl shadow-primary/5 sm:h-[450px]">
              {room.roomImage ? (
                <img
                  src={room.roomImage}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                  <DoorClosedIcon className="w-20 h-20 mb-4 opacity-40" />
                  <span className="text-lg font-medium">
                    No Image Available
                  </span>
                </div>
              )}
            </div>

            <section className="surface p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                Room Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <UsersIcon className="w-6 h-6 text-primary mr-4 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                      Capacity
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      Up to {room.maxOccupants} occupants allowed
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <BedSingleIcon className="w-6 h-6 text-primary mr-4 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                      Availability
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      {room.availableBed} beds currently available
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <HomeIcon className="w-6 h-6 text-primary mr-4 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                      Furnishing
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      {room.furnished
                        ? "Fully furnished and ready to move in"
                        : "Unfurnished, bring your own furniture"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CalendarIcon className="w-6 h-6 text-primary mr-4 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                      Available From
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      {room.availableFrom
                        ? new Date(room.availableFrom).toLocaleDateString()
                        : "Immediately"}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar (Right Column) */}
          <div className="space-y-8">
            <Card className="sticky top-24 overflow-hidden rounded-3xl shadow-xl shadow-primary/10">
              <div className="bg-primary/5 p-6 sm:p-8 border-b border-primary/10">
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">
                    Monthly Rent
                  </p>
                  <div className="text-4xl font-extrabold text-primary">
                    ৳{Number(room.monthlyRent).toLocaleString()}
                    <span className="text-lg text-gray-500 dark:text-gray-400 font-normal">
                      {" "}
                      /mo
                    </span>
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
                    <span className="font-bold text-gray-900 dark:text-white">
                      ৳{Number(room.dailyRent).toLocaleString()} /day
                    </span>
                  </div>
                )}

                <div className="py-6 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Status
                    </span>
                    <span
                      className={`font-semibold ${room.status === "AVAILABLE" ? "text-green-600 dark:text-green-400" : "text-gray-700 dark:text-gray-300"}`}
                    >
                      {room.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Type
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {room.roomType?.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Available Beds
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {room.availableBed} of {room.maxOccupants}
                    </span>
                  </div>
                </div>

                {room.status === "AVAILABLE" && (
                  <div className="mt-4 space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="space-y-2">
                      <Label>Rent Type</Label>
                      <Select
                        value={rentType}
                        onValueChange={(val) => setRentType(val as string)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select rent type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SHORT_TERM">Short Term</SelectItem>
                          <SelectItem value="LONG_TERM">Long Term</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          min={
                            startDate || new Date().toISOString().split("T")[0]
                          }
                        />
                      </div>
                    </div>

                    <Button
                      onClick={onPreBook}
                      className="w-full h-12 text-lg font-bold shadow-lg bg-[#e2136e] hover:bg-[#b50f58] text-white transition-all mt-4"
                    >
                      Book this Room
                    </Button>
                    <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                      You will be securely redirected to bKash to complete your
                      payment.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Booking & Payment</DialogTitle>
            <DialogDescription>
              Please review your booking details before proceeding to payment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-gray-500 dark:text-gray-400">Rent Type</div>
              <div className="font-semibold text-right">
                {rentType === "LONG_TERM" ? "Long Term" : "Short Term"}
              </div>

              <div className="text-gray-500 dark:text-gray-400">Start Date</div>
              <div className="font-semibold text-right">
                {startDate ? new Date(startDate).toLocaleDateString() : ""}
              </div>

              <div className="text-gray-500 dark:text-gray-400">End Date</div>
              <div className="font-semibold text-right">
                {endDate ? new Date(endDate).toLocaleDateString() : ""}
              </div>

              <div className="text-gray-500 dark:text-gray-400">Duration</div>
              <div className="font-semibold text-right">
                {calculateDays(startDate, endDate)} Days
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-[#e2136e]">
                  ৳{calculateTotal().toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isBooking || isPaying}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBooking}
              disabled={isBooking || isPaying}
              className="bg-[#e2136e] hover:bg-[#b50f58] text-white font-bold"
            >
              {isBooking || isPaying ? "Processing..." : "Pay with bKash"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

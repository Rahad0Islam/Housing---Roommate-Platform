"use client";

import React from "react";
import {
  useBookings,
  useCancelBooking,
  useCompleteBooking,
  useOnGoingBooking,
} from "@/hooks/booking.hook";
import { useGetMe } from "@/hooks/auth.hook";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontalIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayCircleIcon,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

export default function BookingsPage() {
  const { data: userRes } = useGetMe();
  const user = userRes?.data;
  const isOwner = user?.role === "OWNER" || user?.role === "ADMIN";

  const { data: bookingsRes, isLoading } = useBookings();
  const bookings = bookingsRes?.data?.data || [];

  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();
  const { mutate: completeBooking, isPending: isCompleting } =
    useCompleteBooking();
  const { mutate: onGoingBooking, isPending: isSettingOngoing } =
    useOnGoingBooking();

  const handleCancel = (id: string) => {
    cancelBooking(id, {
      onSuccess: () => toast.success("Booking cancelled"),
      onError: (err: any) =>
        toast.error(err?.response?.data?.message || "Failed to cancel"),
    });
  };

  const handleOngoing = (id: string) => {
    onGoingBooking(id, {
      onSuccess: () => toast.success("Booking marked as ongoing"),
      onError: (err: any) =>
        toast.error(err?.response?.data?.message || "Failed to update"),
    });
  };

  const handleComplete = (id: string) => {
    completeBooking(id, {
      onSuccess: () => toast.success("Booking marked as completed"),
      onError: (err: any) =>
        toast.error(err?.response?.data?.message || "Failed to update"),
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">Confirmed</Badge>
        );
      case "ON_GOING":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Ongoing</Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600">Completed</Badge>
        );
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-600"
          >
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="gradient-mesh motion-rise space-y-8">
      <div className="rounded-3xl border border-primary/15 bg-primary/[0.06] p-6 md:p-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Stay organized
        </p>
        <h2 className="font-heading text-3xl font-bold tracking-tight">
          Bookings Management
        </h2>
        <p className="mt-2 text-muted-foreground">
          Manage and track all property bookings.
        </p>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <CalendarIcon className="w-12 h-12 text-muted-foreground opacity-30 mb-4" />
              <h3 className="text-lg font-semibold">No bookings found</h3>
              <p className="text-muted-foreground">
                There are currently no bookings to display.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property / Room</TableHead>
                    {isOwner && <TableHead>Tenant</TableHead>}
                    <TableHead>Period</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking: any) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="font-medium">{booking.room?.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {booking.room?.flat?.building?.name} (Flat{" "}
                          {booking.room?.flat?.flatNumber})
                        </div>
                      </TableCell>
                      {isOwner && (
                        <TableCell>
                          <div className="font-medium">
                            {booking.tenant?.name || "Unknown"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {booking.tenant?.email}
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(booking.startDate), "MMM d, yyyy")} -{" "}
                          {format(new Date(booking.endDate), "MMM d, yyyy")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {booking.rentType.replace("_", " ")}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-primary">
                        ৳{booking.amount}
                      </TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button variant="ghost" className="h-8 w-8 p-0" />
                            }
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {/* Tenant and Owner can cancel if Pending */}
                            {booking.status === "PENDING" && (
                              <ConfirmationDialog
                                trigger={
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    disabled={isCancelling}
                                  >
                                    <XCircleIcon className="mr-2 h-4 w-4" /> Cancel
                                    Booking
                                  </DropdownMenuItem>
                                }
                                title="Cancel this booking?"
                                description="This booking will be cancelled and the tenant and owner will be notified."
                                confirmLabel="Cancel booking"
                                destructive
                                onConfirm={() => handleCancel(booking.id)}
                              />
                            )}

                            {/* Only Owners/Admins can mark as Ongoing or Completed */}
                            {isOwner && booking.status === "CONFIRMED" && (
                              <ConfirmationDialog
                                trigger={
                                  <DropdownMenuItem
                                    className="text-green-600"
                                    disabled={isSettingOngoing}
                                  >
                                    <PlayCircleIcon className="mr-2 h-4 w-4" /> Mark
                                    as Ongoing
                                  </DropdownMenuItem>
                                }
                                title="Mark booking as ongoing?"
                                description="Use this when the tenant has moved into the property."
                                confirmLabel="Mark as ongoing"
                                onConfirm={() => handleOngoing(booking.id)}
                              />
                            )}

                            {isOwner && booking.status === "ON_GOING" && (
                              <ConfirmationDialog
                                trigger={
                                  <DropdownMenuItem disabled={isCompleting}>
                                    <CheckCircleIcon className="mr-2 h-4 w-4" />{" "}
                                    Mark as Completed
                                  </DropdownMenuItem>
                                }
                                title="Complete this booking?"
                                description="Use this when the tenant has moved out and the booking is finished."
                                confirmLabel="Complete booking"
                                onConfirm={() => handleComplete(booking.id)}
                              />
                            )}

                            {/* Fallback if no actions are available */}
                            {!(
                              booking.status === "PENDING" ||
                              (isOwner &&
                                (booking.status === "CONFIRMED" ||
                                  booking.status === "ON_GOING"))
                            ) && (
                              <DropdownMenuItem disabled>
                                No actions available
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

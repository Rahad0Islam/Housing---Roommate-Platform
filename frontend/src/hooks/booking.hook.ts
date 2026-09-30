import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking, getAllBookings, getBookingById, cancelBooking, completeBooking } from "@/api/booking.api";

export const useBookings = () => {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: getAllBookings,
  });
};

export const useBooking = (id: string) => {
  return useQuery({
    queryKey: ["bookings", id],
    queryFn: () => getBookingById(id),
    enabled: !!id,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useCompleteBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

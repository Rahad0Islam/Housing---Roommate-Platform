import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBookings, cancelBooking, completeBooking, onGoingBooking, createBooking } from "@/api/booking.api";

export const useBookings = (query?: any) => {
  return useQuery({
    queryKey: ["bookings", query],
    queryFn: () => getBookings(query),
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
};

export const useCompleteBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
};

export const useOnGoingBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: onGoingBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
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

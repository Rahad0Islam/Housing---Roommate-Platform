import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createRoom, updateRoom, deleteRoom, getRoomById, getRoomsByFlatId } from "@/api/room.api";
import { toast } from "sonner";

export const useRoomsByFlatId = (flatId: string) => {
  return useQuery({
    queryKey: ["rooms", flatId],
    queryFn: () => getRoomsByFlatId(flatId),
    enabled: !!flatId,
  });
};

export const useRoomDetails = (roomId: string) => {
  return useQuery({
    queryKey: ["room", roomId],
    queryFn: () => getRoomById(roomId),
    enabled: !!roomId,
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRoom,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rooms", variables.flatId] });
      toast.success("Room created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create room");
    },
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRoom,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room", data.data.id] });
      toast.success("Room updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update room");
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Room deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete room");
    },
  });
};

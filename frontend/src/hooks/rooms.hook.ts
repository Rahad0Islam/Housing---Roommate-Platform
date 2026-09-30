import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRooms, getRoomById, getRoomsByFlatId, createRoom, updateRoom, deleteRoom } from "@/api/rooms.api";

export const useRooms = () => {
  return useQuery({ queryKey: ["rooms"], queryFn: getRooms });
};

export const useRoom = (id: string) => {
  return useQuery({
    queryKey: ["rooms", id],
    queryFn: () => getRoomById(id),
    enabled: !!id,
  });
};

export const useRoomsByFlat = (flatId: string) => {
  return useQuery({
    queryKey: ["rooms", "flat", flatId],
    queryFn: () => getRoomsByFlatId(flatId),
    enabled: !!flatId,
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRoom,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rooms"] }),
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateRoom(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["rooms", id] });
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rooms"] }),
  });
};

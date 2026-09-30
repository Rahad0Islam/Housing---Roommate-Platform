// @ts-nocheck
"use client";

import React, { useState } from "react";
import { Plus, MoreHorizontal, Pencil, Trash, Bed, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRooms, useCreateRoom, useDeleteRoom } from "@/hooks/rooms.hook";
import { useFlats } from "@/hooks/flats.hook";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const roomSchema = z.object({
  flatId: z.string().min(1, "Flat is required"),
  roomNumber: z.string().min(1, "Room number is required"),
  type: z.enum(["SINGLE", "SHARED"], { required_error: "Type is required" }),
  rentAmount: z.coerce.number().min(0, "Rent amount must be 0 or greater"),
});

type RoomFormData = z.infer<typeof roomSchema>;

export default function OwnerRoomsPage() {
  const { data: roomsResponse, isLoading } = useRooms();
  const { data: flatsResponse } = useFlats();
  const rooms = roomsResponse?.data || [];
  const flats = flatsResponse?.data || [];
  
  const createMutation = useCreateRoom();
  const deleteMutation = useDeleteRoom();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema)
  });

  const onSubmit = async (data: RoomFormData) => {
    try {
      await createMutation.mutateAsync(data);
      setIsCreateOpen(false);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this room?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 capitalize">
            Rooms
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Manage your rooms across all flats.
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900">
              <Plus className="mr-2 h-4 w-4" /> Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
              <DialogDescription>
                Enter the details of your new room.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="flatId">Flat</Label>
                <Controller
                  name="flatId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a flat" />
                      </SelectTrigger>
                      <SelectContent>
                        {flats.map((f) => (
                          <SelectItem key={f.id} value={f.id}>Flat {f.flatNumber}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.flatId && <p className="text-sm text-red-500">{errors.flatId.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roomNumber">Room Number</Label>
                  <Input id="roomNumber" {...register("roomNumber")} placeholder="e.g. A1" />
                  {errors.roomNumber && <p className="text-sm text-red-500">{errors.roomNumber.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rentAmount">Rent Amount</Label>
                  <Input id="rentAmount" type="number" {...register("rentAmount")} placeholder="e.g. 5000" />
                  {errors.rentAmount && <p className="text-sm text-red-500">{errors.rentAmount.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Room Type</Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SINGLE">Single</SelectItem>
                        <SelectItem value="SHARED">Shared</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Room
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-zinc-400" />
                  </TableCell>
                </TableRow>
              ) : rooms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-zinc-500">
                    <Bed className="h-10 w-10 mx-auto text-zinc-300 mb-3" />
                    No rooms found. Click "Add Room" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">
                      {room.roomNumber}
                      <div className="text-xs text-zinc-500">Flat: {room.flatId}</div>
                    </TableCell>
                    <TableCell>{room.type}</TableCell>
                    <TableCell>${room.rentAmount}</TableCell>
                    <TableCell>
                      {room.isAvailable ? (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Available</span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/10">Occupied</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer text-red-600 focus:text-red-600"
                            onClick={() => handleDelete(room.id)}
                          >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

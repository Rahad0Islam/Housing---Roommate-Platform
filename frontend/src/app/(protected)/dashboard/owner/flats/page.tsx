// @ts-nocheck
"use client";

import React, { useState } from "react";
import { Plus, MoreHorizontal, Pencil, Trash, Home, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFlats, useCreateFlat, useDeleteFlat } from "@/hooks/flats.hook";
import { useOwnerBuildings } from "@/hooks/buildings.hook";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const flatSchema = z.object({
  buildingId: z.string().min(1, "Building is required"),
  flatNumber: z.string().min(1, "Flat number is required"),
  floor: z.coerce.number().min(0, "Floor must be 0 or greater"),
  description: z.string().optional(),
});

type FlatFormData = z.infer<typeof flatSchema>;

export default function OwnerFlatsPage() {
  const { data: flatsResponse, isLoading } = useFlats();
  const { data: buildingsResponse } = useOwnerBuildings();
  const flats = flatsResponse?.data || [];
  const buildings = buildingsResponse?.data || [];
  
  const createMutation = useCreateFlat();
  const deleteMutation = useDeleteFlat();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FlatFormData>({
    resolver: zodResolver(flatSchema)
  });

  const onSubmit = async (data: FlatFormData) => {
    try {
      await createMutation.mutateAsync(data);
      setIsCreateOpen(false);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this flat?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 capitalize">
            Flats
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Manage your flats across all buildings.
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900">
              <Plus className="mr-2 h-4 w-4" /> Add Flat
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Flat</DialogTitle>
              <DialogDescription>
                Enter the details of your new flat.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="buildingId">Building</Label>
                <Controller
                  name="buildingId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a building" />
                      </SelectTrigger>
                      <SelectContent>
                        {buildings.map((b) => (
                          <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.buildingId && <p className="text-sm text-red-500">{errors.buildingId.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="flatNumber">Flat Number</Label>
                  <Input id="flatNumber" {...register("flatNumber")} placeholder="e.g. 101" />
                  {errors.flatNumber && <p className="text-sm text-red-500">{errors.flatNumber.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floor">Floor</Label>
                  <Input id="floor" type="number" {...register("floor")} placeholder="e.g. 1" />
                  {errors.floor && <p className="text-sm text-red-500">{errors.floor.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input id="description" {...register("description")} placeholder="Brief description" />
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Flat
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
                <TableHead>Flat Number</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Building ID</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-zinc-400" />
                  </TableCell>
                </TableRow>
              ) : flats.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-zinc-500">
                    <Home className="h-10 w-10 mx-auto text-zinc-300 mb-3" />
                    No flats found. Click "Add Flat" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                flats.map((flat) => (
                  <TableRow key={flat.id}>
                    <TableCell className="font-medium">
                      {flat.flatNumber}
                    </TableCell>
                    <TableCell>
                      Floor {flat.floor}
                    </TableCell>
                    <TableCell className="text-zinc-500 text-xs truncate max-w-[150px]">
                      {flat.buildingId}
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
                            onClick={() => handleDelete(flat.id)}
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

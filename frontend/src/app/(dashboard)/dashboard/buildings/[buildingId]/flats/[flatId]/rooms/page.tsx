"use client";

import React, { useState, use } from "react";
import {
  useRoomsByFlatId,
  useCreateRoom,
  useDeleteRoom,
} from "@/hooks/room.hook";
import { useBuildingDetails } from "@/hooks/building.hook";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  PlusIcon,
  TrashIcon,
  ArrowLeftIcon,
  BedIcon,
  UsersIcon,
  CheckCircle2Icon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OwnerRoomsPage({
  params,
}: {
  params: Promise<{ buildingId: string; flatId: string }>;
}) {
  const router = useRouter();
  const { buildingId, flatId } = use(params);

  const { data: buildingRes } = useBuildingDetails(buildingId);
  const building = buildingRes?.data;
  const flat = building?.flats?.find((f) => f.id === flatId);

  const { data: roomsRes, isLoading } = useRoomsByFlatId(flatId);
  const rooms = roomsRes?.data || [];

  const { mutate: createRoom, isPending: isCreating } = useCreateRoom();
  const { mutate: deleteRoom, isPending: isDeleting } = useDeleteRoom();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    roomType: "SINGLE",
    maxOccupants: "1",
    monthlyRent: "",
    dailyRent: "",
    furnished: false,
    availableFrom: new Date().toISOString().split("T")[0],
    roomImage: null as File | null,
  });

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("roomType", formData.roomType);
    data.append("maxOccupants", formData.maxOccupants);
    data.append("monthlyRent", formData.monthlyRent);
    if (formData.dailyRent) data.append("dailyRent", formData.dailyRent);
    data.append("furnished", String(formData.furnished));
    data.append(
      "availableFrom",
      new Date(formData.availableFrom).toISOString(),
    );
    if (formData.roomImage) data.append("roomImage", formData.roomImage);

    createRoom(
      { flatId, data },
      {
        onSuccess: () => {
          setIsAddOpen(false);
          setFormData({
            name: "",
            roomType: "SINGLE",
            maxOccupants: "1",
            monthlyRent: "",
            dailyRent: "",
            furnished: false,
            availableFrom: new Date().toISOString().split("T")[0],
            roomImage: null,
          });
        },
      },
    );
  };

  return (
    <div className="gradient-mesh motion-rise space-y-8">
      <div className="flex items-center gap-4 text-muted-foreground mb-2">
        <Link
          href={`/dashboard/buildings/${buildingId}/flats`}
          className="hover:text-foreground flex items-center transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" /> Back to Flats
        </Link>
      </div>

      <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-6 rounded-xl border">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Flat {flat ? flat.flatNumber : "Loading..."} - Rooms
          </h2>
          <p className="text-muted-foreground">
            Manage all rooms available in this flat.
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger
            render={
              <Button className="bg-[#e2136e] hover:bg-[#b50f58] text-white" />
            }
          >
            <PlusIcon className="w-4 h-4 mr-2" /> Add Room
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddRoom} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Room Name / Label</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Master Bedroom"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roomType">Room Type</Label>
                  <Select
                    value={formData.roomType}
                    onValueChange={(v) =>
                      setFormData({ ...formData, roomType: v as string })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SINGLE">Single</SelectItem>
                      <SelectItem value="DOUBLE">Double</SelectItem>
                      <SelectItem value="SHARED">Shared</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxOccupants">Max Occupants</Label>
                  <Input
                    id="maxOccupants"
                    type="number"
                    value={formData.maxOccupants}
                    onChange={(e) =>
                      setFormData({ ...formData, maxOccupants: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="furnished">Furnished</Label>
                  <div className="flex items-center h-10 border rounded-md px-3 bg-secondary/20">
                    <Switch
                      checked={formData.furnished}
                      onCheckedChange={(v) =>
                        setFormData({ ...formData, furnished: v })
                      }
                      id="furnished"
                    />
                    <Label htmlFor="furnished" className="ml-2">
                      Yes, it is furnished
                    </Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyRent">Monthly Rent (৳)</Label>
                  <Input
                    id="monthlyRent"
                    type="number"
                    value={formData.monthlyRent}
                    onChange={(e) =>
                      setFormData({ ...formData, monthlyRent: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dailyRent">Daily Rent (৳) - Optional</Label>
                  <Input
                    id="dailyRent"
                    type="number"
                    value={formData.dailyRent}
                    onChange={(e) =>
                      setFormData({ ...formData, dailyRent: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availableFrom">Available From</Label>
                  <Input
                    id="availableFrom"
                    type="date"
                    value={formData.availableFrom}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        availableFrom: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Room Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      roomImage: e.target.files?.[0] || null,
                    })
                  }
                />
              </div>
              <Button
                type="submit"
                disabled={isCreating}
                className="w-full mt-4 bg-[#e2136e] hover:bg-[#b50f58]"
              >
                {isCreating ? "Creating..." : "Create Room"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[300px] rounded-xl" />
          ))}
        </div>
      ) : rooms.length === 0 ? (
        <Card className="flex flex-col items-center justify-center h-64 border-dashed">
          <BedIcon className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No rooms found</h3>
          <p className="text-muted-foreground mb-4">
            You haven't added any rooms to this flat.
          </p>
          <Button onClick={() => setIsAddOpen(true)} variant="outline">
            Add Your First Room
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room: any) => (
            <Card
              key={room.id}
              className="overflow-hidden hover:shadow-md transition-all"
            >
              <div className="h-40 bg-gray-100 dark:bg-gray-800 relative">
                {room.roomImage ? (
                  <img
                    src={room.roomImage}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full opacity-30">
                    <BedIcon className="w-16 h-16" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <Badge
                    className={
                      room.status === "AVAILABLE"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-500"
                    }
                  >
                    {room.status}
                  </Badge>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="w-6 h-6 rounded-full"
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this room?")
                      ) {
                        deleteRoom(room.id);
                      }
                    }}
                    disabled={isDeleting}
                  >
                    <TrashIcon className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold truncate">{room.name}</h3>
                  <Badge variant="outline">{room.roomType}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <UsersIcon className="w-4 h-4 mr-2" />
                    {room.availableBed} of {room.maxOccupants} Beds
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle2Icon
                      className={`w-4 h-4 mr-2 ${room.furnished ? "text-green-500" : "text-gray-300"}`}
                    />
                    {room.furnished ? "Furnished" : "Unfurnished"}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t flex justify-between items-center">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Monthly Rent
                    </p>
                    <p className="font-bold text-primary text-lg">
                      ৳{Number(room.monthlyRent).toLocaleString()}
                    </p>
                  </div>
                  {room.dailyRent && Number(room.dailyRent) > 0 && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Daily Rent
                      </p>
                      <p className="font-bold text-gray-700 dark:text-gray-300">
                        ৳{Number(room.dailyRent).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

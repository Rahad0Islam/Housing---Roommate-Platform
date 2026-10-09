"use client";

import React, { useState, use } from "react";
import {
  useFlatsByBuildingId,
  useCreateFlat,
  useDeleteFlat,
} from "@/hooks/flat.hook";
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
  PlusIcon,
  TrashIcon,
  ArrowLeftIcon,
  LayoutDashboardIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OwnerFlatsPage({
  params,
}: {
  params: Promise<{ buildingId: string }>;
}) {
  const router = useRouter();
  const { buildingId } = use(params);

  const { data: buildingRes } = useBuildingDetails(buildingId);
  const building = buildingRes?.data;

  const { data: flatsRes, isLoading } = useFlatsByBuildingId(buildingId);
  const flats =
    (Array.isArray(flatsRes?.data)
      ? flatsRes?.data
      : (flatsRes?.data as any)?.flats) || [];

  const { mutate: createFlat, isPending: isCreating } = useCreateFlat();
  const { mutate: deleteFlat, isPending: isDeleting } = useDeleteFlat();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    flatNumber: "",
    floorNumber: "",
    bedrooms: "1",
    bathrooms: "1",
    balcony: "0",
    totalArea: "1000",
    status: "AVAILABLE",
  });

  const handleAddFlat = (e: React.FormEvent) => {
    e.preventDefault();
    createFlat(
      {
        buildingId,
        flatNumber: formData.flatNumber,
        floorNumber: Number(formData.floorNumber),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        balcony: Number(formData.balcony),
        totalArea: Number(formData.totalArea),
        status: formData.status,
      },
      {
        onSuccess: () => {
          setIsAddOpen(false);
          setFormData({
            flatNumber: "",
            floorNumber: "",
            bedrooms: "1",
            bathrooms: "1",
            balcony: "0",
            totalArea: "1000",
            status: "AVAILABLE",
          });
        },
      },
    );
  };

  return (
    <div className="gradient-mesh motion-rise space-y-8">
      <div className="flex items-center gap-4 text-muted-foreground mb-2">
        <Link
          href="/dashboard/buildings"
          className="hover:text-foreground flex items-center transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" /> Back to Buildings
        </Link>
      </div>

      <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-6 rounded-xl border">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {building ? building.name : "Loading..."} - Flats
          </h2>
          <p className="text-muted-foreground">
            Manage all flats inside this building.
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger
            render={
              <Button className="bg-[#e2136e] hover:bg-[#b50f58] text-white" />
            }
          >
            <PlusIcon className="w-4 h-4 mr-2" /> Add Flat
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Flat</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddFlat} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="flatNumber">Flat Number / Name</Label>
                  <Input
                    id="flatNumber"
                    value={formData.flatNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, flatNumber: e.target.value })
                    }
                    placeholder="e.g. 1A, Ground Floor"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floorNumber">Floor Number</Label>
                  <Input
                    id="floorNumber"
                    type="number"
                    value={formData.floorNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, floorNumber: e.target.value })
                    }
                    placeholder="e.g. 1"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) =>
                      setFormData({ ...formData, bedrooms: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) =>
                      setFormData({ ...formData, bathrooms: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="balcony">Balcony</Label>
                  <Input
                    id="balcony"
                    type="number"
                    value={formData.balcony}
                    onChange={(e) =>
                      setFormData({ ...formData, balcony: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalArea">Total Area (sq. ft)</Label>
                  <Input
                    id="totalArea"
                    type="number"
                    value={formData.totalArea}
                    onChange={(e) =>
                      setFormData({ ...formData, totalArea: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isCreating}
                className="w-full bg-[#e2136e] hover:bg-[#b50f58]"
              >
                {isCreating ? "Creating..." : "Create Flat"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[200px] rounded-xl" />
          ))}
        </div>
      ) : flats.length === 0 ? (
        <Card className="flex flex-col items-center justify-center h-64 border-dashed">
          <LayoutDashboardIcon className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No flats found</h3>
          <p className="text-muted-foreground mb-4">
            You haven't added any flats to this building.
          </p>
          <Button onClick={() => setIsAddOpen(true)} variant="outline">
            Add Your First Flat
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          {flats.map((flat: any) => (
            <Card
              key={flat.id}
              className="overflow-hidden group hover:shadow-md transition-all flex flex-col"
            >
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {flat.flatNumber}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 -mr-2 -mt-2"
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this flat?")
                      ) {
                        deleteFlat(flat.id);
                      }
                    }}
                    disabled={isDeleting}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-1 mb-6 flex-1">
                  <p className="text-sm text-muted-foreground">
                    Floor:{" "}
                    <span className="font-semibold text-foreground">
                      {flat.floorNumber}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Rooms:{" "}
                    <span className="font-semibold text-foreground">
                      {flat.rooms?.length || 0}
                    </span>
                  </p>
                </div>

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/dashboard/buildings/${buildingId}/flats/${flat.id}/rooms`,
                    )
                  }
                >
                  Manage Rooms
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

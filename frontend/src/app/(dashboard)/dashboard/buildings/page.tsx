"use client";

import React, { useState } from "react";
import {
  useOwnerBuildings,
  useCreateBuilding,
  useUpdateBuilding,
  useDeleteBuilding,
} from "@/hooks/building.hook";
import { useCreateAmenity, useDeleteAmenity } from "@/hooks/amenity.hook";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  BuildingIcon,
  PlusIcon,
  TrashIcon,
  EditIcon,
  HomeIcon,
  MapPinIcon,
  PlusIcon as PlusSmallIcon,
  XIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function OwnerBuildingsPage() {
  const router = useRouter();
  const { data: response, isLoading } = useOwnerBuildings();
  const buildings = response?.data || [];

  const { mutateAsync: createBuilding, isPending: isCreating } =
    useCreateBuilding();
  const { mutateAsync: updateBuilding, isPending: isUpdating } =
    useUpdateBuilding();
  const { mutate: deleteBuilding, isPending: isDeleting } = useDeleteBuilding();
  const { mutateAsync: createAmenity } = useCreateAmenity();
  const { mutate: deleteAmenity } = useDeleteAmenity();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    numberOfFloors: "",
    city: "",
    buildingImage: null as File | null,
    amenities: "",
  });
  const [editingBuilding, setEditingBuilding] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    address: "",
    description: "",
    numberOfFloors: "",
    city: "",
    buildingImage: null as File | null,
    amenities: "",
  });

  const handleAddBuilding = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("address", formData.address);
    data.append("description", formData.description);
    data.append("numberOfFloors", formData.numberOfFloors);
    data.append("city", formData.city);
    if (formData.buildingImage) {
      data.append("buildingImage", formData.buildingImage);
    }

    createBuilding(data).then(async (response) => {
      const names = formData.amenities
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean);
      await Promise.all(
        names.map((name) =>
          createAmenity({ buildingId: response.data.id, name }),
        ),
      );
      setIsAddOpen(false);
      setFormData({
        name: "",
        address: "",
        description: "",
        numberOfFloors: "",
        city: "",
        buildingImage: null,
        amenities: "",
      });
    });
  };

  const openEdit = (building: any) => {
    setEditingBuilding(building);
    setEditFormData({
      name: building.name || "",
      address: building.address || "",
      description: building.description || "",
      numberOfFloors: String(building.numberOfFloors || ""),
      city: building.city || "",
      buildingImage: null,
      amenities: "",
    });
  };

  const handleUpdateBuilding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBuilding) return;
    const data = new FormData();
    data.append("name", editFormData.name);
    data.append("address", editFormData.address);
    data.append("description", editFormData.description);
    data.append("numberOfFloors", editFormData.numberOfFloors);
    data.append("city", editFormData.city);
    if (editFormData.buildingImage) {
      data.append("buildingImage", editFormData.buildingImage);
    }
    await updateBuilding({ id: editingBuilding.id, data });
    const names = editFormData.amenities
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean);
    await Promise.all(
      names.map((name) =>
        createAmenity({ buildingId: editingBuilding.id, name }),
      ),
    );
    setEditingBuilding(null);
  };

  return (
    <div className="gradient-mesh motion-rise space-y-8">
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-primary/15 bg-primary/[0.06] p-6 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Property studio
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight">
            My Buildings
          </h2>
          <p className="mt-2 text-muted-foreground">
            Manage your properties, flats, and rooms.
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger
            render={<Button className="shadow-lg shadow-primary/20" />}
          >
            <PlusIcon className="w-4 h-4 mr-2" /> Add Building
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Building</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddBuilding} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Building Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Sunrise Apartments"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="e.g. Dhaka, Sylhet"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="e.g. 123 Main St"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  className="min-h-24 w-full rounded-xl border border-input bg-background/70 px-3.5 py-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="e.g. A beautiful hostel with modern amenities"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amenities">Amenities & Features</Label>
                <Input
                  id="amenities"
                  value={formData.amenities}
                  onChange={(e) =>
                    setFormData({ ...formData, amenities: e.target.value })
                  }
                  placeholder="Wi-Fi, Parking, Security (comma separated)"
                />
                <p className="text-xs text-muted-foreground">
                  Add multiple features separated by commas.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numberOfFloors">Number of Floors</Label>
                  <Input
                    id="numberOfFloors"
                    type="number"
                    value={formData.numberOfFloors}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        numberOfFloors: e.target.value,
                      })
                    }
                    placeholder="e.g. 4"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Building Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        buildingImage: e.target.files?.[0] || null,
                      })
                    }
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isCreating}
                className="w-full shadow-lg shadow-primary/20"
              >
                {isCreating ? "Creating..." : "Create Building"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog
        open={!!editingBuilding}
        onOpenChange={(open) => !open && setEditingBuilding(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Building Information</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateBuilding} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {(
                [
                  ["name", "Building Name"],
                  ["city", "City"],
                  ["address", "Full Address"],
                  ["numberOfFloors", "Number of Floors"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={`edit-${key}`}>{label}</Label>
                  <Input
                    id={`edit-${key}`}
                    type={key === "numberOfFloors" ? "number" : "text"}
                    value={editFormData[key]}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        [key]: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <textarea
                id="edit-description"
                className="min-h-24 w-full rounded-xl border border-input bg-background/70 px-3.5 py-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image">Replace Building Image</Label>
              <Input
                id="edit-image"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    buildingImage: e.target.files?.[0] || null,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-amenities">Add Amenities & Features</Label>
              <Input
                id="edit-amenities"
                value={editFormData.amenities}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    amenities: e.target.value,
                  })
                }
                placeholder="Gym, Elevator, Laundry (comma separated)"
              />
            </div>
            <Button type="submit" disabled={isUpdating} className="w-full">
              {isUpdating ? "Saving changes..." : "Save Building Changes"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[300px] rounded-xl" />
          ))}
        </div>
      ) : buildings.length === 0 ? (
        <Card className="flex flex-col items-center justify-center h-64 border-dashed">
          <BuildingIcon className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No buildings found</h3>
          <p className="text-muted-foreground mb-4">
            You haven't added any properties yet.
          </p>
          <Button onClick={() => setIsAddOpen(true)} variant="outline">
            Add Your First Building
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {buildings.map((building: any) => (
            <Card
              key={building.id}
              className="overflow-hidden group hover:shadow-md transition-all"
            >
              <div className="h-48 bg-gray-100 dark:bg-gray-800 relative">
                {building.buildingImage ? (
                  <img
                    src={building.buildingImage}
                    alt={building.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full opacity-30">
                    <BuildingIcon className="w-16 h-16" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      router.push(`/dashboard/buildings/${building.id}/flats`)
                    }
                  >
                    Manage Flats
                  </Button>
                </div>
              </div>
              <CardContent className="p-5">
                <h3 className="text-xl font-bold mb-2 truncate">
                  {building.name}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <MapPinIcon className="w-4 h-4 mr-1 shrink-0" />
                  <span className="truncate">{building.address}</span>
                </div>
                <div className="mt-4 border-t border-border/70 pt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold">
                      Amenities & Features
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-primary"
                      onClick={() => openEdit(building)}
                    >
                      <PlusSmallIcon className="mr-1 h-3.5 w-3.5" /> Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(building.amenities || [])
                      .slice(0, 4)
                      .map((amenity: any) => (
                        <span
                          key={amenity.id}
                          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                        >
                          {amenity.name}
                          <button
                            type="button"
                            aria-label={`Remove ${amenity.name}`}
                            className="rounded-full hover:bg-primary/20"
                            onClick={() => deleteAmenity(amenity.id)}
                          >
                            <XIcon className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    {(!building.amenities ||
                      building.amenities.length === 0) && (
                      <p className="text-xs text-muted-foreground">
                        No amenities added yet.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex space-x-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Flats</p>
                      <p className="font-semibold">
                        {building.flats?.length || 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-primary hover:bg-primary/10"
                      onClick={() => openEdit(building)}
                      aria-label={`Edit ${building.name}`}
                    >
                      <EditIcon className="w-4 h-4" />
                    </Button>
                    <ConfirmationDialog
                      trigger={
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                          disabled={isDeleting}
                          aria-label={`Delete ${building.name}`}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      }
                      title="Delete this building?"
                      description={`This will permanently remove ${building.name} and its related property data. This action cannot be undone.`}
                      confirmLabel="Delete building"
                      destructive
                      onConfirm={() => deleteBuilding(building.id)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

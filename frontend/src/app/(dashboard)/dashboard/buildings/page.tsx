"use client";

import React, { useState } from "react";
import { useOwnerBuildings, useCreateBuilding, useDeleteBuilding } from "@/hooks/building.hook";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BuildingIcon, PlusIcon, TrashIcon, EditIcon, HomeIcon, MapPinIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function OwnerBuildingsPage() {
  const router = useRouter();
  const { data: response, isLoading } = useOwnerBuildings();
  const buildings = response?.data || [];
  
  const { mutate: createBuilding, isPending: isCreating } = useCreateBuilding();
  const { mutate: deleteBuilding, isPending: isDeleting } = useDeleteBuilding();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    numberOfFloors: "",
    city: "",
    buildingImage: null as File | null
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
    
    createBuilding(data, {
      onSuccess: () => {
        setIsAddOpen(false);
        setFormData({ name: "", address: "", description: "", numberOfFloors: "", city: "", buildingImage: null });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">My Buildings</h2>
          <p className="text-muted-foreground">Manage your properties, flats, and rooms.</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger
            render={
              <Button className="bg-[#e2136e] hover:bg-[#b50f58] text-white" />
            }
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
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    placeholder="e.g. Sunrise Apartments" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    value={formData.city} 
                    onChange={e => setFormData({...formData, city: e.target.value})} 
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
                  onChange={e => setFormData({...formData, address: e.target.value})} 
                  placeholder="e.g. 123 Main St" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="e.g. A beautiful hostel with modern amenities" 
                  required 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numberOfFloors">Number of Floors</Label>
                  <Input 
                    id="numberOfFloors" 
                    type="number"
                    value={formData.numberOfFloors} 
                    onChange={e => setFormData({...formData, numberOfFloors: e.target.value})} 
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
                    onChange={e => setFormData({...formData, buildingImage: e.target.files?.[0] || null})} 
                  />
                </div>
              </div>
              <Button type="submit" disabled={isCreating} className="w-full bg-[#e2136e] hover:bg-[#b50f58]">
                {isCreating ? "Creating..." : "Create Building"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-[300px] rounded-xl" />)}
        </div>
      ) : buildings.length === 0 ? (
        <Card className="flex flex-col items-center justify-center h-64 border-dashed">
          <BuildingIcon className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No buildings found</h3>
          <p className="text-muted-foreground mb-4">You haven't added any properties yet.</p>
          <Button onClick={() => setIsAddOpen(true)} variant="outline">Add Your First Building</Button>
        </Card>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {buildings.map((building: any) => (
            <Card key={building.id} className="overflow-hidden group hover:shadow-md transition-all">
              <div className="h-48 bg-gray-100 dark:bg-gray-800 relative">
                {building.buildingImage ? (
                  <img src={building.buildingImage} alt={building.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full opacity-30">
                    <BuildingIcon className="w-16 h-16" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={() => router.push(`/dashboard/buildings/${building.id}/flats`)}
                  >
                    Manage Flats
                  </Button>
                </div>
              </div>
              <CardContent className="p-5">
                <h3 className="text-xl font-bold mb-2 truncate">{building.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <MapPinIcon className="w-4 h-4 mr-1 shrink-0" />
                  <span className="truncate">{building.address}</span>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex space-x-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Flats</p>
                      <p className="font-semibold">{building.flats?.length || 0}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this building?")) {
                          deleteBuilding(building.id);
                        }
                      }}
                      disabled={isDeleting}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
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

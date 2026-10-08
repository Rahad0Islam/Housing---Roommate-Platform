"use client";

import React, { useState } from "react";
import { useUtilityBills, useCreateUtilityBill, useCreateMonthlyBill } from "@/hooks/utility.hook";
import { useOwnerBuildings } from "@/hooks/building.hook";
import { useFlatsByBuildingId } from "@/hooks/flat.hook";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { PlusIcon, ReceiptIcon } from "lucide-react";

export default function UtilityBillsPage() {
  const { data: billsRes, isLoading } = useUtilityBills();
  const bills = billsRes?.data || [];

  const { data: buildingsRes } = useOwnerBuildings();
  const buildings = buildingsRes?.data || [];

  const { mutateAsync: createUtilityBill, isPending: isCreatingUtility } = useCreateUtilityBill();
  const { mutateAsync: createMonthlyBill, isPending: isCreatingMonthly } = useCreateMonthlyBill();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("");
  const [formData, setFormData] = useState({
    flatId: "",
    billingMonth: new Date().toISOString().split('T')[0],
    currentBill: "",
    gasBill: "",
    othersBill: ""
  });

  const { data: flatsRes, isLoading: isLoadingFlats } = useFlatsByBuildingId(selectedBuildingId);
  const flats = (Array.isArray(flatsRes?.data) ? flatsRes?.data : (flatsRes?.data as any)?.flats) || [];

  const handleCreateBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.flatId) return alert("Please select a flat");

    try {
      // 1. Create Utility Bill
      const utilityRes = await createUtilityBill({
        flatId: formData.flatId,
        billingMonth: new Date(formData.billingMonth).toISOString(),
        currentBill: Number(formData.currentBill) || 0,
        gasBill: Number(formData.gasBill) || 0,
        othersBill: Number(formData.othersBill) || 0,
      });

      const utilityId = utilityRes?.data?.id;
      if (!utilityId) return;

      // 2. Automatically create Monthly Bill
      await createMonthlyBill({
        flatId: formData.flatId,
        utilityId,
        billingMonth: new Date(formData.billingMonth).toISOString(),
      });

      setIsAddOpen(false);
      setSelectedBuildingId("");
      setFormData({
        flatId: "",
        billingMonth: new Date().toISOString().split('T')[0],
        currentBill: "",
        gasBill: "",
        othersBill: ""
      });
    } catch (error) {
      console.error("Failed to create bills", error);
    }
  };

  const isCreating = isCreatingUtility || isCreatingMonthly;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-6 rounded-xl border">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Utility & Monthly Bills</h2>
          <p className="text-muted-foreground">Manage and generate utility bills for flats.</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger
            render={
              <Button className="bg-[#e2136e] hover:bg-[#b50f58] text-white" />
            }
          >
            <PlusIcon className="w-4 h-4 mr-2" /> Generate Bill
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Generate Utility & Monthly Bill</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateBill} className="space-y-4 pt-4">
              
              <div className="space-y-2">
                <Label htmlFor="buildingId">Select Building</Label>
                <Select 
                  value={selectedBuildingId} 
                  onValueChange={(val) => {
                    setSelectedBuildingId(val as string);
                    setFormData({...formData, flatId: ""}); // Reset flat when building changes
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a building" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildings.map((building: any) => (
                      <SelectItem key={building.id} value={building.id}>
                        {building.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="flatId">Select Flat</Label>
                <Select 
                  value={formData.flatId} 
                  onValueChange={(val) => setFormData({...formData, flatId: val as string})}
                  disabled={!selectedBuildingId || isLoadingFlats}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingFlats ? "Loading flats..." : "Select a flat"} />
                  </SelectTrigger>
                  <SelectContent>
                    {flats.map((flat: any) => (
                      <SelectItem key={flat.id} value={flat.id}>
                        Flat {flat.flatNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="billingMonth">Billing Month</Label>
                <Input 
                  id="billingMonth" 
                  type="date"
                  value={formData.billingMonth} 
                  onChange={e => setFormData({...formData, billingMonth: e.target.value})} 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentBill">Electricity Bill (৳)</Label>
                  <Input 
                    id="currentBill" 
                    type="number"
                    value={formData.currentBill} 
                    onChange={e => setFormData({...formData, currentBill: e.target.value})} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gasBill">Gas Bill (৳)</Label>
                  <Input 
                    id="gasBill" 
                    type="number"
                    value={formData.gasBill} 
                    onChange={e => setFormData({...formData, gasBill: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="othersBill">Other Bills (Water, Trash, etc) (৳)</Label>
                <Input 
                  id="othersBill" 
                  type="number"
                  value={formData.othersBill} 
                  onChange={e => setFormData({...formData, othersBill: e.target.value})} 
                  required 
                />
              </div>
              
              <div className="pt-2">
                <div className="bg-primary/10 p-3 rounded-lg text-sm text-primary mb-4 flex justify-between items-center">
                  <span>Total Utility:</span>
                  <span className="font-bold text-lg">
                    ৳{(Number(formData.currentBill) || 0) + (Number(formData.gasBill) || 0) + (Number(formData.othersBill) || 0)}
                  </span>
                </div>
                <Button type="submit" disabled={isCreating || !formData.flatId} className="w-full bg-[#e2136e] hover:bg-[#b50f58]">
                  {isCreating ? "Generating Bills..." : "Generate & Link Monthly Bill"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : bills.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <ReceiptIcon className="w-12 h-12 text-muted-foreground opacity-30 mb-4" />
              <h3 className="text-lg font-semibold">No bills generated</h3>
              <p className="text-muted-foreground">You haven't generated any utility bills yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Flat</TableHead>
                    <TableHead>Billing Month</TableHead>
                    <TableHead>Electricity</TableHead>
                    <TableHead>Gas</TableHead>
                    <TableHead>Others</TableHead>
                    <TableHead className="text-right">Total Utility</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bills.map((bill: any) => {
                    const total = Number(bill.currentBill) + Number(bill.gasBill) + Number(bill.othersBill);
                    return (
                      <TableRow key={bill.id}>
                        <TableCell>
                          <div className="font-medium">Flat {bill.flat?.flatNumber || bill.flatId}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {format(new Date(bill.billingMonth), "MMMM yyyy")}
                          </div>
                        </TableCell>
                        <TableCell>৳{bill.currentBill}</TableCell>
                        <TableCell>৳{bill.gasBill}</TableCell>
                        <TableCell>৳{bill.othersBill}</TableCell>
                        <TableCell className="text-right font-bold text-primary">
                          ৳{total}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useApplyAsOwner } from "@/hooks/owner.hook";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloudIcon } from "lucide-react";
import { useGetMe } from "@/hooks/auth.hook";
import { Badge } from "@/components/ui/badge";

export default function ApplyAsOwnerPage() {
  const [file, setFile] = useState<File | null>(null);
  const { mutate: applyAsOwner, isPending } = useApplyAsOwner();
  const { data: user } = useGetMe();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    // Use 'verrificationDocument' with double 'r' as expected by the backend
    formData.append("verrificationDocument", file);
    applyAsOwner(formData);
  };

  const ownerStatus = user?.data?.owners?.status;
  const isAlreadyApplied = ownerStatus === "PENDING" || ownerStatus === "VERIFIED";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Become an Owner</h2>
        <p className="text-muted-foreground">List your own properties and manage tenants.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Owner Application</CardTitle>
          <CardDescription>
            To become a verified property owner, please submit a valid identity document (National ID, Passport, or Property Deed in PDF format).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAlreadyApplied ? (
            <div className="p-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border">
              <h3 className="text-xl font-semibold mb-2">Application Status</h3>
              {ownerStatus === "PENDING" && (
                <Badge className="bg-yellow-500 text-base py-1 px-4">Pending Review</Badge>
              )}
              {ownerStatus === "VERIFIED" && (
                <Badge className="bg-green-500 text-base py-1 px-4">Approved</Badge>
              )}
              <p className="mt-4 text-muted-foreground">
                {ownerStatus === "PENDING" 
                  ? "Your application is currently being reviewed by an administrator. We will notify you once it has been processed." 
                  : "Congratulations! Your account is already verified as an Owner. You can now switch to your owner dashboard."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="document">Verification Document (PDF)</Label>
                <div className="border-2 border-dashed rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer relative">
                  <Input 
                    id="document" 
                    type="file" 
                    accept=".pdf,image/*" 
                    onChange={handleFileChange}
                    required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                    <UploadCloudIcon className="w-10 h-10 text-muted-foreground" />
                    <div className="font-medium">
                      {file ? file.name : "Click or drag file to upload"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Max file size: 5MB
                    </div>
                  </div>
                </div>
              </div>

              {ownerStatus === "REJECTED" && (
                <div className="p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-lg text-sm border border-red-100 dark:border-red-900">
                  Your previous application was rejected. You can submit a new application with updated documents.
                </div>
              )}

              <Button type="submit" className="w-full" disabled={!file || isPending}>
                {isPending ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OwnerProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 capitalize">
          profile
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Manage your profile.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            This module is under construction and will be integrated with the backend shortly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

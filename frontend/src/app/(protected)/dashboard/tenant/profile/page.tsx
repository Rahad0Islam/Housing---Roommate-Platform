"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useMyRoommateProfile } from "@/hooks/roommate.hook";

export default function Page() {
  const { data: response, isLoading, isError } = useMyRoommateProfile();
  const data = response?.data;

  const renderData = (data: any) => {
    if (!data) return null;
    
    if (Array.isArray(data)) {
      if (data.length === 0) return <p className="text-zinc-500">No records found.</p>;
      const keys = Object.keys(data[0]).filter(k => typeof data[0][k] !== 'object' || data[0][k] === null);
      return (
        <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-md">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                {keys.map(key => <th key={key} className="p-3 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {data.map((item, i) => (
                <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                  {keys.map(key => (
                    <td key={key} className="p-3 truncate max-w-[200px]">
                      {item[key] === null ? '-' : String(item[key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    
    // Object (e.g. profile or analytics summary)
    const keys = Object.keys(data).filter(k => typeof data[k] !== 'object' || data[k] === null);
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {keys.map(key => (
          <div key={key} className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
            <p className="mt-1 font-semibold text-zinc-900 dark:text-zinc-50 text-lg">
              {data[key] === null ? '-' : String(data[key])}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 capitalize">
          My Profile
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Manage your my profile.
        </p>
      </div>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
          ) : isError ? (
            <div className="bg-red-50 dark:bg-red-950/30 text-red-600 p-4 rounded-md">
              <p>Failed to load data from backend.</p>
            </div>
          ) : !data || (Array.isArray(data) && data.length === 0) ? (
            <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/20 rounded-md border border-dashed border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-500 dark:text-zinc-400">
                No data available at the moment.
              </p>
            </div>
          ) : (
            renderData(data)
          )}
        </CardContent>
      </Card>
    </div>
  );
}

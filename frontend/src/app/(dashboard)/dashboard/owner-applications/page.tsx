"use client";

import React from "react";
import { useGetAllOwnerApplications, useApproveOwnerApplication, useRejectOwnerApplication } from "@/hooks/owner.hook";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  FileTextIcon, 
  MoreHorizontalIcon, 
  CheckCircleIcon,
  XCircleIcon,
  DownloadIcon
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function OwnerApplicationsPage() {
  const { data: appsRes, isLoading } = useGetAllOwnerApplications();
  const applications = appsRes?.data || [];

  const { mutate: approve, isPending: isApproving } = useApproveOwnerApplication();
  const { mutate: reject, isPending: isRejecting } = useRejectOwnerApplication();

  const handleApprove = (id: string) => {
    if (confirm("Are you sure you want to approve this application? The user will become an OWNER.")) {
      approve(id);
    }
  };

  const handleReject = (id: string) => {
    if (confirm("Are you sure you want to reject this application?")) {
      reject(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "VERIFIED":
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-900 p-6 rounded-xl border gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Owner Applications</h2>
          <p className="text-muted-foreground">Review and manage requests from users who want to become property owners.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <FileTextIcon className="w-12 h-12 text-muted-foreground opacity-30 mb-4" />
              <h3 className="text-lg font-semibold">No applications found</h3>
              <p className="text-muted-foreground">There are currently no owner applications.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Document</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app: any) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div className="font-medium">{app.user?.name}</div>
                        <div className="text-sm text-muted-foreground">{app.user?.email}</div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(app.status)}
                      </TableCell>
                      <TableCell>
                        {app.verificationDocumentUrl ? (
                          <Link 
                            href={app.verificationDocumentUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <DownloadIcon className="h-4 w-4" />
                            View Document
                          </Link>
                        ) : (
                          <span className="text-sm text-muted-foreground">No Document</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(app.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {app.status === "PENDING" && (
                              <>
                                <DropdownMenuItem 
                                  className="text-green-600 focus:text-green-600"
                                  onClick={() => handleApprove(app.id)}
                                  disabled={isApproving || isRejecting}
                                >
                                  <CheckCircleIcon className="mr-2 h-4 w-4" /> Approve Application
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600 focus:text-red-600" 
                                  onClick={() => handleReject(app.id)}
                                  disabled={isApproving || isRejecting}
                                >
                                  <XCircleIcon className="mr-2 h-4 w-4" /> Reject Application
                                </DropdownMenuItem>
                              </>
                            )}
                            {app.status !== "PENDING" && (
                              <DropdownMenuItem disabled>
                                No actions available
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

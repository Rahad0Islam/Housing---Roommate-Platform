"use client";

import React, { useState } from "react";
import { useUsers, useBlockUser, useActivateUser } from "@/hooks/user.hook";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  UsersIcon,
  MoreHorizontalIcon,
  BanIcon,
  CheckCircleIcon,
  SearchIcon,
} from "lucide-react";
import { format } from "date-fns";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: usersRes, isLoading } = useUsers({ searchTerm, limit: 50 });
  const users = usersRes?.data || [];

  const { mutate: blockUser, isPending: isBlocking } = useBlockUser();
  const { mutate: activateUser, isPending: isActivating } = useActivateUser();

  const handleBlock = (userId: string) => {
    blockUser(userId);
  };

  const handleActivate = (userId: string) => {
    activateUser(userId);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge className="bg-purple-500">Admin</Badge>;
      case "OWNER":
        return <Badge className="bg-blue-500">Owner</Badge>;
      case "TENANT":
        return <Badge variant="outline">Tenant</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
        );
      case "BLOCKED":
        return <Badge variant="destructive">Blocked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="gradient-mesh motion-rise space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-primary/15 bg-primary/[0.06] p-6 md:flex-row md:items-center">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Platform directory
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight">
            User Management
          </h2>
          <p className="mt-2 text-muted-foreground">
            View and manage all registered users on the platform.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <UsersIcon className="w-12 h-12 text-muted-foreground opacity-30 mb-4" />
              <h3 className="text-lg font-semibold">No users found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search query.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User Details</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {user.profileImage ? (
                            <img
                              src={user.profileImage}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                              {user.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.userStatus)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(user.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {user.userStatus === "ACTIVE" ? (
                              <ConfirmationDialog
                                trigger={
                                  <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600"
                                    disabled={isBlocking || user.role === "ADMIN"}
                                  >
                                    <BanIcon className="mr-2 h-4 w-4" /> Block User
                                  </DropdownMenuItem>
                                }
                                title="Block this user?"
                                description="The user will no longer be able to access their account until activated again."
                                confirmLabel="Block user"
                                destructive
                                onConfirm={() => handleBlock(user.id)}
                              />
                            ) : (
                              <ConfirmationDialog
                                trigger={
                                  <DropdownMenuItem
                                    className="text-green-600 focus:text-green-600"
                                    disabled={isActivating || user.role === "ADMIN"}
                                  >
                                    <CheckCircleIcon className="mr-2 h-4 w-4" />{" "}
                                    Activate User
                                  </DropdownMenuItem>
                                }
                                title="Activate this user?"
                                description="This will restore the user's access to the platform."
                                confirmLabel="Activate user"
                                onConfirm={() => handleActivate(user.id)}
                              />
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

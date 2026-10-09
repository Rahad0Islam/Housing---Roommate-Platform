"use client";

import { useGetMe, useLogout } from "@/hooks/auth.hook";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Menu, UserCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function DashboardHeader() {
  const { data: user } = useGetMe();
  const { mutate: logout } = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 flex h-[4.5rem] w-full items-center justify-between border-b border-border/70 bg-background/80 px-4 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-4 md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl md:hidden"
              />
            }
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <Sidebar onNavigate={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Spacer for desktop */}
      <div className="hidden md:block"></div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 rounded-full p-1 outline-none transition-colors hover:bg-muted">
              <Avatar className="h-8 w-8">
                {user.data?.profileImage && (
                  <AvatarImage
                    src={user.data.profileImage}
                    alt={`${user.data.name || "User"} profile`}
                  />
                )}
                <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                  {user.data?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start text-sm mr-2">
                <span className="mb-1 font-medium leading-none">
                  {user.data?.name}
                </span>
                <span className="text-xs capitalize text-muted-foreground">
                  {user.data?.role.toLowerCase()}
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex flex-col space-y-1 p-2">
                <p className="font-medium">{user.data?.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.data?.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/dashboard/profile")}
              >
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={() =>
                  logout(undefined, {
                    onSuccess: () => (window.location.href = "/"),
                  })
                }
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </header>
  );
}

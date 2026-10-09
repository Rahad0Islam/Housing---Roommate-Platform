"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { Home, LogOut, Menu, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  const pathname = usePathname();
  const { data: user, isLoading } = useGetMe();
  const { mutate: logout } = useLogout();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about-us" },
    { name: "Find Buildings", href: "/buildings" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="page-container flex h-[4.5rem] items-center justify-between">
        <div className="flex items-center gap-8 lg:gap-12">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:-rotate-3">
              <Home className="h-5 w-5" />
            </span>
            <span className="font-heading text-lg font-bold tracking-tight">
              Roommate<span className="text-primary">Finder</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-2 text-sm font-medium transition-colors hover:text-foreground ${
                  isActive(item.href)
                    ? "text-foreground after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
            {!isLoading && user && (
              <Link
                href="/dashboard"
                className={`relative py-2 text-sm font-medium transition-colors hover:text-foreground ${
                  pathname.startsWith("/dashboard")
                    ? "text-foreground after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-primary"
                    : "text-muted-foreground"
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!isLoading && (
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="relative h-8 w-8 rounded-full flex items-center justify-center bg-transparent border-0 outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none cursor-pointer">
                    <Avatar className="h-8 w-8">
                      {user.data?.profileImage && (
                        <AvatarImage
                          src={user.data.profileImage}
                          alt={`${user.data.name || "User"} profile`}
                        />
                      )}
                      <AvatarFallback>
                        {user.data?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.data?.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.data?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => (window.location.href = "/dashboard")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
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
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="text-sm font-medium">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="rounded-full px-5 text-sm font-medium shadow-lg shadow-primary/20">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile Nav */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="md:hidden flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted bg-transparent border-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none cursor-pointer">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(88vw,24rem)] max-w-none gap-0 border-l border-border/70 bg-background/95 p-0 backdrop-blur-xl"
            >
              <div className="flex min-h-full flex-col px-5 pb-6 pt-20 sm:px-7">
                <div className="mb-6 border-b border-border/70 pb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Explore
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Find your next place to belong.
                  </p>
                </div>
              <nav className="flex flex-col gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex min-h-12 items-center rounded-xl px-4 text-base font-semibold transition-colors ${
                      isActive(item.href)
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                {!isLoading && user && (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className={`flex min-h-12 items-center rounded-xl px-4 text-base font-semibold transition-colors ${
                      pathname.startsWith("/dashboard")
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    Dashboard
                  </Link>
                )}
              </nav>
              <div className="mt-auto border-t border-border/70 pt-5">
                {!isLoading &&
                  (user ? (
                    <div className="flex flex-col gap-3">
                      <div className="mb-2 flex items-center gap-3 rounded-xl bg-muted/60 p-3">
                        <Avatar className="h-10 w-10">
                          {user.data?.profileImage && (
                            <AvatarImage
                              src={user.data.profileImage}
                              alt={`${user.data.name || "User"} profile`}
                            />
                          )}
                          <AvatarFallback>
                            {user.data?.name?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {user.data?.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user.data?.email}
                          </span>
                        </div>
                      </div>
                      <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                        <Button
                          variant="outline"
                          className="h-11 w-full justify-start"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        className="h-11 w-full justify-start"
                        onClick={() => {
                          setIsOpen(false);
                          logout(undefined, {
                            onSuccess: () => (window.location.href = "/"),
                          });
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="h-11 w-full">
                          Log in
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        <Button className="h-11 w-full shadow-lg shadow-primary/20">
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  ))}
              </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

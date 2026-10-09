import Link from "next/link";
import { Home } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-card/60">
      <div className="page-container py-14 md:py-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          <div className="flex flex-col gap-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Home className="h-5 w-5" />
              </span>
              <span className="font-heading text-lg font-bold tracking-tight">
                Roommate<span className="text-primary">Finder</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Connecting people with perfect rooms and compatible roommates to
              create comfortable living experiences.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Product
            </h3>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/about-us"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              About Us
            </Link>
            <Link
              href="/properties"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Browse Properties
            </Link>
            <Link
              href="/roommates"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Find Roommates
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Company
            </h3>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Contact
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Terms of Service
            </Link>
            <Link
              href="/faq"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              FAQ
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Connect
            </h3>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Facebook
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              LinkedIn
            </a>
          </div>
        </div>
        <div className="mt-12 border-t border-border/70 pt-8 text-center md:flex md:items-center md:justify-between md:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} RoommateFinder. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

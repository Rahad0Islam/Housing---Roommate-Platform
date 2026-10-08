import { ArrowUpRight, Building2 } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/">
          <span className="brand-mark">
            <Building2 size={19} />
          </span>
          <span>Havenly</span>
        </Link>
        <nav className="desktop-nav">
          <Link href="/properties">Find a home</Link>
          <Link href="/dashboard/tenant">My space</Link>
          <Link href="/dashboard/owner">For owners</Link>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <Link className="button button-quiet desktop-only" href="/login">
            Sign in
          </Link>
          <Link className="button button-primary" href="/register">
            Get started <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
}

import { Building2, Mail, MapPin } from "lucide-react";
import Link from "next/link";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link className="brand" href="/">
            <span className="brand-mark">
              <Building2 size={19} />
            </span>
            <span>Havenly</span>
          </Link>
          <p className="footer-copy">
            A calmer way to find, manage, and live in a place that feels like
            home.
          </p>
        </div>
        <div>
          <p className="footer-label">Explore</p>
          <Link href="/properties">Properties</Link>
          <Link href="/register">Create account</Link>
          <Link href="/login">Sign in</Link>
        </div>
        <div>
          <p className="footer-label">Platform</p>
          <Link href="/dashboard/tenant">Tenant workspace</Link>
          <Link href="/dashboard/owner">Owner workspace</Link>
          <Link href="/dashboard/admin">Admin workspace</Link>
        </div>
        <div>
          <p className="footer-label">Contact</p>
          <span>
            <MapPin size={15} /> Dhaka, Bangladesh
          </span>
          <span>
            <Mail size={15} /> hello@havenly.app
          </span>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Havenly</span>
        <span>Built for better living.</span>
      </div>
    </footer>
  );
}

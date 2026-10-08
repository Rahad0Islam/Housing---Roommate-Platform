import {
  ArrowRight,
  Check,
  Compass,
  Home as HomeIcon,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
export default function LandingPage() {
  return (
    <main>
      <section className="hero container">
        <div className="hero-copy">
          <p className="kicker">
            <Sparkles size={15} /> Better places, better living
          </p>
          <h1>
            Find the place that fits <em>your life.</em>
          </h1>
          <p className="hero-lede">
            Discover thoughtful homes, manage every detail, and build a life
            that feels a little more yours.
          </p>
          <div className="hero-actions">
            <Link
              className="button button-primary button-large"
              href="/properties"
            >
              Explore residences <ArrowRight size={17} />
            </Link>
            <Link
              className="button button-outline button-large"
              href="/register"
            >
              List your property
            </Link>
          </div>
        </div>
        <div className="hero-art">
          <div className="art-window">
            <div className="art-sun" />
            <div className="art-line line-one" />
            <div className="art-line line-two" />
            <div className="art-leaf leaf-one" />
            <div className="art-leaf leaf-two" />
          </div>
          <div className="floating-note">
            <span className="note-icon">
              <HomeIcon size={17} />
            </span>
            <div>
              <strong>Made for real life</strong>
              <span>Search with confidence</span>
            </div>
          </div>
        </div>
      </section>
      <section className="trust-band">
        <div className="container trust-grid">
          <span>One home, one clear view.</span>
          <div>
            <span>
              <ShieldCheck size={17} /> Verified listings
            </span>
            <span>
              <Compass size={17} /> Local-first discovery
            </span>
            <span>
              <Check size={17} /> Simple management
            </span>
          </div>
        </div>
      </section>
      <section className="container feature-section">
        <div className="section-heading">
          <p className="kicker">The Havenly difference</p>
          <h2>Space to settle in.</h2>
          <p>
            Everything you need to find a room, welcome a tenant, or keep your
            home running smoothly.
          </p>
        </div>
        <div className="feature-grid">
          <article>
            <span className="feature-number">01</span>
            <h3>Search like a local</h3>
            <p>
              Explore real residences with the details that matter, from
              location to availability.
            </p>
            <Link href="/properties" className="text-link">
              Browse homes <ArrowRight size={15} />
            </Link>
          </article>
          <article>
            <span className="feature-number">02</span>
            <h3>Keep life in sync</h3>
            <p>
              Bookings, rent, utilities, and updates live together in one calm
              workspace.
            </p>
            <Link href="/dashboard/tenant" className="text-link">
              Open your space <ArrowRight size={15} />
            </Link>
          </article>
          <article>
            <span className="feature-number">03</span>
            <h3>Run a better property</h3>
            <p>
              Give your buildings, rooms, and residents the attention they
              deserve.
            </p>
            <Link href="/dashboard/owner" className="text-link">
              For property owners <ArrowRight size={15} />
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}

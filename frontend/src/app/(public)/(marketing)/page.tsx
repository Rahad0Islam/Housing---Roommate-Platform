import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import {
  ArrowRight,
  Search,
  Users,
  Home as HomeIcon,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { FeaturedBuildings } from "@/components/home/FeaturedBuildings";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_color-mix(in_oklch,var(--primary)_18%,transparent),transparent_45%)]" />
        <div className="page-container grid min-h-[calc(100vh-4.5rem)] items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" /> A better way to find your next
              home
            </div>
            <h1 className="text-balance mb-6 font-heading text-5xl font-bold tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl">
              Find a place to <span className="text-primary">belong.</span>
            </h1>
            <p className="mb-10 max-w-xl text-lg leading-8 text-muted-foreground">
              The all-in-one platform for housing and roommates. Whether you're
              an owner looking to list a flat, or a tenant searching for the
              perfect room and compatible roommates, we've got you covered.
            </p>
            <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <Link
                href="/buildings"
                className={buttonVariants({
                  size: "lg",
                  className:
                    "w-full rounded-full shadow-xl shadow-primary/20 sm:w-auto",
                })}
              >
                Explore homes <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
              <Link
                href="/register"
                className={buttonVariants({
                  size: "lg",
                  variant: "outline",
                  className: "w-full rounded-full sm:w-auto",
                })}
              >
                Create an account
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> Secure payments
              </span>
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Roommate matching
              </span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-4 rounded-[2rem] bg-primary/15 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/30 bg-card p-2 shadow-2xl shadow-primary/10">
              <Image
                src="/login.png"
                alt="A welcoming home interior"
                width={900}
                height={1125}
                className="aspect-[4/5] w-full rounded-[1.5rem] object-cover"
                priority
              />
              <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-white/20 bg-background/85 p-4 shadow-xl backdrop-blur-xl">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Your next chapter
                </p>
                <p className="mt-1 font-heading text-lg font-semibold">
                  Search less. Live more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/35 px-4 py-24">
        <div className="page-container">
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              One platform, less friction
            </p>
            <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight md:text-4xl">
              Everything You Need
            </h2>
            <p className="max-w-xl text-muted-foreground">
              Our platform offers a complete suite of tools to manage your
              housing experience, from finding a place to splitting bills.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="surface flex flex-col items-start p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <h3 className="mb-3 font-heading text-lg font-semibold">
                  {feature.title}
                </h3>
                <p className="text-left text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedBuildings />

      {/* CTA Section */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-primary p-8 text-center text-primary-foreground shadow-2xl shadow-primary/20 md:p-16">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
            Make your move
          </p>
          <h2 className="mb-6 font-heading text-3xl font-bold md:text-4xl">
            Ready to find your next home?
          </h2>
          <p className="text-primary-foreground/80 mb-10 text-lg max-w-2xl mx-auto">
            Join thousands of users who have found their perfect living
            situation through our platform. Sign up today and start exploring.
          </p>
          <Link
            href="/register"
            className={buttonVariants({
              size: "lg",
              variant: "secondary",
              className: "rounded-full px-6",
            })}
          >
            Create an Account
          </Link>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: <Search className="w-6 h-6" />,
    title: "Smart Search",
    description:
      "Filter flats and rooms by location, price, amenities, and more to find your perfect match.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Roommate Matching",
    description:
      "Find compatible roommates based on lifestyle, habits, and preferences.",
  },
  {
    icon: <HomeIcon className="w-6 h-6" />,
    title: "Property Management",
    description:
      "Owners can easily list flats, manage bookings, and track monthly payments.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Secure Payments",
    description:
      "Handle utility bills and monthly rent payments securely within the platform.",
  },
];

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Search, Users, Home as HomeIcon, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          Find Your Perfect <br className="hidden md:block" /> Space & Roommate
        </h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          The all-in-one platform for housing and roommates. Whether you're an
          owner looking to list a flat, or a tenant searching for the perfect
          room and compatible roommates, we've got you covered.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
          <Link href="/register" className={buttonVariants({ size: "lg", className: "w-full sm:w-auto" })}>
            Get Started
          </Link>
          <Link href="/properties" className={buttonVariants({ size: "lg", variant: "outline", className: "w-full sm:w-auto" })}>
            Browse Properties
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our platform offers a complete suite of tools to manage your
              housing experience, from finding a place to splitting bills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-background rounded-2xl shadow-sm border"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl bg-primary text-primary-foreground rounded-3xl p-8 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to find your next home?
          </h2>
          <p className="text-primary-foreground/80 mb-10 text-lg max-w-2xl mx-auto">
            Join thousands of users who have found their perfect living
            situation through our platform. Sign up today and start exploring.
          </p>
          <Link href="/register" className={buttonVariants({ size: "lg", variant: "secondary" })}>
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

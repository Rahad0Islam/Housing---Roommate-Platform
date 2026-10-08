import React from "react";
import { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Housing & Roommate Platform",
  description:
    "Learn more about our mission to simplify housing and roommate finding.",
};

const AboutUsPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-muted/30 py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            About RoommateFinder
          </h1>
          <p className="text-xl text-muted-foreground">
            We're on a mission to make finding the perfect home and the right
            roommates as seamless and stress-free as possible.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Finding a place to live is hard enough, but finding the right
                  people to live with can be even harder. We started this
                  platform because we experienced these struggles firsthand.
                </p>
                <p>
                  Whether you're a property owner struggling to manage tenants
                  and collect payments, or a renter searching for an affordable
                  room with compatible flatmates, the traditional process is
                  broken.
                </p>
                <p>
                  That's why we built a comprehensive solution that handles
                  everything from listing properties and matching roommates, to
                  managing utility bills and monthly rent payments—all in one
                  secure platform.
                </p>
              </div>
            </div>
            <div className="bg-primary/5 rounded-3xl p-8 border">
              <h3 className="text-2xl font-semibold mb-6">What We Offer</h3>
              <ul className="space-y-4">
                {[
                  "Verified user profiles and secure authentication",
                  "Advanced roommate matching algorithms",
                  "Integrated property management for owners",
                  "Transparent utility bill splitting",
                  "Secure monthly rent payment tracking",
                  "Responsive support team",
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 text-primary mr-3 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;

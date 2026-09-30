"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, Users, Key, Building2, Wallet, ShieldCheck, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={stagger}
            className="text-center"
          >
            <motion.h1 
              variants={fadeInUp}
              className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-zinc-900 sm:text-7xl dark:text-zinc-50"
            >
              Find a place. Share a space. <span className="text-zinc-500">Live better.</span>
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400"
            >
              The all-in-one platform connecting tenants and property owners. Discover beautiful properties, find compatible roommates, and manage rent seamlessly.
            </motion.p>
            <motion.div 
              variants={fadeInUp}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Link href="/properties">
                <Button size="lg" className="rounded-full bg-zinc-900 px-8 py-6 text-base font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-xl shadow-zinc-200 dark:shadow-none">
                  Find Your Home <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-base font-semibold">
                  List Your Property
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Everything you need</h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Manage your living situation with confidence and ease.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900">
                  <feature.icon className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">{feature.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">For Tenants</h2>
              <p className="mt-4 mb-8 text-lg text-zinc-600 dark:text-zinc-400">A seamless journey to your next home.</p>
              <div className="space-y-8">
                {tenantSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{step.title}</h4>
                      <p className="mt-2 text-zinc-600 dark:text-zinc-400">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">For Owners</h2>
              <p className="mt-4 mb-8 text-lg text-zinc-600 dark:text-zinc-400">Manage your properties like a professional.</p>
              <div className="space-y-8">
                {ownerSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50 font-bold border border-zinc-200 dark:border-zinc-800">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{step.title}</h4>
                      <p className="mt-2 text-zinc-600 dark:text-zinc-400">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Ready to get started?</h2>
          <p className="mt-6 text-xl text-zinc-300 dark:text-zinc-600">Join thousands of users who have found their perfect space or managed their properties with ease.</p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="rounded-full bg-white px-8 py-6 text-base font-semibold text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800">
                Create an Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  { icon: Home, title: "Property Discovery", description: "Search and filter through a curated list of high-quality verified properties in your desired locations." },
  { icon: Key, title: "Room Booking", description: "Secure your room instantly with our streamlined digital booking and confirmation process." },
  { icon: Users, title: "Roommate Matching", description: "Find compatible roommates based on lifestyle, preferences, and mutual interests." },
  { icon: Building2, title: "Property Management", description: "Owners can easily add buildings, manage flats, and oversee room occupancy in real-time." },
  { icon: Wallet, title: "Secure Payments", description: "Pay rent and utilities safely through integrated digital payment gateways like bKash." },
  { icon: ShieldCheck, title: "Verified Users", description: "Every owner and property undergoes verification to ensure a secure ecosystem for everyone." },
];

const tenantSteps = [
  { title: "Search & Explore", desc: "Find the perfect flat or room using our advanced search filters." },
  { title: "Book a Space", desc: "Select your duration and confirm your booking digitally." },
  { title: "Pay Securely", desc: "Complete your payment online via trusted gateways." },
  { title: "Move In", desc: "Enjoy your new home and manage your rent from your dashboard." },
];

const ownerSteps = [
  { title: "Create Property", desc: "List your building, flats, rooms, and amenities." },
  { title: "Verify Profile", desc: "Get verified by our admins to build trust with tenants." },
  { title: "Manage Bookings", desc: "Approve or track room bookings in real-time." },
  { title: "Collect Rent", desc: "Automate monthly rent and utility bill collections securely." },
];

import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/providers";
import { Toaster } from "@/components/ui/toast";
import { Toaster as SonnerToaster } from "sonner";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RoommateFinder | Find a place to belong",
    template: "%s | RoommateFinder",
  },
  description:
    "Find a home, connect with compatible roommates, and manage your housing journey in one place.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <Providers>
        <body className="min-h-full flex flex-col">
          {children}

          <Toaster />
          <SonnerToaster position="top-right" richColors />
        </body>
      </Providers>
    </html>
  );
}

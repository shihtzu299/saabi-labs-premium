import "./globals.css";
import type { Metadata } from "next";
import ExperienceLayer from "@/components/ExperienceLayer";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  metadataBase: new URL("https://saabilabs.com"),
  title: {
    default: "Saabi Labs | Web3, AI and Premium Product Engineering",
    template: "%s | Saabi Labs",
  },
  description: "Premium Web3, AI, SaaS and automation engineering studio.",
  keywords: [
    "Saabi Labs",
    "Web3 development",
    "AI integrations",
    "smart contracts",
    "startup engineering",
  ],
  openGraph: {
    title: "Saabi Labs",
    description: "Premium Web3, AI, SaaS and automation engineering studio.",
    url: "https://saabilabs.com",
    siteName: "Saabi Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saabi Labs",
    description: "Premium Web3, AI, SaaS and automation engineering studio.",
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ExperienceLayer />
        <div className="relative z-10">
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}

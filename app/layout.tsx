import "./globals.css";
import type { Metadata } from "next";
import ExperienceLayer from "@/components/ExperienceLayer";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { siteName, siteUrl, socialImage } from "@/lib/site";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description:
    "Domani Consult builds business websites, full-stack applications and SaaS platforms, and delivers AI integrations and automation for businesses in Nigeria and internationally.",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Website Development & Software Company in Nigeria | Domani Consult",
    template: "%s | Domani Consult",
  },
  description: "Domani Consult builds business websites, full-stack applications and SaaS platforms, and delivers AI integrations and automation for businesses in Nigeria and internationally.",
  keywords: [
    "Domani Consult",
    "technology and digital solutions",
    "website development",
    "SaaS platforms",
    "business automation",
  ],
  openGraph: {
    title: "Website Development & Software Company in Nigeria | Domani Consult",
    description: "Domani Consult builds business websites, full-stack applications and SaaS platforms, and delivers AI integrations and automation for businesses in Nigeria and internationally.",
    url: siteUrl,
    siteName: "Domani Consult",
    type: "website",
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Development & Software Company in Nigeria | Domani Consult",
    description: "Domani Consult builds business websites, full-stack applications and SaaS platforms, and delivers AI integrations and automation for businesses in Nigeria and internationally.",
    images: [socialImage.url],
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
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
          }}
        />
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

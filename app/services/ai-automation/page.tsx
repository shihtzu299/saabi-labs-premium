import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";
import { getServicePage } from "@/data/servicePages";
import { siteName, socialImage, siteUrl } from "@/lib/site";

const service = getServicePage("ai-automation")!;
const canonical = `${siteUrl}/services/${service.slug}`;

export const metadata: Metadata = {
  title: service.metadataTitle,
  description: service.description,
  alternates: { canonical },
  openGraph: {
    title: `${service.metadataTitle} | ${siteName}`,
    description: service.description,
    url: canonical,
    siteName,
    type: "website",
    images: [socialImage]
  },
  twitter: {
    card: "summary_large_image",
    title: `${service.metadataTitle} | ${siteName}`,
    description: service.description,
    images: [socialImage.url]
  }
};

export default function AiAutomationPage() {
  return <ServicePage service={service} />;
}

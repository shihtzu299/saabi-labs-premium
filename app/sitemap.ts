import type { MetadataRoute } from "next";
import { getPosts, getProjects } from "@/lib/cms";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl;
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);

  return [
    {
      url: baseUrl
    },
    {
      url: `${baseUrl}/blog`
    },
    ...[
      "website-development",
      "software-saas",
      "ai-automation",
      "web3-smart-contracts"
    ].map((slug) => ({
      url: `${baseUrl}/services/${slug}`
    })),
    ...projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`
    })),
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
    }))
  ];
}

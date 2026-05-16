import type { MetadataRoute } from "next";
import { getPosts, getProjects } from "@/lib/cms";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://saabilabs.com";
  const now = new Date();
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);

  return [
    {
      url: baseUrl,
      lastModified: now
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now
    },
    ...projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: now
    })),
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date)
    }))
  ];
}

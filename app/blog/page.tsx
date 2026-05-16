import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPosts } from "@/lib/cms";

export const metadata = {
  title: "Blog",
  description: "Notes from Saabi Labs on product engineering, Web3 UX, AI systems, and startup execution."
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen px-6 pb-24 pt-32">
      <div className="mx-auto max-w-6xl">
        <p className="mb-5 uppercase tracking-[0.3em] text-blue-400">CMS Blog</p>
        <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">Field notes for ambitious product teams.</h1>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="glass group rounded-[30px] p-8 transition hover:border-blue-400/40">
              <div className="mb-8 flex items-center justify-between gap-4 text-sm text-gray-400">
                <span>{post.category}</span>
                <ArrowUpRight className="transition group-hover:translate-x-1 group-hover:-translate-y-1" size={20} />
              </div>
              <h2 className="text-2xl font-bold leading-tight">{post.title}</h2>
              <p className="mt-5 leading-7 text-gray-400">{post.excerpt}</p>
              <p className="mt-8 text-sm text-blue-300">{post.date} / {post.readTime}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

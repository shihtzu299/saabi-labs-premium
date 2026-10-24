import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPost } from "@/lib/cms";
import { socialImage } from "@/lib/site";

export const dynamic = "force-dynamic";

type BlogPostProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      type: "article",
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [socialImage.url],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen px-6 pb-24 pt-32">
      <article className="mx-auto max-w-3xl">
        <Link href="/blog" className="mb-10 inline-flex items-center gap-2 text-sm text-blue-300">
          <ArrowLeft size={16} />
          Back to blog
        </Link>

        <p className="mb-5 uppercase tracking-[0.3em] text-blue-400">{post.category}</p>
        <h1 className="text-5xl font-black leading-tight md:text-6xl">{post.title}</h1>
        <p className="mt-5 text-gray-400">{post.date} / {post.readTime}</p>

        <div className="mt-12 space-y-7 text-lg leading-9 text-gray-300">
          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
}

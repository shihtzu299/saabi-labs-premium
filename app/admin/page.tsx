import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AdminDashboard from "@/components/AdminDashboard";

import { adminCookieName, verifyAdminToken } from "@/lib/adminAuth";

import { getProjects, getPosts, getTestimonials } from "@/lib/cms";

export default async function AdminPage() {
  const cookieStore = await cookies();

  const token = cookieStore.get(adminCookieName)?.value;

  if (!token || !verifyAdminToken(token)) {
    redirect("/admin/login");
  }

  const [projects, posts, testimonials] = await Promise.all([
    getProjects(),
    getPosts(),
    getTestimonials(),
  ]);

  return (
    <main className="px-6 py-32">
      <AdminDashboard
        initialProjects={projects}
        initialPosts={posts}
        initialTestimonials={testimonials}
      />
    </main>
  );
}

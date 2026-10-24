import AdminLoginForm from "@/components/AdminLoginForm";

export const metadata = {
  title: "Admin Login",
  description: "Login to manage Domani Consult CMS content.",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-32">
      <AdminLoginForm />
    </main>
  );
}

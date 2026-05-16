"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";

export default function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    });
    const data = await response.json();

    setLoading(false);

    if (!response.ok) {
      setStatus(data.error || "Login failed.");
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <form onSubmit={login} className="glass w-full max-w-md rounded-[32px] p-8">
      <div className="mb-8 grid h-14 w-14 place-items-center rounded-full bg-blue-500/10 text-blue-300">
        <LockKeyhole size={24} />
      </div>
      <p className="mb-4 uppercase tracking-[0.3em] text-blue-400">Admin Login</p>
      <h1 className="mb-8 text-4xl font-black">CMS access</h1>
      <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-gray-400">Password</label>
      <input
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        type="password"
        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
        placeholder="Enter ADMIN_PASSWORD"
      />
      {status ? <p className="mt-4 text-sm text-red-300">{status}</p> : null}
      <button disabled={loading} className="mt-6 w-full rounded-full bg-blue-500 px-6 py-3 font-semibold text-white disabled:opacity-60">
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

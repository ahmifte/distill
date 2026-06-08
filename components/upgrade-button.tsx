"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

export function UpgradeButton({
  plan,
  label,
}: {
  plan: "pro" | "team";
  label: string;
}) {
  const { status } = useSession();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    if (status !== "authenticated") {
      void signIn();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Could not start checkout.");
        setLoading(false);
      }
    } catch {
      alert("Could not start checkout.");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg hover:opacity-90 disabled:opacity-60"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {label}
    </button>
  );
}

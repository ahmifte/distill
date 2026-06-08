"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export function Summarizer({
  used,
  limit,
}: {
  used: number;
  limit: number;
}) {
  const [remaining, setRemaining] = useState(Math.max(0, limit - used));
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSummary("");
    setLoading(true);

    const form = event.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const text = (form.elements.namedItem("text") as HTMLTextAreaElement).value;

    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, text }),
      });
      const data = (await res.json()) as {
        summary?: string;
        used?: number;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setSummary(data.summary ?? "");
      if (typeof data.used === "number") {
        setRemaining(Math.max(0, limit - data.used));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-default bg-card p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">Summarize a document</h2>
        <span className="text-sm text-muted">{remaining} left this month</span>
      </div>
      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <input
          name="title"
          placeholder="Title (optional)"
          className="w-full rounded-md border border-default bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
        />
        <textarea
          name="text"
          required
          rows={8}
          placeholder="Paste the text you want summarized…"
          className="w-full rounded-md border border-default bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg hover:opacity-90 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? "Summarizing…" : "Summarize"}
        </button>
        {error ? (
          <p role="alert" className="text-sm text-red-500">
            {error}
          </p>
        ) : null}
      </form>

      {summary ? (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-muted">Summary</h3>
          <pre className="mt-2 whitespace-pre-wrap rounded-md border border-default p-4 text-sm leading-relaxed">
            {summary}
          </pre>
        </div>
      ) : null}
    </div>
  );
}

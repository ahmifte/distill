import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <header className="border-b border-default">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Sparkles className="h-5 w-5 text-accent" />
          distill
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/pricing" className="text-muted hover:text-[hsl(var(--foreground))]">
            Pricing
          </Link>
          <Link
            href="/dashboard"
            className="rounded-md bg-accent px-3 py-2 font-medium text-accent-fg hover:opacity-90"
          >
            Dashboard
          </Link>
        </div>
      </nav>
    </header>
  );
}

import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function PorchLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="px-5 pt-8 pb-4 text-center">
        <Link to="/" className="inline-block">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Porch <span className="text-muted-foreground">—</span> Grandma&apos;s Wisdom
          </h1>
        </Link>
        <p className="mt-1 text-base text-muted-foreground italic">Not therapy. Just a porch.</p>
        <nav className="mt-4 flex justify-center gap-2 text-base">
          <Link
            to="/"
            className="rounded-full border border-border px-4 py-1.5"
            activeProps={{ className: "bg-primary text-primary-foreground border-primary" }}
            activeOptions={{ exact: true }}
          >
            The Porch
          </Link>
          <Link
            to="/history"
            className="rounded-full border border-border px-4 py-1.5"
            activeProps={{ className: "bg-primary text-primary-foreground border-primary" }}
          >
            My Porch Weeks
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-xl flex-1 px-5 pb-10">{children}</main>

      <footer className="border-t border-border px-5 py-6 text-center text-sm text-muted-foreground">
        Not medical advice. For wellness and reflection only. Crisis? Call/text 988.
      </footer>
    </div>
  );
}

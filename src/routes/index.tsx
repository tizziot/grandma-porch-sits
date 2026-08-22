import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { PorchLayout } from "@/components/PorchLayout";
import { getDeviceId } from "@/lib/device";
import { createEntry } from "@/lib/porch.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Porch — Grandma's Wisdom | Not therapy. Just a porch." },
      {
        name: "description",
        content:
          "Write what's on your heart and sit with Grandma Rose for a warm, gentle reflection. Wellness reflection only, never medical advice.",
      },
      { property: "og:title", content: "Porch — Grandma's Wisdom" },
      {
        property: "og:description",
        content: "Write what's on your heart and sit with Grandma Rose. Not therapy. Just a porch.",
      },
    ],
  }),
  component: PorchHome,
});

function PorchHome() {
  const navigate = useNavigate();
  const submit = useServerFn(createEntry);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSit() {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Write a little something first, honey.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const entry = await submit({
        data: { deviceId: getDeviceId(), text: trimmed.slice(0, 2000) },
      });
      setText("");
      navigate({ to: "/sit/$entryId", params: { entryId: entry.id } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went sideways. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PorchLayout>
      <h2 className="mt-2 text-center text-2xl font-semibold">
        What&apos;s on your porch today, honey?
      </h2>

      <div className="porch-card mt-5 p-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={2000}
          rows={8}
          placeholder="Write what's on your heart... I'm listening."
          className="w-full resize-none bg-transparent text-lg leading-relaxed outline-none placeholder:text-muted-foreground"
        />
      </div>

      {error ? <p className="mt-3 text-center text-base text-destructive">{error}</p> : null}

      <button
        onClick={onSit}
        disabled={busy}
        className="mt-5 w-full rounded-2xl bg-primary px-6 py-4 text-lg font-semibold text-primary-foreground shadow-porch transition-transform active:scale-[0.98] disabled:opacity-70"
      >
        {busy ? "Grandma's pouring the tea…" : "Sit with Grandma"}
      </button>

      <p className="mt-3 text-center text-sm text-muted-foreground">
        Porch is not therapy or medical advice. Wellness reflection only. If in crisis call/text 988.
      </p>

      <div className="porch-card mt-8 p-5 text-center">
        <p className="text-base">Sit as long as you like, any day of the week.</p>
        <button
          onClick={() => alert("Checkout coming soon — Stripe placeholder.")}
          className="mt-3 w-full rounded-2xl border-2 border-primary px-5 py-3 text-base font-semibold"
        >
          Upgrade to Unlimited Porch Sits — $7.99/mo
        </button>
      </div>
    </PorchLayout>
  );
}

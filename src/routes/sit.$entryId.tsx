import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { PorchLayout } from "@/components/PorchLayout";
import { getDeviceId, WEATHER, type WeatherKey } from "@/lib/device";
import { getEntry, setWeather } from "@/lib/porch.functions";

export const Route = createFileRoute("/sit/$entryId")({
  head: () => ({
    meta: [
      { title: "Sitting with Grandma | Porch — Grandma's Wisdom" },
      {
        name: "description",
        content: "Grandma Rose's warm reflection on what you shared, plus a gentle porch check-in.",
      },
      { property: "og:title", content: "Sitting with Grandma | Porch" },
      {
        property: "og:description",
        content: "A warm reflection from Grandma Rose on what's on your porch today.",
      },
    ],
  }),
  component: SitPage,
});

function SitPage() {
  const { entryId } = Route.useParams();
  const fetchEntry = useServerFn(getEntry);
  const saveWeather = useServerFn(setWeather);
  const [deviceId, setDeviceId] = useState("");
  const [picked, setPicked] = useState<WeatherKey | null>(null);
  const [tip, setTip] = useState<string | null>(null);

  useEffect(() => setDeviceId(getDeviceId()), []);

  const { data, isLoading } = useQuery({
    queryKey: ["entry", entryId, deviceId],
    enabled: Boolean(deviceId),
    queryFn: () => fetchEntry({ data: { deviceId, id: entryId } }),
  });

  useEffect(() => {
    if (data?.weather) setPicked(data.weather as WeatherKey);
  }, [data?.weather]);

  async function pick(key: WeatherKey) {
    setPicked(key);
    if (!deviceId) return;
    await saveWeather({ data: { deviceId, id: entryId, weather: key } });
  }

  return (
    <PorchLayout>
      {isLoading || !deviceId ? (
        <p className="mt-8 text-center text-muted-foreground">Rocking chair creaking…</p>
      ) : !data ? (
        <div className="mt-8 text-center">
          <p>That porch note isn&apos;t here, sweetheart.</p>
          <Link to="/" className="mt-4 inline-block font-semibold underline">
            Back to the porch
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-4 rounded-2xl border border-border bg-muted/60 p-4 opacity-70">
            <p className="text-sm tracking-wide uppercase">What you brought</p>
            <p className="mt-2 whitespace-pre-wrap">{data.text}</p>
          </div>

          {data.grandma_response.startsWith("Thank you for trusting me") ? (
            <div className="porch-card mt-5 border-2 border-primary p-5">
              <p className="font-display text-lg font-semibold">A gentle word</p>
              <p className="mt-2 whitespace-pre-wrap text-lg leading-relaxed">
                {data.grandma_response}
              </p>
              <a
                href="tel:988"
                className="mt-4 block rounded-2xl bg-primary px-4 py-3 text-center font-semibold text-primary-foreground"
              >
                Call or text 988
              </a>
            </div>
          ) : (
            <>
              <div className="porch-card mt-5 p-5">
                <p className="text-2xl" aria-hidden="true">
                  🌼
                </p>
                <p className="mt-2 font-display text-lg font-semibold">Grandma Rose says</p>
                <p className="mt-2 whitespace-pre-wrap text-lg leading-relaxed">
                  {data.grandma_response}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <button
                  onClick={() =>
                    setTip("Breathe in for 4, hold for 4, out for 6. Three slow rounds.")
                  }
                  className="rounded-2xl border border-border bg-card px-2 py-3 text-sm font-semibold"
                >
                  Breathe with me
                </button>
                <button
                  onClick={() =>
                    setTip("Two minutes outside. Just to the end of the block and back.")
                  }
                  className="rounded-2xl border border-border bg-card px-2 py-3 text-sm font-semibold"
                >
                  Walk it off
                </button>
                <Link
                  to="/"
                  className="rounded-2xl border border-border bg-card px-2 py-3 text-center text-sm font-semibold"
                >
                  Write more
                </Link>
              </div>
            </>
          )}


          {tip ? (
            <p className="mt-3 rounded-2xl bg-accent/50 p-3 text-center text-base">{tip}</p>
          ) : null}

          <div className="porch-card mt-8 p-5 text-center">
            <p className="font-display text-lg font-semibold">How&apos;s your porch now?</p>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {WEATHER.map((w) => (
                <button
                  key={w.key}
                  onClick={() => pick(w.key)}
                  aria-label={w.label}
                  className={`rounded-2xl border px-2 py-3 ${
                    picked === w.key ? "border-primary bg-primary/30" : "border-border"
                  }`}
                >
                  <span className="text-2xl">{w.emoji}</span>
                  <span className="mt-1 block text-xs">{w.label}</span>
                </button>
              ))}
            </div>
            {picked ? (
              <p className="mt-3 text-sm text-muted-foreground">Saved to your porch weeks.</p>
            ) : null}
          </div>
        </>
      )}
    </PorchLayout>
  );
}

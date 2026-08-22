import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { PorchLayout } from "@/components/PorchLayout";
import { getDeviceId, weatherEmoji } from "@/lib/device";
import { listEntries } from "@/lib/porch.functions";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "My Porch Weeks | Porch — Grandma's Wisdom" },
      {
        name: "description",
        content: "Look back at the days you sat on the porch, with the weather you felt each time.",
      },
      { property: "og:title", content: "My Porch Weeks | Porch" },
      {
        property: "og:description",
        content: "A gentle record of your porch sits and how each day felt.",
      },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const fetchList = useServerFn(listEntries);
  const [deviceId, setDeviceId] = useState("");
  useEffect(() => setDeviceId(getDeviceId()), []);

  const { data, isLoading } = useQuery({
    queryKey: ["entries", deviceId],
    enabled: Boolean(deviceId),
    queryFn: () => fetchList({ data: { deviceId } }),
  });

  return (
    <PorchLayout>
      <h2 className="mt-2 text-center text-2xl font-semibold">My Porch Weeks</h2>

      {isLoading || !deviceId ? (
        <p className="mt-8 text-center text-muted-foreground">Looking through the screen door…</p>
      ) : !data || data.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">No porch sits yet, honey.</p>
          <Link to="/" className="mt-4 inline-block font-semibold underline">
            Come sit a while
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {data.map((entry) => (
            <li key={entry.id}>
              <Link
                to="/sit/$entryId"
                params={{ entryId: entry.id }}
                className="porch-card flex items-start gap-3 p-4"
              >
                <span className="text-2xl" aria-hidden="true">
                  {weatherEmoji(entry.weather)}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm text-muted-foreground">
                    {new Date(entry.created_at).toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="mt-1 line-clamp-2 block">{entry.text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PorchLayout>
  );
}

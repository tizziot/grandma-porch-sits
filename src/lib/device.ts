const KEY = "porch-device-id";

export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(KEY, id);
  }
  return id;
}

export const WEATHER = [
  { key: "sunny", emoji: "☀️", label: "Sunny" },
  { key: "cloudy", emoji: "☁️", label: "Cloudy" },
  { key: "rainy", emoji: "🌧️", label: "Rainy" },
  { key: "stormy", emoji: "⛈️", label: "Stormy" },
] as const;

export type WeatherKey = (typeof WEATHER)[number]["key"];

export function weatherEmoji(key: string | null): string {
  return WEATHER.find((w) => w.key === key)?.emoji ?? "🌾";
}

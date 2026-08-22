import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { askGrandma, isCrisis, CRISIS_RESPONSE } from "./porch.server";

export const createEntry = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        deviceId: z.string().uuid(),
        text: z.string().trim().min(1, "Write a little something first.").max(2000),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const crisis = isCrisis(data.text);
    const response = crisis ? CRISIS_RESPONSE : await askGrandma(data.text);

    const { data: row, error } = await supabaseAdmin
      .from("entries")
      .insert({ device_id: data.deviceId, text: data.text, grandma_response: response })
      .select("id, text, grandma_response, weather, created_at")
      .single();

    if (error) throw new Error("Couldn't save your porch note.");
    return { ...row, crisis };
  });

export const getEntry = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z.object({ deviceId: z.string().uuid(), id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("entries")
      .select("id, text, grandma_response, weather, created_at")
      .eq("id", data.id)
      .eq("device_id", data.deviceId)
      .maybeSingle();
    if (error) throw new Error("Couldn't open that porch note.");
    return row;
  });

export const listEntries = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ deviceId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("entries")
      .select("id, text, grandma_response, weather, created_at")
      .eq("device_id", data.deviceId)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error("Couldn't open your porch weeks.");
    return rows ?? [];
  });

export const setWeather = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        deviceId: z.string().uuid(),
        id: z.string().uuid(),
        weather: z.enum(["sunny", "cloudy", "rainy", "stormy"]),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("entries")
      .update({ weather: data.weather })
      .eq("id", data.id)
      .eq("device_id", data.deviceId);
    if (error) throw new Error("Couldn't save your porch weather.");
    return { ok: true };
  });

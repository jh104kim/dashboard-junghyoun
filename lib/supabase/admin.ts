import { createClient } from "@supabase/supabase-js";
import type { WebSocketLikeConstructor } from "@supabase/realtime-js";
import WebSocket from "ws";
import { getSupabaseAdminEnv } from "@/lib/env";

export function createAdminClient() {
  const { url, serviceRoleKey } = getSupabaseAdminEnv();

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    realtime: {
      transport: WebSocket as unknown as WebSocketLikeConstructor,
    },
  });
}

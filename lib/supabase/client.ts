import { createBrowserClient } from "@supabase/ssr";

import { getPublicSupabaseConfig } from "./config";
import type { Database } from "./database.types";

export function createSupabaseBrowserClient() {
  const { supabaseUrl, supabasePublishableKey } = getPublicSupabaseConfig();

  return createBrowserClient<Database>(supabaseUrl, supabasePublishableKey);
}


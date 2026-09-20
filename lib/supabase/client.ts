import { createBrowserClient } from "@supabase/ssr";

import { getPublicSupabaseConfig } from "./config";

export function createSupabaseBrowserClient() {
  const { supabaseUrl, supabasePublishableKey } = getPublicSupabaseConfig();

  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const FALLBACK_PROJECT_ID = "hzkkcyyunhwrecvpsaam";
const FALLBACK_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6a2tjeXl1bmh3cmVjdnBzYWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTA4MjksImV4cCI6MjA4ODk2NjgyOX0.nK_sAb3pzENT6VYyWILzdSy8n1JD4k2wvX_myZTiVZo";

const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || FALLBACK_PROJECT_ID;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || `https://${projectId}.supabase.co`;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || FALLBACK_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});

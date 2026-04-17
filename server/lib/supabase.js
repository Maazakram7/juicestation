import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

/**
 * Server-side Supabase client.
 * Uses the SERVICE ROLE key — never expose this to the browser.
 * RLS is bypassed for this client, so validate all input server-side.
 */
const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

if (!url || !serviceKey) {
  console.warn(
    '[supabase] Missing SUPABASE_URL or SUPABASE_SERVICE_KEY — orders will fail until .env is set.'
  );
}

export const supabase = createClient(url || 'https://placeholder.supabase.co', serviceKey || 'placeholder', {
  auth: { persistSession: false },
});

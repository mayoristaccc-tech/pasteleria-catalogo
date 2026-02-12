import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://amqfvzcltdyradkuxkjw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtcWZ2emNsdGR5cmFka3V4a2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MTUzNDQsImV4cCI6MjA4NTk5MTM0NH0.XBua4Gb6LSiAP575Rk-7lbcPvTxBquHY7CPVJ85oEP0TU_ANON_KEY_AQUI";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

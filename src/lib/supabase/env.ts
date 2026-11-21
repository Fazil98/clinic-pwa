const CLINIC_URL = "https://upoyjxtuizqbplylpzib.supabase.co";
const CLINIC_KEY = "sb_publishable_lvNqZsfWtvyg37wMs7W_0w_5VTxcEUB";

/** Publishable clinic address. Env overrides it; the fallback keeps the online build connected. */
export function supabasePublicEnv(): { url: string; key: string } {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || CLINIC_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || CLINIC_KEY,
  };
}

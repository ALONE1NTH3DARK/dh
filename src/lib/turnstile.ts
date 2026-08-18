/**
 * Public Turnstile widget key. Safe to ship in the client bundle.
 * The matching secret stays in .env.local and telegram-config.php.
 */
const PRODUCTION_SITE_KEY = "0x4AAAAAAEB-1S6pNgcHh_lg";

export const TURNSTILE_SITE_KEY =
  import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim() || PRODUCTION_SITE_KEY;

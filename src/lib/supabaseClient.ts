// src/lib/supabaseClient.ts

import { createClient } from "@supabase/supabase-js";

// ------------------------------------------------------------
// ⭐ Validación estricta de variables de entorno
// ------------------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl === "undefined" ||
  supabaseAnonKey === "undefined" ||
  supabaseUrl === "null" ||
  supabaseAnonKey === "null"
) {
  throw new Error(
    "❌ Supabase environment variables are missing or invalid. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
}

// ------------------------------------------------------------
// ⭐ Crear cliente Supabase (modo frontend con sesión persistente)
// ------------------------------------------------------------
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,        // ← NECESARIO para login
    autoRefreshToken: true,      // ← refresca tokens automáticamente
    detectSessionInUrl: true,    // ← necesario para magic links / OAuth
  },
});

// ------------------------------------------------------------
// (Opcional) Log controlado solo en desarrollo
// ------------------------------------------------------------
if (process.env.NODE_ENV === "development") {
  console.log("🔌 Supabase client initialized");
}

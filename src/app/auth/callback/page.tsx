// src/app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function AuthCallback() {
  useEffect(() => {
    const handleAuth = async () => {
      // Esperar un momento para que Supabase procese el token
      setTimeout(async () => {
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData?.session) {
          // Verificar si ya tiene organización
          const { data: orgData } = await supabase
            .from("organizations")
            .select("id")
            .eq("created_by", sessionData.session.user.id)
            .maybeSingle();

          if (orgData) {
            // Ya tiene organización → dashboard
            window.location.href = "/dashboard";
          } else {
            // No tiene organización → setup
            window.location.href = "/setup-organization";
          }
        } else {
          // No hay sesión → login
          window.location.href = "/login";
        }
      }, 500);
    };

    handleAuth();
  }, []);

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center",
      backgroundColor: "#f8fafc"
    }}>
      <div style={{ 
        padding: "2rem", 
        backgroundColor: "white", 
        borderRadius: "16px", 
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        textAlign: "center"
      }}>
        <h2>Configurando tu cuenta...</h2>
        <p style={{ color: "#64748b", marginTop: "1rem" }}>
          Por favor, espera un momento.
        </p>
      </div>
    </div>
  );
}
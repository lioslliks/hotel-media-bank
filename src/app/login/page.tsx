// src/app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expectedRole, setExpectedRole] = useState<"hotel" | "agency" | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("loginRole");
    if (role === "hotel" || role === "agency") {
      setExpectedRole(role);
    } else {
      // Si no hay rol, redirigir a inicio
      window.location.href = "/";
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: sessionData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!sessionData?.session) throw new Error("Sesión no disponible");

      // Verificar organización
      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .select("role")
        .eq("created_by", sessionData.session.user.id)
        .maybeSingle();

      if (orgError) throw orgError;

      if (!orgData) {
        // ❌ No tiene organización → ir a setup
        window.location.href = "/setup-organization";
        return;
      }

      if (orgData.role !== expectedRole) {
        // ❌ Rol incorrecto
        await supabase.auth.signOut();
        throw new Error(
          `Esta cuenta es de ${orgData.role === "hotel" ? "hotel" : "agencia"}. 
           Por favor, usa el botón correcto en la página principal.`
        );
      }

      // ✅ Todo bien → ir al dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login error:", err);
      setError("Error: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (expectedRole === null) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: "#f8fafc"
      }}>
        <div>Redirigiendo...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "2rem",
      backgroundColor: "#f9fafb"
    }}>
      <h2 style={{ marginBottom: "2rem", fontSize: "24px" }}>
        Iniciar sesión como {expectedRole === "hotel" ? "hotel" : "agencia"}
      </h2>
      
      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ 
        width: "100%", 
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          required
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "16px"
          }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "16px"
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: expectedRole === "hotel" ? "#3b82f6" : "#10b981",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Iniciando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}
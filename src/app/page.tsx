// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData?.session) {
          const { data: orgData } = await supabase
            .from("organizations")
            .select("id")
            .eq("created_by", sessionData.session.user.id)
            .maybeSingle();

          if (orgData) {
            window.location.href = "/dashboard";
          } else {
            window.location.href = "/setup-organization";
          }
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) {
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
          <h2>Verificando tu cuenta...</h2>
          <div style={{
            width: "40px",
            height: "40px",
            margin: "1rem auto",
            border: "3px solid #3b82f6",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
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
      <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "2rem" }}>
        Hotel Media Bank
      </h1>

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={() => {
            localStorage.setItem("loginRole", "hotel");
            window.location.href = "/login";
          }}
          style={{
            padding: "1.5rem 2rem",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "16px",
            fontSize: "1.25rem",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
          }}
        >
          🏨 Soy un hotel
        </button>

        <button
          onClick={() => {
            localStorage.setItem("loginRole", "agency");
            window.location.href = "/login";
          }}
          style={{
            padding: "1.5rem 2rem",
            backgroundColor: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "16px",
            fontSize: "1.25rem",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
          }}
        >
          💼 Soy una agencia
        </button>
      </div>

      <p style={{ marginTop: "3rem", color: "#64748b" }}>
        ¿Eres nuevo?{" "}
        <a href="/register" style={{ color: "#ef4444", fontWeight: "600" }}>
          Regístrate aquí
        </a>
      </p>
    </div>
  );
}
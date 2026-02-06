// src/app/login/page.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!data?.session) throw new Error("Sesión no disponible");

      // Verificar organización
      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .select("role")
        .eq("created_by", data.session.user.id)
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
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="p-8 bg-white rounded-xl shadow-sm text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-base">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">
            Iniciar sesión
          </h2>
          <p className="text-lg font-semibold text-gray-700 mb-1">
            como {expectedRole === "hotel" ? "hotel" : "agencia"}
          </p>
          <p className="text-gray-500 text-sm">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm text-left">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input */}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              required
              className={`w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
                expectedRole === "hotel"
                  ? "focus:ring-blue-500 focus:border-blue-500"
                  : "focus:ring-emerald-500 focus:border-emerald-500"
              }`}
            />
          </div>

          {/* Password input */}
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              className={`w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
                expectedRole === "hotel"
                  ? "focus:ring-blue-500 focus:border-blue-500"
                  : "focus:ring-emerald-500 focus:border-emerald-500"
              }`}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
              loading
                ? "opacity-75 cursor-not-allowed"
                : expectedRole === "hotel"
                ? "bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
                : "bg-emerald-500 hover:bg-emerald-600 focus:ring-4 focus:ring-emerald-300 focus:ring-offset-2"
            }`}
          >
            {loading ? "Iniciando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
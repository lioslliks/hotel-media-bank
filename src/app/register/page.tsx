// src/app/register/page.tsx
"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!validatePasswords()) return;

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setFormError(error.message);
        return;
      }

      const savedRole = localStorage.getItem("userRole");
      if (savedRole) {
        sessionStorage.setItem("userRole", savedRole);
      }

      alert("Registro exitoso. Revisa tu email para confirmar.");
    } catch (err) {
      setFormError("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
        
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          Crear cuenta
        </h2>

        <p className="text-slate-500 mb-6">
          Regístrate para comenzar
        </p>

        {formError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-slate-800 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (confirmPassword && e.target.value !== confirmPassword) {
                  setPasswordError("Las contraseñas no coinciden");
                } else {
                  setPasswordError("");
                }
              }}
              placeholder="Contraseña (mínimo 6 caracteres)"
              required
              className={`w-full px-4 py-3 rounded-lg border ${
                passwordError ? "border-red-500" : "border-gray-300"
              } bg-gray-50 text-slate-800 focus:outline-none focus:border-blue-500 transition`}
            />
          </div>

          <div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (password && password !== e.target.value) {
                  setPasswordError("Las contraseñas no coinciden");
                } else {
                  setPasswordError("");
                }
              }}
              placeholder="Confirmar contraseña"
              required
              className={`w-full px-4 py-3 rounded-lg border ${
                passwordError ? "border-red-500" : "border-gray-300"
              } bg-gray-50 text-slate-800 focus:outline-none focus:border-blue-500 transition`}
            />
          </div>

          {passwordError && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
              {passwordError}
            </div>
          )}

          <button
            type="submit"
            disabled={
              loading ||
              !!passwordError ||
              password !== confirmPassword ||
              password.length < 6
            }
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              password === confirmPassword && password.length >= 6
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-6 text-slate-500 text-sm">
          ¿Ya tienes cuenta?{" "}
          <a
            href="/"
            className="text-blue-600 font-semibold hover:underline"
          >
            Inicia sesión
          </a>
        </p>
      </div>

      {/* Animación global */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease forwards;
        }
      `}</style>
    </div>
  );
}

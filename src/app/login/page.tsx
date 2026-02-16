// src/app/login/page.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import { supabase } from "../../lib/supabaseClient";

// shadcn/ui
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expectedRole, setExpectedRole] = useState<"hotel" | "agency" | null>(
    null
  );

  useEffect(() => {
    const role = localStorage.getItem("loginRole");
    if (role === "hotel" || role === "agency") {
      setExpectedRole(role);
    } else {
      window.location.href = "/";
    }
  }, []);

  // 🔹 Traducción de errores de Supabase
  const translateError = (message: string) => {
    if (message.includes("Invalid login credentials")) {
      return "Credenciales incorrectas. Verifica tu correo y contraseña.";
    }

    if (message.includes("Email not confirmed")) {
      return "Debes confirmar tu correo electrónico antes de iniciar sesión.";
    }

    if (message.includes("User not found")) {
      return "No existe una cuenta con este correo electrónico.";
    }

    return "No se pudo iniciar sesión. Inténtalo de nuevo.";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw authError;
      if (!data?.session) throw new Error("Sesión no disponible");

      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .select("role")
        .eq("created_by", data.session.user.id)
        .maybeSingle();

      if (orgError) throw orgError;

      if (!orgData) {
        window.location.href = "/setup-organization";
        return;
      }

      if (orgData.role !== expectedRole) {
        await supabase.auth.signOut();
        throw new Error(
          `Esta cuenta es de ${
            orgData.role === "hotel" ? "hotel" : "agencia"
          }. Usa el botón correcto en la página principal.`
        );
      }

      window.location.href = "/dashboard";
    } catch (err) {
      const rawMessage = (err as Error).message;
      setError(translateError(rawMessage));
    } finally {
      setLoading(false);
    }
  };

  if (expectedRole === null) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Card className="p-8 shadow-md bg-white">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-base text-center">
            Redirigiendo...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-white to-gray-100">
      <Card className="w-full max-w-md shadow-xl border border-gray-200 bg-white/80 backdrop-blur-xl rounded-2xl">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold text-gray-900 tracking-tight">
            Iniciar sesión
          </CardTitle>

          <CardDescription className="text-gray-600 text-base mt-1">
            Accede como {expectedRole === "hotel" ? "hotel" : "agencia"}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* EMAIL */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus-visible:ring-gray-400"
              />
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 text-base bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus-visible:ring-gray-400"
              />
            </div>

            {/* SUBMIT */}
            <Button
              type="submit"
              disabled={loading}
              className={`w-full h-12 text-base font-semibold rounded-xl shadow-md transition-all ${
                expectedRole === "hotel"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {loading ? "Iniciando..." : "Iniciar sesión"}
            </Button>
          </form>

          <p className="mt-6 text-gray-600 text-sm text-center">
            ¿No tienes cuenta?{" "}
            <a
              href="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Regístrate aquí
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

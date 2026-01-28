"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Iniciar sesión
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      alert("Error: " + authError.message);
      setLoading(false);
      return;
    }

    // Obtener la sesión actual
    const {  data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;

    if (!userId) {
      alert("No se pudo obtener el usuario");
      setLoading(false);
      return;
    }

    // Verificar si ya tiene organización
    const {  data: orgData } = await supabase
      .from("organizations")
      .select("id")
      .eq("created_by", userId)
      .maybeSingle();

    setLoading(false);

    if (orgData) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/setup-organization";
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Iniciando..." : "Entrar"}
        </button>
        <p style={{ marginTop: "1rem" }}>
          ¿No tienes cuenta? <a href="/register">Regístrate</a>
        </p>
      </form>
    </div>
  );
}
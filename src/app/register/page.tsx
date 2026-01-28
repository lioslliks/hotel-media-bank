"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert("Error: " + error.message);
    else {
      alert("Registro exitoso. Revisa tu email para confirmar.");
      window.location.href = "/login";
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Registrar</h1>
      <form onSubmit={handleRegister}>
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
          placeholder="Contraseña (mín. 6)"
          required
          minLength={6}
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
        />
        <button type="submit">Crear cuenta</button>
        <p style={{ marginTop: "1rem" }}>
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
        </p>
      </form>
    </div>
  );
}
// src/app/register/page.tsx
"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validar que las contraseñas coincidan
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
    
    if (!validatePasswords()) {
      return;
    }

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
        alert("Error: " + error.message);
        return;
      }

      // Guardar rol para usar en setup-organization
      const savedRole = localStorage.getItem("userRole");
      if (savedRole) {
        sessionStorage.setItem("userRole", savedRole);
      }

      alert("Registro exitoso. Revisa tu email para confirmar.");
    } catch (err) {
      alert("Error inesperado: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Validación en tiempo real al escribir
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (confirmPassword && value !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
    } else if (confirmPassword) {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (password && password !== value) {
      setPasswordError("Las contraseñas no coinciden");
    } else if (password) {
      setPasswordError("");
    }
  };

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
        Registrarse
      </h2>
      
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
          onChange={(e) => handlePasswordChange(e.target.value)}
          placeholder="Contraseña (mínimo 6 caracteres)"
          required
          style={{
            width: "100%",
            padding: "12px",
            border: passwordError ? "1px solid #ef4444" : "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "16px"
          }}
        />
        
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => handleConfirmPasswordChange(e.target.value)}
          placeholder="Confirmar contraseña"
          required
          style={{
            width: "100%",
            padding: "12px",
            border: passwordError ? "1px solid #ef4444" : "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "16px"
          }}
        />
        
        {passwordError && (
          <p style={{ color: "#ef4444", fontSize: "14px", margin: "0" }}>
            {passwordError}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !!passwordError || password !== confirmPassword || password.length < 6}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: (password === confirmPassword && password.length >= 6) ? "#10b981" : "#9ca3af",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <p style={{ marginTop: "2rem", color: "#64748b" }}>
        ¿Ya tienes cuenta?{" "}
        <a href="/" style={{ color: "#3b82f6", fontWeight: "600" }}>
          Inicia sesión
        </a>
      </p>
    </div>
  );
}
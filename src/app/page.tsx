// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    const images = [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&h=1080&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&h=1080&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&h=1080&fit=crop",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1920&h=1080&fit=crop",
    ];

    const mobileImages = [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1080&h=1920&fit=crop",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1080&h=1920&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1080&h=1920&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1080&h=1920&fit=crop",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1080&h=1920&fit=crop",
    ];

    const isMobile = window.innerWidth < 768;
    const selected = isMobile ? mobileImages : images;

    setBgImage(selected[Math.floor(Math.random() * selected.length)]);
  }, []);

  useEffect(() => {
    const check = async (): Promise<void> => {
      try {
        const {  data: sessionData } = await supabase.auth.getSession();

        if (sessionData?.session) {
          const {  data: orgData } = await supabase
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

    check();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-gray-50">
        <Card className="w-full max-w-md mx-4">
          <div className="p-8 text-center">
            <div className="w-8 h-8 mx-auto mb-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 text-base font-medium">Cargando...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-start items-center p-4 md:p-8 box-border bg-cover bg-center bg-no-repeat relative transition-all duration-1000 ease-in-out opacity-0 animate-fadeIn"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* Capa oscura elegante con gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 backdrop-blur-sm"></div>

      {/* Contenido */}
      <main className="relative z-10 max-w-2xl w-full text-center mt-24 md:mt-40 animate-fadeInSlow">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-2xl">
          Hotel Media Bank
        </h1>

        <p className="text-lg md:text-xl text-gray-200 font-light leading-relaxed mb-10 drop-shadow-md max-w-xl mx-auto">
          Gestión visual inteligente para hoteles y agencias, diseñada para simplificar el acceso a contenido oficial
        </p>

        {/* Botones de selección de rol - Alineados con el texto */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-xl mx-auto">
          <Button
            onClick={() => {
              localStorage.setItem("loginRole", "hotel");
              sessionStorage.setItem("loginRole", "hotel");
              window.location.href = "/login";
            }}
            className="h-14 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold text-base rounded-2xl px-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 border-2 border-blue-400/50 hover:border-blue-300 backdrop-blur-sm flex-1 min-w-[180px]"
          >
            <span className="flex items-center justify-center gap-2.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Soy un hotel
            </span>
          </Button>

          <Button
            onClick={() => {
              localStorage.setItem("loginRole", "agency");
              sessionStorage.setItem("loginRole", "agency");
              window.location.href = "/login";
            }}
            className="h-14 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold text-base rounded-2xl px-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 border-2 border-emerald-400/50 hover:border-emerald-300 backdrop-blur-sm flex-1 min-w-[180px]"
          >
            <span className="flex items-center justify-center gap-2.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Soy una agencia
            </span>
          </Button>
        </div>

        {/* Enlace de registro - Sin recuadro, solo texto */}
        <p className="text-gray-300 text-sm mt-8">
          ¿Eres nuevo?{" "}
          <a
            href="/register"
            className="text-blue-300 font-semibold hover:text-blue-200 transition-colors duration-200 inline-flex items-center gap-1 hover:underline"
          >
            <span>Regístrate aquí</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </p>
      </main>

      {/* Footer mejorado */}
      <footer className="fixed bottom-6 left-0 right-0 z-40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="border-t border-white/0 pt-6">
            <div className="text-center">
              <p className="text-gray-300 text-xs font-light">
                © 2026 Hotel Media Bank • Plataforma B2B de contenido profesional
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Badge ExSabri IA - Mejorado */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          <div className="relative inline-flex items-center space-x-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer">
            <span className="text-xs font-light text-gray-300 tracking-wide">Propulsado por</span>
            <div className="flex items-baseline space-x-0.5">
              <span className="font-semibold text-sm text-white tracking-tight">ExSabri</span>
              <span className="font-light text-xs text-blue-300">IA</span>
            </div>
          </div>
          
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-white/95 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-xl shadow-xl border border-gray-200 text-[13px] leading-[1.5] text-left w-[260px] animate-fadeInTooltip">
            <div className="flex items-start gap-2">
              <div className="mt-0.5">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-sm font-medium">
                ExSabri es nuestra tecnología para el etiquetado inteligente y clasificación automática de contenido visual
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animaciones */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        .animate-fadeIn {
          animation: fadeIn 1.2s ease forwards;
        }

        @keyframes fadeInSlow {
          from { 
            opacity: 0; 
            transform: translateY(30px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        .animate-fadeInSlow {
          animation: fadeInSlow 1.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes fadeInTooltip {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeInTooltip {
          animation: fadeInTooltip 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
}
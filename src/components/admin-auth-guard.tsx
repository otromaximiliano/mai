"use client";

import { useState, useEffect } from "react";
import { Lock, ArrowRight, Store, Mail, KeyRound } from "lucide-react";
import Link from "next/link";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

const AUTH_STORAGE_KEY = "naminami_admin_authed";
const PIN_STORAGE_KEY = "naminami_admin_pin";
const EMAIL_STORAGE_KEY = "naminami_admin_email";

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState("mai@southopenlabs.com");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const authed = sessionStorage.getItem(AUTH_STORAGE_KEY) === "true";
    setIsAuthenticated(authed);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
        sessionStorage.setItem(PIN_STORAGE_KEY, password);
        sessionStorage.setItem(EMAIL_STORAGE_KEY, email);
        setIsAuthenticated(true);
      } else {
        setErrorMessage(data.error || "Credenciales incorrectas");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("Error de conexión al verificar credenciales");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(PIN_STORAGE_KEY);
    sessionStorage.removeItem(EMAIL_STORAGE_KEY);
    setIsAuthenticated(false);
    setPassword("");
  };

  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-apple-gray flex items-center justify-center" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-apple-gray flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-apple-card border border-black/5 text-center">
          <div className="w-12 h-12 rounded-full bg-apple-dark text-white flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5" />
          </div>

          <h2 className="text-xl font-bold text-apple-dark mb-1">Acceso Administrativo</h2>
          <p className="text-xs text-apple-muted mb-6">
            Inicia sesión para gestionar catálogo y pedidos
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-[11px] font-semibold text-apple-muted block mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-apple-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="mai@southopenlabs.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-apple-gray border border-black/10 text-xs text-apple-dark focus:outline-none focus:ring-2 focus:ring-apple-dark/20"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-apple-muted block mb-1">
                Contraseña
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-apple-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="••••••••"
                  required
                  autoFocus
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-apple-gray border border-black/10 text-xs text-apple-dark focus:outline-none focus:ring-2 focus:ring-apple-dark/20"
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-600 font-medium text-center">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full bg-apple-dark hover:bg-black text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm disabled:opacity-50"
            >
              <span>{isLoading ? "Verificando..." : "Ingresar"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-black/5">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-apple-muted hover:text-apple-dark transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Volver a la tienda</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-apple-dark text-white text-[11px] py-1.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium">Sesión: mai@southopenlabs.com</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-white/60 hover:text-white underline text-[11px]"
        >
          Cerrar Sesión
        </button>
      </div>
      {children}
    </div>
  );
}

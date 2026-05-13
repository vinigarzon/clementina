"use client";

import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (queryError) {
      if (queryError === "no-profile" || queryError === "PGRST116") {
        setError(
          "Tu cuenta no tiene perfil asociado. Verifica en Supabase que tu fila en la tabla 'profiles' exista y vuelve a iniciar sesión.",
        );
      } else {
        setError(`Sesión cerrada (${queryError}).`);
      }
    }
  }, [queryError]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Credenciales incorrectas. Vuelve a intentarlo.");
      setLoading(false);
      return;
    }

    router.refresh();
    router.replace("/admin");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-clementina-800 via-clementina-700 to-clementina-900 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Image
            src="/logos/logo-white.png"
            alt="Finca La Clementina"
            width={220}
            height={75}
            priority
            className="h-14 w-auto mx-auto mb-6"
          />
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-cream-100/70">
            Panel Administrativo
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-cream-50 rounded-2xl shadow-2xl p-8"
        >
          <h1 className="font-display text-3xl text-clementina-800 mb-2">
            Iniciar sesión
          </h1>
          <p className="font-sans text-sm text-clementina-900/60 mb-8">
            Accede con tu correo y contraseña.
          </p>

          <div className="space-y-5">
            <div>
              <label className="block font-sans text-sm font-medium text-clementina-900 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-clementina-200 bg-white font-sans text-base focus:outline-none focus:border-clementina-600"
                placeholder="tu@correo.com"
              />
            </div>

            <div>
              <label className="block font-sans text-sm font-medium text-clementina-900 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-clementina-200 bg-white font-sans text-base focus:outline-none focus:border-clementina-600"
              />
            </div>
          </div>

          {error && (
            <div className="mt-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 font-sans text-sm text-red-800">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 px-8 py-3.5 rounded-full bg-clementina-800 text-cream-50 font-sans text-sm font-medium hover:bg-clementina-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center mt-8 font-sans text-xs text-cream-100/60">
          ¿Olvidaste tu contraseña? Pídele a un super admin que la restablezca
          desde Supabase.
        </p>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

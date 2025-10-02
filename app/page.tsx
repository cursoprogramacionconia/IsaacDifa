'use client';

import { FormEvent, useState } from "react";

const DEFAULT_LOGIN_ENDPOINT = "/api/login";
const LOGIN_ENDPOINT =
  process.env.NEXT_PUBLIC_LOGIN_ENDPOINT ?? DEFAULT_LOGIN_ENDPOINT;

type StatusMessage = {
  type: "success" | "error";
  text: string;
} | null;

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<StatusMessage>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          (payload && (payload.message ?? payload.error ?? payload.detail)) ??
          "El usuario es incorrecto.";
        throw new Error(message);
      }

      const successMessage =
        (payload && (payload.message ?? payload.detail)) ??
        "El usuario sí existe.";

      setStatus({
        type: "success",
        text: successMessage,
      });
    } catch (error) {
      console.error(error);
      const fallbackMessage =
        error instanceof Error && error.message.trim().length > 0
          ? error.message
          : "El usuario es incorrecto.";
      setStatus({
        type: "error",
        text: fallbackMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = username.trim().length > 0 && password.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-blue-900 to-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-blue-600 text-white text-center py-8 px-6">
          <h1 className="text-2xl font-semibold tracking-wide uppercase">
            Taller programación con IA
          </h1>
          <p className="mt-2 text-sm text-blue-100">
            Inicia sesión para continuar
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700" htmlFor="username">
              Usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
              required
            />
          </div>
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:from-blue-500 hover:to-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Validando..." : "Iniciar sesión"}
          </button>
          {status && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                status.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-600"
              }`}
            >
              {status.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

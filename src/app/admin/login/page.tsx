"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-gray">
      <div className="bg-white p-8 shadow-sm max-w-sm w-full mx-4">
        <h1 className="text-2xl font-serif text-center mb-2">BLISS brand</h1>
        <p className="text-sm text-muted text-center mb-8">
          Панель администратора
        </p>

        <form action={formAction}>
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            required
            autoFocus
            className="w-full border border-border px-4 py-3 mb-4 text-sm focus:outline-none focus:border-primary transition-colors"
          />

          {state?.error && (
            <p className="text-red-500 text-sm mb-4">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-primary text-white py-3 text-sm uppercase tracking-wider hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {pending ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}

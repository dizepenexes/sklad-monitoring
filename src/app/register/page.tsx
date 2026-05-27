"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Помилка");
        return;
      }

      router.push("/catalog?success=register");

      setName("");
      setEmail("");
      setPassword("");
    } catch {
      setMessage("Помилка сервера");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-10 text-black">
      <section className="w-full max-w-md rounded-3xl border border-neutral-200 p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            Авторизація
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Реєстрація
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Створіть акаунт для роботи із сайтом.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Ім’я
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше ім’я"
              className="w-full rounded-2xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full rounded-2xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Пароль
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          {message && (
            <div className="rounded-2xl bg-neutral-100 px-4 py-3 text-sm">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-black px-5 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Завантаження..." : "Зареєструватися"}
          </button>
        </form>
      </section>
    </main>
  );
}
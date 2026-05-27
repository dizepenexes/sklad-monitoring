"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navigation = [
  { href: "/", label: "Головна" },
  { href: "/catalog", label: "Каталог" },
  { href: "/admin", label: "Адмін" },
];

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const response = await fetch("/api/auth/me");
    const data = await response.json();

    setUser(data.user);
  }

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    setOpen(false);
    setUser(null);
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="min-w-0 shrink">
          <span className="block text-base font-black leading-5 tracking-tight text-black sm:text-lg">
            Склад у Руслана
          </span>

          <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
            Будівельні матеріали
          </span>
        </Link>

        <nav className="flex shrink-0 items-center gap-1">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-2 py-2 text-[13px] font-medium text-black transition hover:bg-neutral-100 sm:px-4 sm:text-sm"
            >
              {item.label}
            </Link>
          ))}

          {user ? (
            <button
              onClick={() => setOpen(true)}
              className="ml-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black text-sm text-white transition hover:opacity-90"
              aria-label="Профіль"
            >
              👤
            </button>
          ) : (
            <Link
              href="/register"
              className="ml-1 rounded-full bg-black px-3 py-2 text-[13px] font-semibold text-white sm:px-4 sm:text-sm"
            >
              Вхід
            </Link>
          )}
        </nav>
      </div>

      {open && user && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-24">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
                  Профіль
                </p>

                <h2 className="mt-2 text-2xl font-black text-black">
                  {user.name}
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  {user.email}
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="cursor-pointer rounded-full bg-neutral-100 px-3 py-2 text-sm font-bold transition hover:bg-neutral-200"
              >
                ✕
              </button>
            </div>

            <button
              onClick={logout}
              className="w-full cursor-pointer rounded-2xl bg-black px-5 py-4 text-sm font-bold text-white transition hover:opacity-90"
            >
              Вийти
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadProducts();
    loadUser();

    const params = new URLSearchParams(window.location.search);

    if (
      params.get("success") === "register" ||
      params.get("success") === "login"
    ) {
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  }, []);

  async function loadProducts() {
    const response = await fetch("/api/products");

    const data = await response.json();

    setProducts(data.products);
  }

  async function loadUser() {
    const response = await fetch("/api/auth/me");

    const data = await response.json();

    setUser(data.user);
  }

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    window.location.reload();
  }

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-black">
      <section className="mx-auto max-w-6xl">
        {showSuccess && (
          <div className="fixed left-1/2 top-5 z-50 -translate-x-1/2 rounded-2xl bg-black px-5 py-4 text-sm font-semibold text-white shadow-2xl">
            Авторизація успішна!
          </div>
        )}

        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-neutral-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
              Асортимент
            </p>

            <h1 className="mt-2 text-3xl font-black">
              Каталог товарів
            </h1>
          </div>

          {user && (
            <div className="rounded-2xl bg-neutral-100 px-4 py-3">
              <p className="text-sm font-bold">
                {user.name}
              </p>

              <p className="text-xs text-neutral-500">
                {user.email}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold">
                  {user.role}
                </span>

                <button
                  onClick={logout}
                  className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white"
                >
                  Вийти
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mb-5">
          <input
            type="text"
            placeholder="Пошук товару..."
            className="w-full rounded-full border border-neutral-300 px-5 py-4 text-base outline-none focus:border-black"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex h-32 items-center justify-center rounded-2xl bg-neutral-100">
                <span className="text-sm text-neutral-400">
                  Фото товару
                </span>
              </div>

              <p className="text-xs uppercase tracking-[0.16em] text-neutral-400">
                {product.category}
              </p>

              <h2 className="mt-2 min-h-12 text-lg font-bold leading-tight">
                {product.name}
              </h2>

              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-2xl font-black">
                    {product.price} ₴
                  </p>

                  <p className="text-sm text-neutral-500">
                    за {product.unit}
                  </p>
                </div>

                <div className="rounded-full bg-neutral-100 px-3 py-2 text-xs font-semibold">
                  {product.stock} {product.unit}
                </div>
              </div>

              <button className="mt-5 w-full rounded-full bg-black px-5 py-3 text-sm font-bold text-white">
                Замовити
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
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

function getPaginationPages(currentPage: number, totalPages: number) {
  const pages: (number | "...")[] = [];

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  pages.push(1);

  const startPage = Math.max(2, currentPage - 1);
  const endPage = Math.min(totalPages - 1, currentPage + 1);

  if (startPage > 2) {
    pages.push("...");
  }

  for (let page = startPage; page <= endPage; page++) {
    pages.push(page);
  }

  if (endPage < totalPages - 1) {
    pages.push("...");
  }

  pages.push(totalPages);

  return pages;
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadProducts();

    const params = new URLSearchParams(window.location.search);

    if (
      params.get("success") === "register" ||
      params.get("success") === "login"
    ) {
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      window.history.replaceState(null, "", "/catalog");
    }
  }, []);

  async function loadProducts() {
    const response = await fetch("/api/products");

    const data = await response.json();

    setProducts(data.products);
  }

  const filteredProducts = products.filter((product: Product) => {
  const query = search.toLowerCase();

  return (
    product.name.toLowerCase().includes(query) ||
    product.category.toLowerCase().includes(query)
  );
});

const productsPerPage = 20;

const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

const startIndex = (currentPage - 1) * productsPerPage;

const paginatedProducts = filteredProducts.slice(
  startIndex,
  startIndex + productsPerPage
);
const paginationPages = getPaginationPages(currentPage, totalPages);

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-black">
      <section className="mx-auto max-w-6xl">
        {showSuccess && (
          <div className="fixed left-1/2 top-5 z-50 -translate-x-1/2 rounded-2xl bg-black px-5 py-4 text-sm font-semibold text-white shadow-2xl">
            Авторизація успішна!
          </div>
        )}

        <div className="mb-6 rounded-3xl border border-neutral-200 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            Асортимент
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Каталог товарів
          </h1>
        </div>

        <div className="mb-5">
          <input
            type="text"
            value={search}
            onChange={(event) => {
  setSearch(event.target.value);
  setCurrentPage(1);
}}
            placeholder="Пошук товару..."
            className="w-full rounded-full border border-neutral-300 px-5 py-4 text-base outline-none focus:border-black"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {paginatedProducts.map((product) => (
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
        {totalPages > 1 && (
  <div className="mt-8 flex flex-wrap justify-center gap-2">
    {paginationPages.map((page, index) =>
      page === "..." ? (
        <span
          key={`dots-${index}`}
          className="flex h-10 min-w-10 items-center justify-center px-2 text-sm font-bold text-neutral-400"
        >
          ...
        </span>
      ) : (
        <button
          key={page}
          type="button"
          onClick={() => setCurrentPage(page)}
          className={
            currentPage === page
              ? "h-10 min-w-10 cursor-pointer rounded-full bg-black px-4 text-sm font-bold text-white"
              : "h-10 min-w-10 cursor-pointer rounded-full border border-neutral-300 px-4 text-sm font-bold transition hover:bg-neutral-100"
          }
        >
          {page}
        </button>
      )
    )}
  </div>
)}
      </section>
      
    </main>
  );
}
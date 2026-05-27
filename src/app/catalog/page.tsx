import { prisma } from "@/lib/prisma";
import type { Product } from "@prisma/client";

export default async function CatalogPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-black">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            Асортимент
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Каталог товарів
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Перегляд товарів, цін та залишків на складі.
          </p>
        </div>

        <div className="mb-5">
          <input
            type="text"
            placeholder="Пошук товару..."
            className="w-full rounded-full border border-neutral-300 px-5 py-4 text-base outline-none focus:border-black"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product: Product) => (
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
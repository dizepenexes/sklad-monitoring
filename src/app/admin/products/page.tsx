import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminProductsPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-6 text-black">
      <section className="mx-auto max-w-6xl">
        <AdminNav />

        <div className="rounded-3xl border border-neutral-200 p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            Товари
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Управління товарами
          </h1>

          <p className="mt-3 text-neutral-500">
            Тут буде додавання товарів,
            редагування залишків та категорій.
          </p>
        </div>
      </section>
    </main>
  );
}
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (
    user.role !== "ADMIN" &&
    user.role !== "OWNER"
  ) {
    redirect("/catalog");
  }

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-black">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-neutral-200 p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            Адмін-панель
          </p>

          <h1 className="mt-2 text-4xl font-black">
            Панель управління
          </h1>

          <p className="mt-4 text-neutral-500">
            Тут буде керування товарами, заявками,
            продажами та фінансами.
          </p>
        </div>
      </section>
    </main>
  );
}
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl flex-col justify-center px-4 py-10">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-neutral-500">
          Будівельний маркет
        </p>

        <h1 className="max-w-3xl text-5xl font-black leading-tight sm:text-7xl">
          ЯR Дом
        </h1>

        <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">
          Будівельні матеріали для ремонту та будівництва.
        </h2>

        <p className="mt-6 max-w-xl text-base leading-7 text-neutral-600">
          Переглядайте асортимент, ціни та наявність товарів у каталозі.
          Для замовлення оберіть потрібні матеріали або звʼяжіться зі складом.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/catalog"
            className="rounded-full bg-black px-6 py-4 text-center text-sm font-semibold text-white transition hover:opacity-90"
          >
            Перейти до каталогу
          </Link>

          <a
            href="tel:+380681846256"
            className="rounded-full border border-neutral-300 px-6 py-4 text-center text-sm font-semibold transition hover:bg-neutral-100"
          >
            Подзвонити
          </a>
        </div>
      </section>
    </main>
  );
}
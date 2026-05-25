export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl flex-col px-4 py-6">
        <section className="flex flex-1 flex-col justify-center py-10">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-neutral-500">
            Онлайн-моніторинг складу
          </p>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
            Склад у Руслана
          </h1>

          <h2 className="mt-3 max-w-2xl text-2xl font-semibold leading-tight text-neutral-800 sm:text-4xl">
            Асортимент, заявки, продажі та залишки в одному місці.
          </h2>

          <p className="mt-6 max-w-xl text-base leading-7 text-neutral-600">
            Сайт для перегляду товарів, контролю складу, ведення продажів,
            закупівель і щоденної грошової відомості.
          </p>

          <div className="mt-8 grid gap-3 sm:flex">
            <a
              href="/catalog"
              className="rounded-full bg-black px-6 py-4 text-center text-sm font-semibold text-white transition hover:opacity-90"
            >
              Перейти до каталогу
            </a>

            <a
              href="/admin"
              className="rounded-full border border-neutral-300 px-6 py-4 text-center text-sm font-semibold transition hover:bg-neutral-100"
            >
              Адмін-панель
            </a>
          </div>
        </section>

        <section className="grid gap-3 pb-6 sm:grid-cols-3">
          <div className="rounded-3xl border border-neutral-200 p-5 transition hover:border-black">
            <p className="text-3xl font-bold">0</p>
            <p className="mt-1 text-sm text-neutral-500">
              Товарів у базі
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 p-5 transition hover:border-black">
            <p className="text-3xl font-bold">0 ₴</p>
            <p className="mt-1 text-sm text-neutral-500">
              Продажів сьогодні
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 p-5 transition hover:border-black">
            <p className="text-3xl font-bold">0</p>
            <p className="mt-1 text-sm text-neutral-500">
              Заявок на закупку
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
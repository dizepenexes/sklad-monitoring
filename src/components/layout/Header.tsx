import Link from "next/link";

const navigation = [
  { href: "/", label: "Головна" },
  { href: "/catalog", label: "Каталог" },
  { href: "/admin", label: "Адмін" },
  { href: "/register", label: "Вхід" },
];

export function Header() {
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
        </nav>
      </div>
    </header>
  );
}
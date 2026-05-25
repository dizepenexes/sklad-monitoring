import Link from "next/link";

const navigation = [
  { href: "/", label: "Головна" },
  { href: "/catalog", label: "Каталог" },
  { href: "/admin", label: "Адмін" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex flex-col">
          <span className="text-lg font-black tracking-tight text-black">
            Склад у Руслана
          </span>

          <span className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
            Будівельні матеріали
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-black transition hover:bg-neutral-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
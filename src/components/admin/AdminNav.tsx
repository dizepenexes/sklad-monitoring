"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/admin",
    label: "Каса",
  },
  {
    href: "/admin/history",
    label: "Історія",
  },
  {
    href: "/admin/products",
    label: "Товари",
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {links.map((link) => {
        const active = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              active
                ? "rounded-full bg-black px-5 py-3 text-sm font-bold text-white"
                : "rounded-full border border-neutral-300 px-5 py-3 text-sm font-bold text-black transition hover:bg-neutral-100"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
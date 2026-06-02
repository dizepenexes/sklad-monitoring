"use client";

import { AdminNav } from "@/components/admin/AdminNav";
import { useEffect, useState } from "react";

type CashEvent = {
  id: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  amount: number;
  comment: string | null;
  createdAt: string;
};

type CashDay = {
  id: string;
  date: string;
  openingBalance: number;
  events: CashEvent[];
  summary: {
    income: number;
    expense: number;
    closingBalance: number;
  };
};

type HistoryResponse = {
  days: CashDay[];
  canManage: boolean;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("uk-UA");
}

function getCategoryLabel(category: string) {
  const labels: Record<string, string> = {
    LOCAL_SALE: "Продаж на місці",
    DELIVERY_ORDER: "Доставка / замовлення",
    DEBT_RETURN: "Повернення боргу",
    SALARY: "Зарплата",
    OTHER: "Інше",
  };

  return labels[category] || category;
}

export default function AdminHistoryPage() {
  const [data, setData] = useState<HistoryResponse | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    const response = await fetch("/api/admin/cash-history");

    if (!response.ok) {
      window.location.href = "/catalog";
      return;
    }

    const result = await response.json();

    setData(result);
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-white px-4 py-10 text-black">
        Завантаження...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-black">
      <section className="mx-auto max-w-6xl">
        <AdminNav />

        <div className="mb-6 rounded-3xl border border-neutral-200 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            Історія
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Історія каси
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Усі дні, доходи, витрати та підсумки.
          </p>
        </div>

        <div className="space-y-4">
          {data.days.length === 0 ? (
            <div className="rounded-3xl border border-neutral-200 p-5 text-sm text-neutral-500">
              Історії поки немає.
            </div>
          ) : (
            data.days.map((day) => (
              <article
                key={day.id}
                className="rounded-3xl border border-neutral-200"
              >
                <div className="border-b border-neutral-200 p-5">
                  <h2 className="text-xl font-black">
                    {formatDate(day.date)}
                  </h2>
                </div>

                <div className="grid gap-3 p-5 sm:grid-cols-3">
                  {data.canManage && (
                    <div className="rounded-2xl bg-neutral-100 p-4">
                      <p className="text-sm text-neutral-500">
                        На початку дня
                      </p>
                      <p className="mt-1 text-2xl font-black">
                        {day.openingBalance} ₴
                      </p>
                    </div>
                  )}

                  <div className="rounded-2xl bg-neutral-100 p-4">
                    <p className="text-sm text-neutral-500">Доходи</p>
                    <p className="mt-1 text-2xl font-black">
                      {day.summary.income} ₴
                    </p>
                  </div>

                  <div className="rounded-2xl bg-neutral-100 p-4">
                    <p className="text-sm text-neutral-500">Витрати</p>
                    <p className="mt-1 text-2xl font-black">
                      {day.summary.expense} ₴
                    </p>
                  </div>

                  {data.canManage && (
                    <div className="rounded-2xl bg-neutral-100 p-4">
                      <p className="text-sm text-neutral-500">Залишок</p>
                      <p className="mt-1 text-2xl font-black">
                        {day.summary.closingBalance} ₴
                      </p>
                    </div>
                  )}
                </div>

                <div className="divide-y divide-neutral-200 border-t border-neutral-200">
                  {day.events.length === 0 ? (
                    <div className="p-5 text-sm text-neutral-500">
                      Подій немає.
                    </div>
                  ) : (
                    day.events.map((event) => (
                      <div
                        key={event.id}
                        className="grid grid-cols-[1fr_auto] items-center gap-4 p-5"
                      >
                        <div>
                          <p className="text-sm font-bold">
                            {getCategoryLabel(event.category)}
                          </p>

                          {event.comment && (
                            <p className="mt-1 text-sm text-neutral-500">
                              {event.comment}
                            </p>
                          )}
                        </div>

                        <p className="text-lg font-black">
                          {event.type === "INCOME" ? "+" : "-"}
                          {event.amount} ₴
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
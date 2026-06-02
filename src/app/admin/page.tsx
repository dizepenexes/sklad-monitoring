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
  items?: ReceiptItem[];
};

type CashDay = {
  id: string;
  date: string;
  openingBalance: number;
  events: CashEvent[];
};

type CashDayResponse = {
  cashDay: CashDay;
  summary: {
    income: number;
    expense: number;
    closingBalance: number;
  };
  canManage: boolean;
};

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
};

type ReceiptItem = {
  id: string;
  quantity: number;
  priceAtSale: number;
  total: number;
  product: Product;
};

type ReceiptEvent = CashEvent & {
  items?: ReceiptItem[];
};

type ModalType = "INCOME" | "EXPENSE" | null;

const incomeCategories = [
  { value: "LOCAL_SALE", label: "Продаж на місці" },
  { value: "DELIVERY_ORDER", label: "Доставка / замовлення" },
  { value: "DEBT_RETURN", label: "Повернення боргу" },
];

const expenseCategories = [
  { value: "SALARY", label: "Зарплата" },
  { value: "OTHER", label: "Інше" },
];

function getCategoryLabel(category: string) {
  const allCategories = [...incomeCategories, ...expenseCategories];
  return allCategories.find((item) => item.value === category)?.label || category;
}

export default function AdminPage() {
  const [data, setData] = useState<CashDayResponse | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [receiptEvent, setReceiptEvent] = useState<ReceiptEvent | null>(null);

  const [productSearch, setProductSearch] = useState("");

  const [items, setItems] = useState<
    {
      productId: string;
      quantity: string;
    }[]
  >([]);

  const [deliveryAmount, setDeliveryAmount] = useState("");

  useEffect(() => {
    loadCashDay();
    loadProducts();
  }, []);

  async function loadCashDay() {
    const response = await fetch("/api/admin/cash-day");

    if (!response.ok) {
      window.location.href = "/catalog";
      return;
    }

    const result = await response.json();
    setData(result);
  }

  async function loadProducts() {
  const response = await fetch("/api/products");
  const data = await response.json();

  setProducts(data.products);
}

  function openModal(type: Exclude<ModalType, null>) {
    setModalType(type);
    setCategory("");
    setAmount("");
    setComment("");
    setMessage("");
    setProductSearch("");
    setDeliveryAmount("");
    setItems([]);
  }

  function closeModal() {
    setModalType(null);
    setCategory("");
    setAmount("");
    setComment("");
    setMessage("");
    setProductSearch("");
    setDeliveryAmount("");
    setItems([]);
    setReceiptEvent(null);
  }

  function addItem(productId: string) {
    const exists = items.find((item) => item.productId === productId);

    if (exists) {
      return;
    }

    setItems([
      ...items,
      {
        productId,
        quantity: "1",
      },
    ]);

    setProductSearch("");
  }

  function removeItem(productId: string) {
    setItems(items.filter((item) => item.productId !== productId));
  }

  function changeQuantity(productId: string, quantity: string) {
    setItems(
      items.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  }

  async function submitEvent() {
    if (!modalType) return;

    try {
      setLoading(true);
      setMessage("");


      const response = await fetch("/api/admin/cash-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: modalType,
          category,
          amount,
          comment,
          deliveryAmount,
          items,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Помилка");
        return;
      }

      closeModal();
      await loadCashDay();
    } catch {
      setMessage("Помилка сервера");
    } finally {
      setLoading(false);
    }
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-white px-4 py-10 text-black">
        Завантаження...
      </main>
    );
  }
  const isProductIncome =
  category === "LOCAL_SALE" || category === "DELIVERY_ORDER";

  const categories = modalType === "INCOME" ? incomeCategories : expenseCategories;

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const formattedDate = new Date(data.cashDay.date).toLocaleDateString("uk-UA");


  return (
    <main className="min-h-screen bg-white px-4 py-6 text-black">
      <section className="mx-auto max-w-6xl">
        <AdminNav />

        <div className="mb-6 rounded-3xl border border-neutral-200 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            Адмін-панель
          </p>

          <h1 className="mt-2 text-3xl font-black">Каса дня</h1>

          <p className="mt-2 text-sm text-neutral-500">
            Доходи, витрати та події складу за сьогодні.
          </p>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {data.canManage && (
            <div className="rounded-3xl border border-neutral-200 p-5">
              <p className="text-sm text-neutral-500">На початку дня</p>
              <p className="mt-2 text-3xl font-black">
                {data.cashDay.openingBalance} ₴
              </p>
            </div>
          )}

          <div className="rounded-3xl border border-neutral-200 p-5">
            <p className="text-sm text-neutral-500">Доходи</p>
            <p className="mt-2 text-3xl font-black">
              {data.summary.income} ₴
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 p-5">
            <p className="text-sm text-neutral-500">Витрати</p>
            <p className="mt-2 text-3xl font-black">
              {data.summary.expense} ₴
            </p>
          </div>

          {data.canManage && (
            <div className="rounded-3xl border border-neutral-200 p-5">
              <p className="text-sm text-neutral-500">Поточний залишок</p>
              <p className="mt-2 text-3xl font-black">
                {data.summary.closingBalance} ₴
              </p>
            </div>
          )}
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => openModal("INCOME")}
            className="cursor-pointer rounded-3xl bg-black px-5 py-5 text-sm font-bold text-white transition hover:opacity-90"
          >
            Додати дохід
          </button>

          <button
            onClick={() => openModal("EXPENSE")}
            className="cursor-pointer rounded-3xl border border-neutral-300 px-5 py-5 text-sm font-bold transition hover:bg-neutral-100"
          >
            Додати витрату
          </button>
        </div>

        <div className="rounded-3xl border border-neutral-200">
          <div className="border-b border-neutral-200 p-5">
            <h2 className="text-xl font-black">
              Події за день {formattedDate}
            </h2>
          </div>

          <div className="divide-y divide-neutral-200">
            {data.cashDay.events.length === 0 ? (
              <div className="p-5 text-sm text-neutral-500">
                Подій поки немає.
              </div>
            ) : (
              data.cashDay.events.map((event) => (
                <div
                  key={event.id}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-4 p-5"
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

                  <button
                    type="button"
                    onClick={() => setReceiptEvent(event)}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-neutral-300 text-sm font-bold transition hover:bg-neutral-100"
                  >
                    i
                  </button>

                  <p className="text-lg font-black">
                    {event.type === "INCOME" ? "+" : "-"}
                    {event.amount} ₴
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {modalType && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
                  {modalType === "INCOME" ? "Дохід" : "Витрата"}
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  {modalType === "INCOME"
                    ? "Додати дохід"
                    : "Додати витрату"}
                </h2>
              </div>

              <button
                onClick={closeModal}
                className="cursor-pointer rounded-full bg-neutral-100 px-3 py-2 text-sm font-bold transition hover:bg-neutral-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Категорія
                </label>

                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full cursor-pointer rounded-2xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
                >
                  <option value="">Оберіть категорію</option>

                  {categories.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

{isProductIncome && (
  <>
    <div>
      <label className="mb-2 block text-sm font-medium">
        Пошук товару
      </label>

      <input
        type="text"
        value={productSearch}
        onChange={(event) =>
          setProductSearch(event.target.value)
        }
        placeholder="Пошук товару..."
        className="mb-3 w-full rounded-2xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
      />

      <div className="max-h-52 overflow-y-auto rounded-2xl border border-neutral-200">
        {filteredProducts.length === 0 ? (
          <div className="p-4 text-sm text-neutral-500">
            Товар не знайдено
          </div>
        ) : (
          filteredProducts.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => addItem(product.id)}
              className="w-full cursor-pointer px-4 py-3 text-left text-sm transition hover:bg-neutral-100"
            >
              <span className="block font-bold">
                {product.name}
              </span>

              <span className="block text-xs opacity-70">
                {product.price} ₴ / {product.unit},
                залишок: {product.stock}
              </span>
            </button>
          ))
        )}
      </div>
    </div>

    {items.length > 0 && (
      <div className="space-y-3 rounded-2xl border border-neutral-200 p-4">
        {items.map((item) => {
          const product = products.find(
            (product) => product.id === item.productId
          );

          if (!product) return null;

          return (
            <div
              key={item.productId}
              className="rounded-2xl bg-neutral-100 p-4"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold">
                    {product.name}
                  </p>

                  <p className="text-sm text-neutral-500">
                    {product.price} ₴ / {product.unit}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    removeItem(item.productId)
                  }
                  className="cursor-pointer rounded-full bg-white px-3 py-2 text-sm font-bold transition hover:bg-neutral-200"
                >
                  ✕
                </button>
              </div>

              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(event) =>
                  changeQuantity(
                    item.productId,
                    event.target.value
                  )
                }
                placeholder="Кількість"
                className="w-full rounded-2xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
              />

              <div className="mt-3 text-sm font-bold">
                Сума:{" "}
                {product.price *
                  Number(item.quantity)} ₴
              </div>
            </div>
          );
        })}
      </div>
    )}

    {category === "DELIVERY_ORDER" && (
      <div>
        <label className="mb-2 block text-sm font-medium">
          Сума доставки
        </label>

        <input
          type="number"
          min="0"
          value={deliveryAmount}
          onChange={(event) =>
            setDeliveryAmount(event.target.value)
          }
          placeholder="0"
          className="w-full rounded-2xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
        />
      </div>
    )}

    <div className="rounded-2xl bg-neutral-100 px-4 py-3 text-sm">
      Сума продажу:{" "}
      <b>
        {(
          items.reduce((sum, item) => {
            const product = products.find(
              (product) =>
                product.id === item.productId
            );

            if (!product) return sum;

            return (
              sum +
              product.price *
                Number(item.quantity)
            );
          }, 0) +
          Number(deliveryAmount || 0)
        ).toFixed(2)}{" "}
        ₴
      </b>
    </div>
  </>
)}

{!isProductIncome && (
  <div>
    <label className="mb-2 block text-sm font-medium">
      Сума
    </label>

    <input
      type="number"
      min="1"
      value={amount}
      onChange={(event) => setAmount(event.target.value)}
      placeholder="0"
      className="w-full rounded-2xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
    />
  </div>
)}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  {category === "DEBT_RETURN"
                    ? "Опис повернення боргу"
                    : "Коментар"}
                </label>

                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder={
                    category === "OTHER"
                      ? "Обовʼязково вкажіть, куди витрачено гроші"
                      : category === "DEBT_RETURN"
                      ? "опис"
                      : "Необовʼязково"
                  }
                  className="min-h-24 w-full resize-none rounded-2xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              {message && (
                <div className="rounded-2xl bg-neutral-100 px-4 py-3 text-sm">
                  {message}
                </div>
              )}

              <button
                onClick={submitEvent}
                disabled={loading}
                className="w-full cursor-pointer rounded-2xl bg-black px-5 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Збереження..." : "Зберегти"}
              </button>
            </div>
          </div>
        </div>
      )}

      {receiptEvent && (
  <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-6">
    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            Чек
          </p>

          <h2 className="mt-2 text-2xl font-black">
            {receiptEvent.type === "INCOME"
              ? "Деталі продажу"
              : "Деталі витрати"}
          </h2>
        </div>

        <button
          onClick={() => setReceiptEvent(null)}
          className="cursor-pointer rounded-full bg-neutral-100 px-3 py-2 text-sm font-bold transition hover:bg-neutral-200"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        {receiptEvent.type === "INCOME" && (
          <>
            {(receiptEvent.items ?? []).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-2xl bg-neutral-100 p-4"
              >
                <div>
                  <p className="font-bold">{item.product.name}</p>
                  <p className="text-sm text-neutral-500">
                    {item.quantity} {item.product.unit}
                  </p>
                </div>

                <p className="font-black">{item.total} ₴</p>
              </div>
            ))}

            {receiptEvent.category === "DELIVERY_ORDER" &&
              receiptEvent.amount >
                (receiptEvent.items ?? []).reduce(
                  (sum, item) => sum + item.total,
                  0
                ) && (
                <div className="flex items-center justify-between rounded-2xl bg-neutral-100 p-4">
                  <p className="font-bold">Доставка</p>

                  <p className="font-black">
                    {receiptEvent.amount -
                      (receiptEvent.items ?? []).reduce(
                        (sum, item) => sum + item.total,
                        0
                      )}{" "}
                    ₴
                  </p>
                </div>
              )}
          </>
        )}

        {receiptEvent.type === "EXPENSE" && (
          <div className="rounded-2xl bg-neutral-100 p-4 text-lg font-black">
            {receiptEvent.category === "SALARY"
              ? "Зарплата"
              : "Інше"}
          </div>
        )}

        <div className="border-t border-neutral-200 pt-4 text-xl font-black">
          Разом: {receiptEvent.amount} ₴
        </div>

        {receiptEvent.comment && (
          <div className="rounded-2xl bg-neutral-100 p-4 text-sm">
            <b>Коментар:</b> {receiptEvent.comment}
          </div>
        )}
      </div>
    </div>
  </div>
)}
    </main>
  );
}
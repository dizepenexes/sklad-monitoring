import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function getStartOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Потрібна авторизація" }, { status: 401 });
  }

  if (user.role !== "ADMIN" && user.role !== "OWNER") {
    return NextResponse.json({ message: "Немає доступу" }, { status: 403 });
  }

  const body = await request.json();

  const type = body.type;
  const category = body.category;
  const comment = String(body.comment || "").trim();
  const items = Array.isArray(body.items) ? body.items : [];
  
  const deliveryAmount = Number(body.deliveryAmount || 0);

  if (!type || !category) {
    return NextResponse.json({ message: "Некоректні дані" }, { status: 400 });
  }

  if ((category === "OTHER" || category === "DEBT_RETURN") && !comment) {
    return NextResponse.json(
      { message: "Потрібно вказати коментар" },
      { status: 400 }
    );
  }

  const today = getStartOfToday();

  const cashDay = await prisma.cashDay.upsert({
    where: { date: today },
    update: {},
    create: {
      date: today,
      openingBalance: 0,
    },
  });

  if (category === "LOCAL_SALE" || category === "DELIVERY_ORDER") {
    if (items.length === 0) {
      return NextResponse.json(
        { message: "Додайте хоча б один товар" },
        { status: 400 }
      );
    }

    const productIds = items.map(
      (item: { productId: string }) => String(item.productId)
    );

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    let total = deliveryAmount;

    const eventItems: {
      product: (typeof products)[number];
      quantity: number;
      priceAtSale: number;
      total: number;
    }[] = [];

    for (const item of items) {
      const productId = String(item.productId);
      const quantity = Number(item.quantity || 0);

      if (!productId || quantity <= 0) {
        return NextResponse.json(
          { message: "Некоректний товар або кількість" },
          { status: 400 }
        );
      }

      const product = products.find((product) => product.id === productId);

      if (!product) {
        return NextResponse.json(
          { message: "Один з товарів не знайдено" },
          { status: 404 }
        );
      }

      if (product.stock < quantity) {
        return NextResponse.json(
          { message: `Недостатньо товару: ${product.name}` },
          { status: 400 }
        );
      }

      const itemTotal = product.price * quantity;

      total += itemTotal;

      eventItems.push({
        product,
        quantity,
        priceAtSale: product.price,
        total: itemTotal,
      });
    }

    await prisma.$transaction(async (tx) => {
      const event = await tx.cashEvent.create({
        data: {
          cashDayId: cashDay.id,
          userId: user.id,
          type: "INCOME",
          category,
          amount: total,
          comment: comment || null,
        },
      });

      for (const item of eventItems) {
        await tx.cashEventItem.create({
          data: {
            eventId: event.id,
            productId: item.product.id,
            quantity: item.quantity,
            priceAtSale: item.priceAtSale,
            total: item.total,
          },
        });

        await tx.product.update({
          where: {
            id: item.product.id,
          },
          data: {
            stock: item.product.stock - item.quantity,
          },
        });
      }
    });

    return NextResponse.json({ message: "Продаж додано" });
  }

  const amount = Number(body.amount);

  if (!amount || amount <= 0) {
    return NextResponse.json({ message: "Вкажіть суму" }, { status: 400 });
  }

  await prisma.cashEvent.create({
    data: {
      cashDayId: cashDay.id,
      userId: user.id,
      type,
      category,
      amount,
      comment: comment || null,
    },
  });

  return NextResponse.json({
    message: "Подію додано",
  });
}
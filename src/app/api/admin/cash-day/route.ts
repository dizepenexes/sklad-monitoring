import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function getStartOfToday() {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Kyiv",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const dateString = formatter.format(now);

  return new Date(`${dateString}T00:00:00.000Z`);
}

const cashDayInclude = {
  events: {
    orderBy: {
      createdAt: "desc" as const,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  },
};

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Потрібна авторизація" },
      { status: 401 }
    );
  }

  if (user.role !== "ADMIN" && user.role !== "OWNER") {
    return NextResponse.json(
      { message: "Немає доступу" },
      { status: 403 }
    );
  }

  const today = getStartOfToday();

  let cashDay = await prisma.cashDay.findUnique({
    where: {
      date: today,
    },
    include: cashDayInclude,
  });

  if (!cashDay) {
    cashDay = await prisma.cashDay.create({
      data: {
        date: today,
        openingBalance: 0,
      },
      include: cashDayInclude,
    });
  }

  const income = cashDay.events
    .filter((event) => event.type === "INCOME")
    .reduce((sum, event) => sum + event.amount, 0);

  const expense = cashDay.events
    .filter((event) => event.type === "EXPENSE")
    .reduce((sum, event) => sum + event.amount, 0);

  return NextResponse.json({
    cashDay,
    summary: {
      income,
      expense,
      closingBalance: cashDay.openingBalance + income - expense,
    },
    canManage: user.role === "OWNER",
  });
}
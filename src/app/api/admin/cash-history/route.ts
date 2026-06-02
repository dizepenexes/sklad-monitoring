import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

  const days = await prisma.cashDay.findMany({
    orderBy: {
      date: "desc",
    },
    include: cashDayInclude,
  });

  const result = days.map((day) => {
    const income = day.events
      .filter((event) => event.type === "INCOME")
      .reduce((sum, event) => sum + event.amount, 0);

    const expense = day.events
      .filter((event) => event.type === "EXPENSE")
      .reduce((sum, event) => sum + event.amount, 0);

    return {
      ...day,
      summary: {
        income,
        expense,
        closingBalance: day.openingBalance + income - expense,
      },
    };
  });

  return NextResponse.json({
    days: result,
    canManage: user.role === "OWNER",
  });
}
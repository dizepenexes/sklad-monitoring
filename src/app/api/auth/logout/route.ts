import { prisma } from "@/lib/prisma";
import { sessionCookieName } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;

  if (token) {
    await prisma.session.deleteMany({
      where: { token },
    });
  }

  const response = NextResponse.json({
    message: "Вихід виконано",
  });

  response.cookies.delete(sessionCookieName);

  return response;
}
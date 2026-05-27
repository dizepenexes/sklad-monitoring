import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "Цемент М-500",
        category: "Цемент",
        price: 165,
        stock: 42,
        unit: "мішок",
      },
      {
        name: "Цегла червона",
        category: "Цегла",
        price: 8,
        stock: 2500,
        unit: "шт",
      },
      {
        name: "Пісок",
        category: "Сипучі матеріали",
        price: 750,
        stock: 12,
        unit: "т",
      },
    ],
  });

  console.log("Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
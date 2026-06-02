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
  const testProducts = Array.from({ length: 220 }, (_, index) => ({
    name: `Тестовий товар ${index + 1}`,
    category: index % 2 === 0 ? "Будматеріали" : "Інструменти",
    price: 50 + index * 5,
    stock: 100 + index,
    unit: "шт",
  }));

  await prisma.product.createMany({
    data: testProducts,
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
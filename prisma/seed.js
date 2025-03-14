import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "iPhone 15",
        price: 79999,
        imageUrl: "/products/iphone.png",
        description: "Latest Apple iPhone with A17 chip",
      },
      {
        name: "Samsung S24 Ultra",
        price: 109999,
        imageUrl: "/products/samsung.png",
        description: "Latest Samsung phone with A17 chip",
      },
    ],
  });

  console.log("Products seeded!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

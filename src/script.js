const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const newLink = await prisma.link.create({
    data: {
      description: "description2",
      url: "www.udemy.graphql.com",
    },
  });

  const allLinks = await prisma.link.findMany();
  console.log(allLinks);
}

main()
  .catch((err) => {
    throw err;
  })
  .finally(async () => {
    prisma.$disconnect;
  });

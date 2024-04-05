const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Computer Science" },
        { name: "Software Engineering" },
        { name: "Design" },
        { name: "Music" },
        { name: "Software Development" },
        { name: "Web Development" },
        { name: "Animation" },
        { name: "Machine Learning" },
        { name: "Data Science" },
        { name: "Data Engineering" },
        { name: "Fitness" },
        { name: "Photography" },
        { name: "Accounting" },
        { name: "Engineering" },
        { name: "Filming" },
        { name: "Fashion" },
      ]
    });

    console.log("Success");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();
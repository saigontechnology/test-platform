const { PrismaClient } = require('@prisma/client')
const { users } = require('./data.js')

const prisma = new PrismaClient();

async function seedUsers() {
  try {
    for (let user of users) {
      await prisma.user.create({
        data: user
      });
    }
  } catch (e) {
    console.log("seed error: ", e);
    throw e;
  } finally {
    console.log("seeded")
  }
}

async function main() {
  // ... you will write your Prisma Client queries here
  await seedUsers();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

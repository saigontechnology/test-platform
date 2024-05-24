import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userData = [
  {
    email: "admin@saigontechnology.com",
    password: "$2b$10$TVOsOwK7598FyM0ucTgKe.7meaiLspU9VCOMWQhSGuL2eIodBlHxK",
  },
];

const userRoleData = [
  {
    id: 1,
    name: "Admin",
  },
  {
    id: 2,
    name: "User",
  },
];

const userRoleAssignmentData = [
  {
    userId: 1,
    roleId: 1,
  },
];

async function main() {
  console.log(`Start seeding ...`);

  // Seeding user
  for (const u of userData) {
    await prisma.user.createMany({
      data: u,
    });
  }

  // Seeding user role
  for (const ur of userRoleData) {
    await prisma.userRole.createMany({
      data: ur,
    });
  }

  // Seeding user role assignment
  for (const ura of userRoleAssignmentData) {
    await prisma.userRoleAssignment.createMany({
      data: ura,
    });
  }

  console.log(`Seeding finished.`);
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

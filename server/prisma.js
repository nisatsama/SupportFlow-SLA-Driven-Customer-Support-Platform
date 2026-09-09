require("dotenv").config();
const db = require("./db");

let prisma;

const mockPrisma = {
  user: {
    findUnique: async ({ where }) => {
      if (where.email) {
        return db.findUserByEmail(where.email);
      }
      if (where.id) {
        return db.findUserById(where.id);
      }
      return null;
    },
    create: async ({ data }) => {
      return db.createUser(data);
    },
    findMany: async () => {
      return db.users;
    },
  },
};

if (process.env.DATABASE_URL) {
  try {
    const { PrismaClient } = require("@prisma/client");
    const { PrismaPg } = require("@prisma/adapter-pg");
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    prisma = new PrismaClient({ adapter });
  } catch (err) {
    console.warn("[AI Studio] Database not connected — using mock");
    prisma = mockPrisma;
  }
} else {
  console.warn("[AI Studio] Database not connected — using mock");
  prisma = mockPrisma;
}

module.exports = prisma;

/**
 * Prisma Client Singleton
 * Ensures a single PrismaClient instance is reused across the app.
 */
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

module.exports = prisma;

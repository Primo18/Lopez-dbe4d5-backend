const { PrismaClient } = await import('@prisma/client');

const prisma = new PrismaClient();

export default prisma;

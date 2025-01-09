import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

export async function readProducts(distributorId: string) {
  try {
    const products = await prismaClient.product.findMany({
      where: {
        distributorId,
      },
    });

    return products;
  } catch (error) {
    console.error('Error reading products:', error);

    throw error;
  }
}

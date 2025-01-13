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

export async function createProduct(
  distributorId: string,
  name: string,
  description: string,
  price: number,
  quantity: number,
  imageUrls: string[]
) {
  try {
    await prismaClient.product.create({
      data: {
        distributorId,
        name,
        description,
        price,
        quantity,
        imageUrls,
      },
    });
  } catch (error) {
    console.error('Error creating product:', error);

    throw error;
  }
}

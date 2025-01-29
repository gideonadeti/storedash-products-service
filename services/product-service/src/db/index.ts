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

export async function readProduct(productId: string) {
  try {
    const product = await prismaClient.product.findUnique({
      where: {
        id: productId,
      },
    });

    return product;
  } catch (error) {
    console.error('Error reading product:', error);

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

export async function updateProduct(
  productId: string,
  name: string,
  description: string,
  price: number,
  quantity: number
) {
  try {
    await prismaClient.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        description,
        price,
        quantity,
      },
    });
  } catch (error) {
    console.error('Error updating product:', error);

    throw error;
  }
}

export async function updateProductImageUrls(
  productId: string,
  imageUrls: string[]
) {
  try {
    await prismaClient.product.update({
      where: {
        id: productId,
      },
      data: {
        imageUrls,
      },
    });
  } catch (error) {
    console.error('Error updating product:', error);

    throw error;
  }
}

export async function deleteProduct(productId: string) {
  try {
    await prismaClient.product.delete({
      where: {
        id: productId,
      },
    });
  } catch (error) {
    console.error('Error deleting product:', error);

    throw error;
  }
}

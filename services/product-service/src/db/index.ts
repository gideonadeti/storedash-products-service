import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

export async function readProducts(distributorId: string) {
  try {
    // Fetch products first
    const products = await prismaClient.product.findMany({
      where: { distributorId },
    });

    // Extract unique category and subCategory IDs
    const categoryIds = [...new Set(products.map((p) => p.categoryId))];
    const subCategoryIds = [...new Set(products.map((p) => p.subCategoryId))];

    // Run category and subCategory queries in parallel
    const [categories, subCategories] = await Promise.all([
      prismaClient.category.findMany({ where: { id: { in: categoryIds } } }),
      prismaClient.subCategory.findMany({
        where: { id: { in: subCategoryIds } },
      }),
    ]);

    // Convert arrays to maps for fast lookups
    const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]));
    const subCategoryMap = Object.fromEntries(
      subCategories.map((sc) => [sc.id, sc])
    );

    // Attach category and subCategory objects to products
    return products.map((product) => ({
      ...product,
      category: categoryMap[product.categoryId] || null,
      subCategory: subCategoryMap[product.subCategoryId] || null,
    }));
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
  price: number,
  quantity: number,
  imageUrls: string[],
  categoryId: string,
  subCategoryId: string,
  vat: number,
  isPublished: boolean,
  isOnPromo: boolean,
  sku: string,
  promoPrice?: number,
  promoStartTime?: Date,
  promoEndTime?: Date,
  description?: string
) {
  try {
    const product = await prismaClient.product.create({
      data: {
        distributorId,
        name,
        price,
        quantity,
        imageUrls,
        categoryId,
        subCategoryId,
        vat,
        isPublished,
        isOnPromo,
        sku,
        promoPrice,
        promoStartTime,
        promoEndTime,
        description,
      },
    });

    return product;
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

export const readCategories = async () => {
  try {
    const categories = await prismaClient.category.findMany();

    return categories;
  } catch (error) {
    console.error('Error reading categories:', error);

    throw error;
  }
};

export const readSubCategories = async () => {
  try {
    const subCategories = await prismaClient.subCategory.findMany();

    return subCategories;
  } catch (error) {
    console.error('Error reading subCategories:', error);

    throw error;
  }
};

import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

interface Product {
  distributorId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrls: string[];
  categoryName: string;
  subCategoryName: string;
  vat: number;
  isPublished?: boolean;
  isOnPromo?: boolean;
  sku: string;
  weight: number;
  nafdacRegistrationId: string;
  promoPrice?: number;
  promoStartTime?: Date;
  promoEndTime?: Date;
  description?: string;
}

export async function readProducts(distributorId: string) {
  try {
    // Fetch products first
    const products = await prismaClient.product.findMany({
      where: { distributorId },
    });

    // Extract unique category and subCategory IDs
    const categoryNames = [...new Set(products.map((p) => p.categoryName))];
    const subCategoryNames = [
      ...new Set(products.map((p) => p.subCategoryName)),
    ];

    // Run category and subCategory queries in parallel
    const [categories, subCategories] = await Promise.all([
      prismaClient.category.findMany({
        where: { name: { in: categoryNames } },
      }),
      prismaClient.subCategory.findMany({
        where: { name: { in: subCategoryNames } },
      }),
    ]);

    // Convert arrays to maps for fast lookups
    const categoryMap = Object.fromEntries(categories.map((c) => [c.name, c]));
    const subCategoryMap = Object.fromEntries(
      subCategories.map((sc) => [sc.name, sc])
    );

    // Attach category and subCategory objects to products
    return products.map((product) => ({
      ...product,
      category: categoryMap[product.categoryName] || null,
      subCategory: subCategoryMap[product.subCategoryName] || null,
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

export async function createProduct({
  distributorId,
  name,
  price,
  quantity,
  imageUrls,
  categoryName,
  subCategoryName,
  vat,
  isPublished,
  isOnPromo,
  sku,
  weight,
  nafdacRegistrationId,
  promoPrice,
  promoStartTime,
  promoEndTime,
  description,
}: Product) {
  try {
    const product = await prismaClient.product.create({
      data: {
        distributorId,
        name,
        price,
        quantity,
        imageUrls,
        categoryName,
        subCategoryName,
        vat,
        isPublished,
        isOnPromo,
        sku,
        weight,
        nafdacRegistrationId,
        promoPrice,
        promoStartTime,
        promoEndTime,
        description,
      },
    });

    const [category, subCategory] = await Promise.all([
      prismaClient.category.findUnique({
        where: {
          id: product.categoryName,
        },
      }),
      prismaClient.subCategory.findUnique({
        where: {
          id: product.subCategoryName,
        },
      }),
    ]);

    return { ...product, category, subCategory };
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

export const readCategoryNames = async () => {
  try {
    const categories = await prismaClient.category.findMany({
      select: { name: true },
    });

    return categories.map((c) => c.name);
  } catch (error) {
    console.error('Error reading category names:', error);

    throw error;
  }
};

export const readSubCategoryNames = async () => {
  try {
    const subCategories = await prismaClient.subCategory.findMany({
      select: { name: true },
    });

    return subCategories.map((c) => c.name);
  } catch (error) {
    console.error('Error reading subCategory names:', error);

    throw error;
  }
};

export const readSkus = async () => {
  try {
    const skus = await prismaClient.product.findMany({
      select: { sku: true },
    });

    return skus.map((c) => c.sku);
  } catch (error) {
    console.error('Error reading skus:', error);

    throw error;
  }
};

export const createProducts = async (products: Product[]) => {
  try {
    await prismaClient.product.createMany({
      data: products,
    });
  } catch (error) {
    console.error('Error creating products:', error);

    throw error;
  }
};

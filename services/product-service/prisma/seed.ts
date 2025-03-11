import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categoriesWithSubcategories = [
  {
    name: 'Electronics',
    subcategories: [
      'Smartphones',
      'Laptops',
      'Gaming Consoles',
      'Tablets',
      'Cameras',
      'Headphones',
      'Smartwatches',
      'Drones',
      'TVs',
      'Speakers',
    ],
  },
  {
    name: 'Fashion',
    subcategories: [
      "Men's Clothing",
      "Women's Clothing",
      'Shoes & Footwear',
      'Bags & Accessories',
      'Watches',
      'Sunglasses',
      'Jewelry',
      'Sportswear',
    ],
  },
  {
    name: 'Home & Kitchen',
    subcategories: [
      'Furniture',
      'Kitchen Appliances',
      'Home Decor',
      'Bedding & Linens',
      'Storage & Organization',
      'Cleaning Supplies',
      'Lighting',
    ],
  },
  {
    name: 'Beauty & Personal Care',
    subcategories: [
      'Skincare',
      'Haircare',
      'Makeup',
      'Fragrances',
      'Grooming Kits',
      'Nail Care',
      'Oral Care',
      'Bath & Body',
    ],
  },
  {
    name: 'Sports & Outdoors',
    subcategories: [
      'Exercise Equipment',
      'Bicycles',
      'Outdoor Gear',
      'Camping Equipment',
      'Sports Apparel',
      'Water Sports',
      'Hiking Gear',
    ],
  },
  {
    name: 'Automotive',
    subcategories: [
      'Car Accessories',
      'Motorcycle Accessories',
      'Tires & Wheels',
      'Vehicle Electronics',
      'Oils & Fluids',
      'Safety & Security',
    ],
  },
  {
    name: 'Health & Wellness',
    subcategories: [
      'Fitness & Supplements',
      'Medical Supplies',
      'Personal Hygiene',
      'Wellness Devices',
      'First Aid',
      'Nutrition',
    ],
  },
  {
    name: 'Toys & Games',
    subcategories: [
      'Board Games',
      'Action Figures',
      'Puzzles',
      'Dolls',
      'Educational Toys',
      'RC Toys',
      'Building Blocks',
      'Stuffed Animals',
    ],
  },
  {
    name: 'Books & Stationery',
    subcategories: [
      'Fiction Books',
      'Non-Fiction Books',
      'Educational Books',
      'Notebooks & Journals',
      'Office Supplies',
      'Art Supplies',
    ],
  },
  {
    name: 'Groceries & Beverages',
    subcategories: [
      'Fresh Produce',
      'Dairy & Eggs',
      'Snacks & Sweets',
      'Beverages',
      'Meat & Seafood',
      'Grains & Pasta',
      'Canned Goods',
    ],
  },
  {
    name: 'Baby & Kids',
    subcategories: [
      'Baby Clothing',
      'Diapers & Wipes',
      'Feeding & Nursing',
      'Baby Gear',
      'Toys for Babies',
      'Kids’ Fashion',
      'School Supplies',
    ],
  },
  {
    name: 'Pet Supplies',
    subcategories: [
      'Pet Food',
      'Pet Toys',
      'Pet Grooming',
      'Pet Beds & Carriers',
      'Pet Health & Wellness',
      'Pet Accessories',
    ],
  },
];

async function seedDatabase() {
  console.log('Seeding categories and subcategories...');

  for (const categoryData of categoriesWithSubcategories) {
    const category = await prisma.category.create({
      data: {
        name: categoryData.name,
      },
    });

    await prisma.subCategory.createMany({
      data: categoryData.subcategories.map((name) => ({
        name,
        categoryId: category.id,
      })),
    });

    console.log(`Inserted category: ${category.name}`);
  }

  console.log('✅ Database seeding complete!');
}

seedDatabase()
  .catch((error) => {
    console.error('Error seeding database:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

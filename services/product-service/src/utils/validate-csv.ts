import Papa from 'papaparse';
import { readCategoryNames, readSkus, readSubCategoryNames } from '../db';

interface CsvRow {
  name: string;
  description?: string;
  categoryName: string;
  subCategoryName: string;
  sku: string;
  vat: number;
  price: number;
  quantity: number;
  weight?: number;
  nafdacRegistrationId: string;
  imageUrls?: string;
  tags?: string;
}

interface ValidationError {
  row: number;
  message: string;
}

const validateCsv = async (csvText: string) => {
  const { data, errors } = Papa.parse<CsvRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (errors.length > 0) {
    throw new Error('CSV parsing errors detected.');
  }

  const requiredFields = [
    'name',
    'categoryName',
    'subCategoryName',
    'sku',
    'vat',
    'price',
    'quantity',
    'nafdacRegistrationId',
  ];

  const categoryNames = await readCategoryNames();
  const subCategories = await readSubCategoryNames();
  const skus = await readSkus();

  const categorySet = new Set(categoryNames);
  const subCategorySet = new Set(subCategories);
  const skuSet = new Set(skus);

  const validationErrors: ValidationError[] = [];

  data.forEach((row, index) => {
    const rowIndex = index + 2; // Account for headers

    // Check required fields
    for (const field of requiredFields) {
      if (!(row as any)[field]) {
        validationErrors.push({
          row: rowIndex,
          message: `${field} is required.`,
        });
      }
    }

    // Validate category and subCategory
    if (row.categoryName && !categorySet.has(row.categoryName)) {
      validationErrors.push({
        row: rowIndex,
        message: 'Invalid categoryName.',
      });
    }
    if (row.subCategoryName && !subCategorySet.has(row.subCategoryName)) {
      validationErrors.push({
        row: rowIndex,
        message: 'Invalid subCategoryName.',
      });
    }

    // Validate SKU uniqueness
    if (skuSet.has(row.sku)) {
      validationErrors.push({ row: rowIndex, message: 'SKU already exists.' });
    }

    // Validate VAT
    if (row.vat && (row.vat < 0 || row.vat > 100)) {
      validationErrors.push({
        row: rowIndex,
        message: 'VAT must be between 0 and 100.',
      });
    }

    // Validate numeric fields
    if (row.price && isNaN(Number(row.price))) {
      validationErrors.push({
        row: rowIndex,
        message: 'Price must be a number.',
      });
    }
    if (row.quantity && isNaN(Number(row.quantity))) {
      validationErrors.push({
        row: rowIndex,
        message: 'Quantity must be a number.',
      });
    }
    if (row.weight && isNaN(Number(row.weight))) {
      validationErrors.push({
        row: rowIndex,
        message: 'Weight must be a number.',
      });
    }

    // Validate imageUrls
    if (row.imageUrls) {
      const urls = row.imageUrls.split(',').map((url) => url.trim());

      urls.forEach((url) => {
        try {
          new URL(url);
        } catch (_) {
          validationErrors.push({
            row: rowIndex,
            message: 'Invalid image URL.',
          });
        }
      });
    }
  });

  if (validationErrors.length > 0) {
    throw validationErrors;
  }

  return data;
};

export default validateCsv;

import dotenv from 'dotenv';
import fs from 'fs';
import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { body, query, param, validationResult } from 'express-validator';

import {
  createProduct,
  readProducts,
  readProduct,
  updateProduct,
  updateProduct2,
  deleteProduct,
} from '../db/index';

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImages(files: Express.Multer.File[]) {
  const uploadPromises = files.map(async (file) => {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'product-images',
    });

    fs.unlinkSync(file.path);

    return result.secure_url;
  });

  return await Promise.all(uploadPromises);
}

export const handleProductsPost = [
  query('distributorId')
    .trim()
    .notEmpty()
    .withMessage('distributorId is required')
    .escape(),
  body('name').trim().notEmpty().withMessage('name is required').escape(),
  body('price')
    .trim()
    .notEmpty()
    .withMessage('price is required')
    .isFloat({ min: 0 })
    .withMessage('price must be a valid number greater than or equal to 0'),
  body('quantity')
    .trim()
    .notEmpty()
    .withMessage('quantity is required')
    .isInt({ min: 0 })
    .withMessage('quantity must be a valid integer greater than or equal to 0'),
  body('description').optional().trim().escape(),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });

      return;
    }

    const { distributorId } = req.query;
    const { name, description, price, quantity } = req.body;
    const files = req.files;

    let imageUrls: string[] = [];

    try {
      if (Array.isArray(files) && files.length > 0) {
        imageUrls = await uploadImages(files);
      }

      await createProduct(
        distributorId as string,
        name.trim(),
        description?.trim(),
        parseFloat(price),
        parseInt(quantity, 10),
        imageUrls
      );

      res.status(201).json({ message: 'Product created successfully' });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ errMsg: 'Error creating product' });
    }
  },
];

export const handleProductsGet = [
  query('distributorId')
    .trim()
    .notEmpty()
    .withMessage('distributorId is required')
    .escape(),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });

      return;
    }

    const { distributorId } = req.query;

    try {
      const products = await readProducts(distributorId as string);

      res.json({ products });
    } catch (error) {
      console.error('Error reading products:', error);
      res.status(500).json({ errMsg: 'Error reading products' });
    }
  },
];

export const handleProductGet = [
  param('productId')
    .trim()
    .notEmpty()
    .withMessage('productId is required')
    .escape(),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });

      return;
    }

    const { productId } = req.params;

    try {
      const product = await readProduct(productId);

      res.json({ product });
    } catch (error) {
      console.error('Error reading product:', error);
      res.status(500).json({ errMsg: 'Error reading product' });
    }
  },
];

export const handleProductsPut = [
  param('productId')
    .trim()
    .notEmpty()
    .withMessage('productId is required')
    .escape(),
  body('name').trim().notEmpty().withMessage('name is required').escape(),
  body('price')
    .trim()
    .notEmpty()
    .withMessage('price is required')
    .isFloat({ min: 0 })
    .withMessage('price must be a valid number greater than or equal to 0'),
  body('quantity')
    .trim()
    .notEmpty()
    .withMessage('quantity is required')
    .isInt({ min: 0 })
    .withMessage('quantity must be a valid integer greater than or equal to 0'),
  body('description').optional().trim().escape(),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });

      return;
    }

    const { productId } = req.params;
    const { name, description, price, quantity } = req.body;

    try {
      await updateProduct(
        productId,
        name.trim(),
        description?.trim(),
        parseFloat(price),
        parseInt(quantity)
      );

      res.json({ message: 'Product updated successfully' });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ errMsg: 'Error updating product' });
    }
  },
];

export const handleProductsPatch = [
  param('productId')
    .trim()
    .notEmpty()
    .withMessage('productId is required')
    .escape(),
  body('imageUrls')
    .optional()
    .isArray()
    .withMessage('imageUrls must be an array'),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });

      return;
    }

    const { productId } = req.params;
    const { imageUrls } = req.body;
    const files = req.files;

    if (!productId) {
      res.status(400).json({ errMsg: 'productId is required' });

      return;
    }

    try {
      const existingProduct = await readProduct(productId);

      if (!existingProduct) {
        res.status(404).json({ status: 'error', errMsg: 'Invalid productId' });

        return;
      }

      if (imageUrls && imageUrls.length > 0) {
        await Promise.all(
          imageUrls.map((url: string) => cloudinary.uploader.destroy(url))
        );

        const updatedImageUrls = existingProduct.imageUrls.filter(
          (url) => !imageUrls.includes(url)
        );

        await updateProduct2(productId, updatedImageUrls);

        res.json({ msg: 'Images removed successfully' });

        return;
      } else if (Array.isArray(files) && files.length > 0) {
        if (existingProduct.imageUrls.length + files.length > 5) {
          res.status(400).json({
            errMsg: 'Cannot upload more than 5 images',
          });

          return;
        }

        const newImageUrls = await uploadImages(files);
        const updatedImageUrls = [
          ...existingProduct.imageUrls,
          ...newImageUrls,
        ];

        await updateProduct2(productId, updatedImageUrls);

        res.json({ message: 'Images uploaded successfully' });
      }
    } catch (error) {
      console.error('Error updating product images:', error);
      res.status(500).json({ errMsg: 'Error updating product images' });
    }
  },
];

export const handleProductsDelete = [
  param('productId')
    .trim()
    .notEmpty()
    .withMessage('productId is required')
    .escape(),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });

      return;
    }

    const { productId } = req.params;

    try {
      await deleteProduct(productId);

      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ errMsg: 'Error deleting product' });
    }
  },
];

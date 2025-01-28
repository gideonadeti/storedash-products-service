import dotenv from 'dotenv';
import fs from 'fs';
import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';

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

export async function handleProductsPost(req: Request, res: Response) {
  try {
    const { distributorId } = req.query;
    const { name, description, price, quantity } = req.body;
    const files = req.files;

    if (!distributorId || !name || !price || !quantity) {
      res
        .status(400)
        .json({ errMsg: 'distributorId, name, price, quantity is required' });

      return;
    }

    let imageUrls: string[] = [];

    if (Array.isArray(files) && files.length > 0) {
      imageUrls = await uploadImages(files);
    }

    await createProduct(
      distributorId as string,
      name.trim(),
      description?.trim(),
      parseFloat(price),
      parseInt(quantity),
      imageUrls
    );

    res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ errMsg: 'Error creating product' });
  }
}

export async function handleProductsGet(req: Request, res: Response) {
  const { distributorId } = req.query;

  if (!distributorId) {
    res
      .status(400)
      .json({ status: 'error', errMsg: 'distributorId is required' });

    return;
  }

  try {
    const products = await readProducts(distributorId as string);

    res.status(200).json({ products });
  } catch (error) {
    console.error('Error reading products:', error);
    res.status(500).json({ errMsg: 'Error reading products' });
  }
}

export async function handleProductGet(req: Request, res: Response) {
  const { productId } = req.params;

  if (!productId) {
    res.status(400).json({
      errMsg: 'productId is required',
    });
  }

  try {
    const product = await readProduct(productId);

    res.json({ product });

    return;
  } catch (error) {
    console.error('Error reading product:', error);
    res.status(500).json({ errMsg: 'Error reading product' });
  }
}

export async function handleProductsPut(req: Request, res: Response) {
  const { productId } = req.params;
  const { name, description, price, quantity } = req.body;

  if (!productId || !name || !price || !quantity) {
    res
      .status(400)
      .json({ errMsg: 'productId, name, price, and quantity are required' });

    return;
  }

  try {
    await updateProduct(
      productId,
      name.trim(),
      description?.trim(),
      parseFloat(price),
      parseInt(quantity)
    );

    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ errMsg: 'Error updating product' });
  }
}

export async function handleProductsPatch(req: Request, res: Response) {
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
        imageUrls.map(async (url: string) => {
          await cloudinary.uploader.destroy(url);
        })
      );

      const updatedImageUrls = existingProduct.imageUrls.filter(
        (url) => !imageUrls.includes(url)
      );

      await updateProduct2(productId, updatedImageUrls);

      res.json({ msg: 'Images removed successfully' });

      return;
    }

    if (Array.isArray(files) && files.length > 0) {
      if (existingProduct.imageUrls.length + files.length > 5) {
        res.status(400).json({
          errMsg: 'Cannot upload more than 5 images',
        });

        return;
      }

      const newImageUrls = await uploadImages(files);
      const updatedImageUrls = [...existingProduct.imageUrls, ...newImageUrls];

      await updateProduct2(productId, updatedImageUrls);

      res.status(200).json({ message: 'Images uploaded successfully' });
    }
  } catch (error) {
    console.error('Error updating product images:', error);
    res.status(500).json({ errMsg: 'Error updating product images' });
  }
}

export async function handleProductsDelete(req: Request, res: Response) {
  const { productId } = req.params;

  if (!productId) {
    res.status(400).json({ status: 'error', errMsg: 'productId is required' });

    return;
  }

  try {
    await deleteProduct(productId);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ errMsg: 'Error deleting product' });
  }
}

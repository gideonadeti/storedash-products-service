import dotenv from 'dotenv';
import fs from 'fs';
import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';

import { createProduct } from '../db/index';

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function handleProductsPost(req: Request, res: Response) {
  const { distributorId, name, description, price, quantity } = req.body;
  const files = req.files;

  if (!distributorId || !name || !price || !quantity) {
    res
      .status(400)
      .json({ errMsg: 'distributorId, name, price, quantity is required' });
    return;
  }

  let imageUrls: string[] = [];

  if (Array.isArray(files) && files.length > 0) {
    const uploadPromises = files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'product-images',
      });

      fs.unlinkSync(file.path);

      return result;
    });

    try {
      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map((result) => result.secure_url);
    } catch (error) {
      console.error('Error uploading images:', error);
      res.status(500).json({ errMsg: 'Error uploading images' });
      return;
    }
  }

  try {
    await createProduct(
      distributorId,
      name,
      description,
      +price,
      +quantity,
      imageUrls
    );

    res.status(201).json({ msg: 'Product created successfully' });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ errMsg: 'Error creating product' });
    return;
  }
}

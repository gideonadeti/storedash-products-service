import { z } from 'zod';

export const createRetailerDto = z.object({
  storeName: z.string(),
  storeAddress: z.string().max(50),
  ownerName: z.string(),
  profileImage: z.string().url().optional(),
});

export const updateRetailerDto = z.object({
  storeName: z.string().optional(),
  storeAddress: z.string().max(50).optional(),
  ownerName: z.string().max(50).optional(),
  profileImage: z.string().url().optional(),
});

export const getRetailersDto = z.object({
  storeName: z.string().optional(),
  email: z.string().optional(),
  ownerName: z.string().optional(),
  phoneNumber: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

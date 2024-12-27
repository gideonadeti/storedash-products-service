import { z } from 'zod';

export const createAuthUserDto = z
  .object({
    email: z.string().email().optional(),
    phoneNumber: z.string().min(10).max(15).optional(),
    password: z.string().min(8).optional(),
    role: z.enum(['ADMIN', 'DRIVER', 'DISTRIBUTOR', 'RETAILER']),
  })
  .refine((data) => (data.email && data.password) || data.phoneNumber, {
    message: 'Either email and password or phone number is required',
    path: ['email', 'password', 'phoneNumber'],
  });

export const updateAuthUserDto = z.object({
  email: z.string().email().optional(),
  phoneNumber: z.string().min(10).max(15).optional(),
  password: z.string().min(8).optional(),
});

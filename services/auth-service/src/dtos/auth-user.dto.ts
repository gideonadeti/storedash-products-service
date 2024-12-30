import { z } from 'zod';

export const ROLE_ENUM = z.enum(['ADMIN', 'DRIVER', 'DISTRIBUTOR', 'RETAILER']);
const ACCOUNT_STATUS_ENUM = z.enum([
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED',
  'DELETED',
  'UNVERIFIED',
  'PENDING_APPROVAL',
]);
export const createAuthUserDto = z
  .object({
    email: z.string().email().optional(),
    phoneNumber: z.string().min(10).max(15).optional(),
    password: z.string().min(8).optional(),
    role: ROLE_ENUM,
    accountStatus: ACCOUNT_STATUS_ENUM.optional(),
  })
  .refine((data) => (data.email && data.password) || data.phoneNumber, {
    message: 'Either email and password or phone number is required',
    path: ['email', 'password', 'phoneNumber'],
  });

export const updateAuthUserDto = z.object({
  email: z.string().email().optional(),
  phoneNumber: z.string().min(10).max(15).optional(),
  password: z.string().min(8).optional(),
  accountStatus: ACCOUNT_STATUS_ENUM.optional(),
});

export const verifyOtpDto = z.object({
  to: z.string(),
  sid: z.string(),
  accountId: z.string(),
  code: z.string(),
});

export const accountIdParamDto = z.object({
  accountId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectID format'),
});

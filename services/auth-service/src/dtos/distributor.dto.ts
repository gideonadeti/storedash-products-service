import { z } from 'zod';

export const createDistributorDto = z.object({
  businessName: z.string(),
  businessEmailAdress: z.string().email(),
  businessPhoneNumber: z.string(),
  landmark: z.string(),
  businessLogo: z.string().url(),
  serviceUserAgreement: z.string(),
});

export const updateDistributorDto = z.object({
  businessName: z.string().optional(),
  businessEmailAdress: z.string().email().optional(),
  businessPhoneNumber: z.string().optional(),
  landmark: z.string().optional(),
  businessLogo: z.string().url().optional(),
  serviceUserAgreement: z.string().optional(),
});

export const getDistributorsDto = z.object({
  businessName: z.string().optional(),
  businessEmailAdress: z.string().optional(),
  businessPhoneNumber: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

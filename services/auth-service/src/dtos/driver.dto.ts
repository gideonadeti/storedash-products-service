import { z } from 'zod';

export const createDriverDto = z
  .object({
    fullName: z.string(),
    nin: z.string(),
    type: z.enum(['DISTRIBUTOR', 'INDEPENDENT']),
    address: z.string(),
    TnCSigned: z.boolean(),
    consentToBackgroundSearch: z.boolean(),
    distributorId: z.string().optional(),
  })
  .refine((data) => data.type !== 'DISTRIBUTOR' || data.distributorId, {
    message: 'Distributor id is required when driver type is distributor',
    path: ['distributorId'],
  });

export const updateDriverDto = z.object({
  fullName: z.string().optional(),
  nin: z.string().optional(),
  address: z.string().optional(),
});

export const addGuarantorToDriverDto = z.object({
  name: z.string(),
  phoneNumber: z.string(),
  email: z.string().email().optional(),
  residentialAddress: z.string(),
  driverId: z.string(),
});

export const addDriverVehicleDto = z.object({
  driverAccountId: z.string(),
  model: z.string(),
  plateNumber: z.string(),
  color: z.string(),
});

export const updateDriverVehicleDto = z.object({
  driverId: z.string(),
  model: z.string().optional(),
  plateNumber: z.string().optional(),
  color: z.string().optional(),
});

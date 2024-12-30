import { z } from 'zod';
import prisma from '../config/database';
import { createRetailerDto, updateRetailerDto } from '../dtos/retailer.dto';

const createProfile = async (
  data: z.infer<typeof createRetailerDto> & { accountId: string }
) => {
  const profile = await prisma.retailer.create({
    data,
  });
  return profile;
};

const getByAccountId = async (accId: string) => {
  const retailerProfile = await prisma.retailer.findFirst({
    where: {
      accountId: accId,
    },
    include: {
      user: {
        select: { email: true, phoneNumber: true },
      },
    },
  });
  return retailerProfile;
};

const updateProfile = async (
  accountId: string,
  data: z.infer<typeof updateRetailerDto>
) => {
  const updatedProfile = await prisma.retailer.update({
    where: {
      accountId,
    },
    data: data,
  });
  return updatedProfile;
};
const retailer = {
  getByAccountId,
  createProfile,
  updateProfile,
};
export default retailer;

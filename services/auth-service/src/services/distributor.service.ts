import { Distributor } from './../../../../node_modules/.pnpm/@prisma+client@6.1.0_prisma@6.1.0/node_modules/.prisma/client/index.d';
import { z } from 'zod';
import prisma from '../config/database';
import { createRetailerDto, updateRetailerDto } from '../dtos/retailer.dto';
import {
  createDistributorDto,
  updateDistributorDto,
} from '../dtos/distributor.dto';

const createProfile = async (
  data: z.infer<typeof createDistributorDto> & { accountId: string }
) => {
  const profile = await prisma.distributor.create({
    data,
  });
  return profile;
};

const getByAccountId = async (accId: string) => {
  const distributorProfile = await prisma.distributor.findFirst({
    where: {
      accountId: accId,
    },
    include: {
      user: {
        select: { email: true, phoneNumber: true },
      },
    },
  });
  return distributorProfile;
};

const updateProfile = async (
  accountId: string,
  data: z.infer<typeof updateDistributorDto>
) => {
  const updatedProfile = await prisma.distributor.update({
    where: {
      accountId,
    },
    data: data,
  });
  return updatedProfile;
};
const distributor = {
  getByAccountId,
  createProfile,
  updateProfile,
};
export default distributor;

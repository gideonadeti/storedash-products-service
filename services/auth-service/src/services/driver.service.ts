import { z } from 'zod';
import prisma from '../config/database';

import {
  addDriverVehicleDto,
  createDriverDto,
  updateDriverDto,
} from '../dtos/driver.dto';

const createProfile = async (
  data: z.infer<typeof createDriverDto> & { accountId: string }
) => {
  const profile = await prisma.driver.create({
    data,
  });
  return profile;
};

const getByAccountId = async (accId: string) => {
  const driverProfile = await prisma.driver.findFirst({
    where: {
      accountId: accId,
    },
    include: {
      user: {
        select: { email: true, phoneNumber: true },
      },
    },
  });
  return driverProfile;
};

const updateProfile = async (
  accountId: string,
  data: z.infer<typeof updateDriverDto>
) => {
  const updatedProfile = await prisma.driver.update({
    where: {
      accountId,
    },
    data: data,
  });
  return updatedProfile;
};

const addVehicle = async (
  data: Omit<z.infer<typeof addDriverVehicleDto>, 'driverAccountId'> & {
    driverId: string;
  }
) => {
  const profile = await prisma.vehicle.create({
    data: {
      color: data.color,
      driverId: data.driverId,
      model: data.model,
      plateNumber: data.plateNumber,
    },
  });
  return profile;
};
const getVehicleByAccId = async (driverId: string) => {
  const driverProfile = await prisma.vehicle.findFirst({
    where: {
      driverId,
    },
  });
  return driverProfile;
};
const driver = {
  getByAccountId,
  createProfile,
  updateProfile,
  addVehicle,
  getVehicleByAccId,
};
export default driver;

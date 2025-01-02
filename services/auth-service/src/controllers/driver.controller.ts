import { Request, Response } from 'express';
import CustomError from '../config/errors/CustomError';

import { getAuthUserById } from '../services/auth-user.service';
import distributorService from '../services/distributor.service';
import { accountIdParamDto } from '../dtos/auth-user.dto';
import {
  createDistributorDto,
  updateDistributorDto,
} from '../dtos/distributor.dto';
import {
  addDriverVehicleDto,
  createDriverDto,
  updateDriverDto,
  updateDriverVehicleDto,
} from '../dtos/driver.dto';
import driverService from '../services/driver.service';

export const createDriverProfile = async (req: Request, res: Response) => {
  const {
    TnCSigned,
    address,
    consentToBackgroundSearch,
    fullName,
    nin,
    type,
    distributorId,
  } = createDriverDto.parse(req.body);
  const { accountId } = accountIdParamDto.parse(req.params);

  const authUser = await getAuthUserById(accountId);
  if (!authUser) {
    throw new CustomError('User id not found', 405);
  }
  const profileExist = !!(await driverService.getByAccountId(accountId));
  if (profileExist) {
    throw new CustomError('Driver profile exists for this accountId', 405);
  }
  const driverAccount = await driverService.createProfile({
    TnCSigned,
    address,
    consentToBackgroundSearch,
    fullName,
    nin,
    type,
    distributorId,
    accountId: accountId,
  });
  res.status(201).json({
    message: 'Driver profile created successfully',
    data: {
      phoneNumber: authUser.phoneNumber,
      email: authUser.email,
      ...driverAccount,
    },
  });
};

export const getDriverProfileByUid = async (req: Request, res: Response) => {
  const { accountId } = accountIdParamDto.parse(req.params);
  const driverProfile = await driverService.getByAccountId(accountId);

  if (!driverProfile) throw new CustomError('Driver  profile not found', 404);

  res.status(201).json({
    data: {
      ...driverProfile,
    },
  });
};

export const updateDriverProfile = async (req: Request, res: Response) => {
  const updates = updateDriverDto.parse(req.body);
  const { accountId } = accountIdParamDto.parse(req.params);

  const retailerProfile = await driverService.updateProfile(accountId, updates);
  res.json({
    message: 'Driver profile updated',
    data: retailerProfile,
  });
};

export const getDriverVehicleData = async (req: Request, res: Response) => {
  // const { accountId } = accountIdParamDto.parse(req.body);
  const { accountId } = req.body;

  const driver = await driverService.getByAccountId(accountId);
  if (!driver) {
    throw new CustomError('Driver with associated id not found', 404);
  }
  const vehicleData = await driverService.getVehicleByAccId(driver.id);

  if (!vehicleData)
    throw new CustomError('Vehicle not associated with driver', 404);

  const { driverId, ...data } = vehicleData;

  res.status(201).json({
    data,
  });
};

export const addVehicleData = async (req: Request, res: Response) => {
  const vehicle = addDriverVehicleDto.parse(req.body);

  const driver = await driverService.getByAccountId(vehicle.driverAccountId);
  if (!driver) {
    throw new CustomError('Driver with aassociated id not found', 404);
  }

  const driverHasVehicles = await driverService.getVehicleByAccId(driver.id);
  if (!!driverHasVehicles) {
    throw new CustomError('Driver already associated with a vehicle', 400);
  }

  const vehicleDetails = await driverService.addVehicle({
    ...vehicle,
    driverId: driver.id,
  });
  const { driverId, ...data } = vehicleDetails;

  res.json({
    message: 'Vehicle linked to driver',
    data,
  });
};

export const updateVehicleData = async (req: Request, res: Response) => {
  const { accountId } = accountIdParamDto.parse(req.params);
  const vehicle = updateDriverVehicleDto.parse(req.body);
};

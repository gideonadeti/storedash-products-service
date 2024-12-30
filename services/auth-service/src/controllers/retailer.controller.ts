import { updateRetailerDto } from './../dtos/retailer.dto';
import { Request, Response } from 'express';
import CustomError from '../config/errors/CustomError';

import { createRetailerDto } from '../dtos/retailer.dto';
import { getAuthUserById } from '../services/auth-user.service';
import rtService from '../services/retailer.service';
import { accountIdParamDto } from '../dtos/auth-user.dto';

export const createRetailProfile = async (req: Request, res: Response) => {
  const { ownerName, storeAddress, storeName, profileImage } =
    createRetailerDto.parse(req.body);
  const { accountId } = accountIdParamDto.parse(req.params);
  // const { accountId } = req.params;

  const authUser = await getAuthUserById(accountId);
  if (!authUser) {
    throw new CustomError('User id not found', 405);
  }
  const profileExist = !!(await rtService.getByAccountId(accountId));
  if (profileExist) {
    throw new CustomError('Retailer profile exists for this accountId', 405);
  }
  const newRetailAccount = await rtService.createProfile({
    ownerName,
    storeAddress,
    storeName,
    accountId: accountId,
  });
  res.status(201).json({
    message: 'Retailer profile created successfully',
    data: {
      id: newRetailAccount.accountId,
      phoneNumber: authUser.phoneNumber,
      email: authUser.email,
      createdAt: newRetailAccount.createdAt,
      storeName,
      storeAddress,
      ownerName,
      profileImage,
    },
  });
};

export const getRetailerProfileByUid = async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;
    const retailerProfile = await rtService.getByAccountId(accountId);

    if (!retailerProfile)
      throw new CustomError('Retailer  profile not found', 404);

    res.status(201).json({
      data: {
        id: retailerProfile.accountId,
        ownerName: retailerProfile.ownerName,
        storeName: retailerProfile.storeName,
        storeAddress: retailerProfile.storeAddress,
        profileImage: retailerProfile.profileImage,
        createdAt: retailerProfile.createdAt,
        email: retailerProfile.user.email,
        phoneNumber: retailerProfile.user.phoneNumber,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      error:
        error.message || 'An error occurred while adding the retailer profile',
    });
  }
};

export const updateRetailerProfile = async (req: Request, res: Response) => {
  const updates = updateRetailerDto.parse(req.body);
  const { accountId } = req.params;

  const retailerProfile = await rtService.updateProfile(accountId, updates);
  res.json({
    message: 'Retailer profile updated',
    data: retailerProfile,
  });
};

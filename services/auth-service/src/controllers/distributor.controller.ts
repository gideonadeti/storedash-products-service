import { Request, Response } from 'express';
import CustomError from '../config/errors/CustomError';

import { getAuthUserById } from '../services/auth-user.service';
import distributorService from '../services/distributor.service';
import { accountIdParamDto } from '../dtos/auth-user.dto';
import {
  createDistributorDto,
  updateDistributorDto,
} from '../dtos/distributor.dto';

export const createDistributorProfile = async (req: Request, res: Response) => {
  const {
    businessEmailAdress,
    businessLogo,
    businessName,
    businessPhoneNumber,
    landmark,
    serviceUserAgreement,
  } = createDistributorDto.parse(req.body);
  const { accountId } = accountIdParamDto.parse(req.params);

  const authUser = await getAuthUserById(accountId);
  if (!authUser) {
    throw new CustomError('User id not found', 405);
  }
  const profileExist = !!(await distributorService.getByAccountId(accountId));
  if (profileExist) {
    throw new CustomError('Distributor profile exists for this accountId', 405);
  }
  const newDistributorAccount = await distributorService.createProfile({
    businessEmailAdress,
    businessLogo,
    businessName,
    businessPhoneNumber,
    landmark,
    serviceUserAgreement,
    accountId: accountId,
  });
  res.status(201).json({
    message: 'Distributor profile created successfully',
    data: {
      accountId: newDistributorAccount.accountId,
      phoneNumber: authUser.phoneNumber,
      email: authUser.email,
      createdAt: newDistributorAccount.createdAt,
      businessEmailAdress,
      businessLogo,
      businessName,
      businessPhoneNumber,
      landmark,
    },
  });
};

export const getDistributorProfileByUid = async (
  req: Request,
  res: Response
) => {
  try {
    const { accountId } = accountIdParamDto.parse(req.params);
    const distributorProfile =
      await distributorService.getByAccountId(accountId);

    if (!distributorProfile)
      throw new CustomError('Distributor  profile not found', 404);
    const { serviceUserAgreement, id, user, ...others } = distributorProfile;
    res.status(201).json({
      data: {
        id: distributorProfile.accountId,
        email: distributorProfile.user.email,
        phoneNumber: distributorProfile.user.phoneNumber,
        ...others,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      error:
        error.message || 'An error occurred while adding the retailer profile',
    });
  }
};

export const updateDistributorerProfile = async (
  req: Request,
  res: Response
) => {
  const updates = updateDistributorDto.parse(req.body);
  const { accountId } = accountIdParamDto.parse(req.params);

  const retailerProfile = await distributorService.updateProfile(
    accountId,
    updates
  );
  res.json({
    message: 'Distributorer profile updated',
    data: retailerProfile,
  });
};

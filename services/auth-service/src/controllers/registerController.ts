import { Request, Response } from 'express';
import RegistrationService from '../services/registrationService';
import RetailerProfileService from '../services/profileService';
import authTokenService from '../services/authTokenService';
import twilioService from '../services/twilioService';
import UserAuth from '../models/userAuth';
import CustomError from '../config/errors/CustomError';

export const registerDriver = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, email, password } = req.body;

    // Call the service to register a driver
    const newDriver = await RegistrationService.registerDriver({
      phoneNumber,
      email,
      password,
      role: 'driver', // Hardcoded to ensure this endpoint is only for drivers
    });

    res.status(201).json({
      message: 'Driver registered successfully',
      data: {
        id: newDriver.id,
        phoneNumber: newDriver.phoneNumber,
        email: newDriver.email,
        role: newDriver.role,
        createdAt: newDriver.createdAt,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      error: error.message || 'An error occurred while registering the driver',
    });
  }
};

export const registerRetailer = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, email, password } = req.body;
    const { uid } = req.params;

    const newRetailer = await RegistrationService.registerUser({
      role: 'retailer',
      email,
      password,
      phoneNumber,
    });

    const to = newRetailer.email || (newRetailer.phoneNumber as string); //send otp to email by default, and phoneNumber if email is not provided
    console.log('sending otp...to ', to);
    const otp = await twilioService.sendOtp(
      to,
      newRetailer.email ? 'email' : 'sms'
    );
    console.log('otp sent');

    res.status(201).json({
      message: 'Retailer account created successfully',
      data: {
        id: newRetailer.id,
        phoneNumber: newRetailer.phoneNumber,
        email: newRetailer.email,
        role: newRetailer.role,
        createdAt: newRetailer.createdAt,
      },
      next_step: `OTP sent to ${newRetailer.email || newRetailer.phoneNumber}`,
      otp_sid: otp.sid,
    });
  } catch (e: any) {
    res.status(400).json({
      error: e.message || 'Error creating retailer account',
    });
  }
};

export const addRetailerProfile = async (req: Request, res: Response) => {
  try {
    // userAuth exist or the profile exists
    // if false, get the data and create retailer profile
    const { uid } = req.params;
    const { ownerName, storeName, storeAddress, profileImage } = req.body;

    const user = await UserAuth.findById(uid);

    if (!user) {
      throw new CustomError('User is not registered', 404);
    }

    const newRetailerProfile =
      await RetailerProfileService.createRetailerProfile(uid, {
        ownerName,
        storeName,
        profileImage,
        storeAddress,
      });

    res.status(201).json({
      message: 'Retailer profile added successfully',
      data: {
        id: newRetailerProfile.id,
        ownerName: newRetailerProfile.ownerName,
        storeName: newRetailerProfile.storeName,
        storeAddress: newRetailerProfile.storeAddress,
        profileImage: newRetailerProfile.profileImage,
        createdAt: newRetailerProfile.createdAt,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      error:
        error.message || 'An error occurred while adding the retailer profile',
    });
  }
};

export const getRetailerProfileByUid = async (req: Request, res: Response) => {
  try {
    // userAuth exist or the profile exists
    // if false, get the data and create retailer profile
    const { uid } = req.params;

    const retailerProfile =
      await RetailerProfileService.getRetailerProfileByUid(uid);

    if (!retailerProfile)
      throw new CustomError('Retailer  profile not found', 404);

    res.status(201).json({
      data: {
        id: retailerProfile.id,
        ownerName: retailerProfile.ownerName,
        storeName: retailerProfile.storeName,
        storeAddress: retailerProfile.storeAddress,
        profileImage: retailerProfile.profileImage,
        createdAt: retailerProfile.createdAt,
        email: retailerProfile.uid.email,
        phoneNumber: retailerProfile.uid.phoneNumber,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      error:
        error.message || 'An error occurred while adding the retailer profile',
    });
  }
};

export const searchRetailerProfile = async (req: Request, res: Response) => {
  const { email, ownerName, phoneNumber, storeName, limit, page } = req.query;
  try {
    const retailerProfile = await RetailerProfileService.searchRetailers({
      email,
      ownerName,
      phoneNumber,
      storeName,
      limit,
      page,
    });
    res.json({
      retailerProfile,
    });
  } catch (error) {
    res.json({ error });
  }
};

export const updateRetailerProfile = async (req: Request, res: Response) => {
  const updates = req.body;
  const { uid } = req.params;

  try {
    const retailerProfile = await RetailerProfileService.updatedProfile(
      uid,
      updates
    );
    //Todo: handlee return message
  } catch (e: any) {
    res.json({
      error: e.message || '',
      status: 400,
    });
  }
};

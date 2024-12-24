import { Request, Response } from 'express';
import RegistrationService from '../services/registrationService';
import authTokenService from '../services/authTokenService';

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

    const newRetailer = await RegistrationService.registerUser({
      role: 'retailer',
      email,
      password,
      phoneNumber,
    });

    // send otp to email or phone numbeer

    const token = authTokenService.generateAccessToken({
      id: newRetailer.id,
      role: newRetailer.role,
    });

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
      otp_session: 'something heree',
    });
  } catch (e: any) {
    res.status(400).json({
      error: e.message || 'Error creating retailer account',
    });
  }
};

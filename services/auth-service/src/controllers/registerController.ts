import { Request, Response } from 'express';
import RegistrationService from '../services/registrationService';

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

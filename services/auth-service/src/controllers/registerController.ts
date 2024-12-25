import { Request, Response } from 'express';
import RegistrationService from '../services/registrationService';
import authTokenService from '../services/authTokenService';
import twilioService from '../services/twilioService';

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

    console.log('params', uid);
    // const newRetailer = await RegistrationService.registerUser({
    //   role: 'retailer',
    //   email,
    //   password,
    //   phoneNumber,
    // });

    res.send({ message: 'Okay' });
    return;
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

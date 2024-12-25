import { Request, Response } from 'express';
import TwilioService from '../services/twilioService';
import UserAuth from '../models/userAuth';
import authTokenService from '../services/authTokenService';
import CustomError from '../config/errors/CustomError';

const REFRESH_TOKEN = {
  secret: process.env.AUTH_REFRESH_TOKEN_SECRET!,
  cookie: {
    name: 'refreshTkn',
    options: {
      sameSite: 'none' as const,
      secure: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  },
};
const ACCESS_TOKEN = {
  secret: process.env.AUTH_ACCESS_TOKEN_SECRET!,
};

const sendOtp = async (req: Request, res: Response) => {
  try {
    const { channel, to } = req.body;
    if (channel !== 'sms' && channel !== 'email') {
      throw new Error('Invalid channel. Channel must be either sms or email');
    }
    // Call the service to send an OTP
    const otp = await TwilioService.sendOtp(to, channel);

    res.status(200).json({
      message: 'OTP sent successfully',
      data: {
        sid: otp.sid,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      error: error.message || 'An error occurred while sending the OTP',
    });
  }
};

const validateOtp = async (req: Request, res: Response) => {
  try {
    const { sid, code, userId } = req.body;

    // // Call the service to validate the OTP
    // const verificationCheck = await TwilioService.verifyOtp(sid, code);
    // if (verificationCheck.status !== 'approved') {
    //   throw new CustomError(
    //     'Verification result: ' + verificationCheck.status,
    //     401
    //   );
    // }

    // generate token and save to db
    const user = await UserAuth.findOne({ id: userId });
    if (!user) {
      throw new CustomError('User not found', 400);
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    console.log('accessToken', accessToken);

    // SET refresh Token cookie in response
    res.cookie(
      REFRESH_TOKEN.cookie.name,
      refreshToken,
      REFRESH_TOKEN.cookie.options
    );

    res.status(200).json({
      message: 'OTP verified successfully',
      data: {
        // status: verificationCheck.status,
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      error: error.message || 'An error occurred while verifying the OTP',
    });
  }
};

export { validateOtp };

import { Request, Response } from 'express';
import TwilioService from '../services/twilioService';
import UserAuth from '../models/userAuth';
import authTokenService from '../services/authTokenService';
import CustomError from '../config/errors/CustomError';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { z } from 'zod';
import { ROLE_ENUM, verifyOtpDto } from '../dtos/auth-user.dto';
import {
  generateAccessToken,
  generateRefreshToken,
  storeRefreshToken,
} from '../services/auth.service';
import { getAuthUserById } from '../services/auth-user.service';

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

const validateOtp = async (req: Request, res: Response) => {
  const { sid, code, accountId, to } = verifyOtpDto.parse(req.body);

  // Call the service to validate the OTP
  const verificationCheck = await TwilioService.verifyOtp(sid, to, code);
  if (verificationCheck.status !== 'approved') {
    throw new CustomError(
      'Verification result: ' + verificationCheck.status,
      401
    );
  }

  const user = await getAuthUserById(accountId);
  if (!user) {
    throw new CustomError('User not found', 400);
  }

  const accessToken = generateAccessToken({ id: user.id, role: user.role });
  const refreshToken = await generateRefreshToken({
    id: accountId,
    role: user.role,
  });

  await storeRefreshToken(user.id, refreshToken);

  // SET refresh Token cookie in response
  res.cookie(
    REFRESH_TOKEN.cookie.name,
    refreshToken,
    REFRESH_TOKEN.cookie.options
  );

  res.status(200).json({
    message: 'OTP verified successfully',
    data: {
      status: verificationCheck.status,
      accessToken,
      refreshToken,
    },
  });
};

export { validateOtp };

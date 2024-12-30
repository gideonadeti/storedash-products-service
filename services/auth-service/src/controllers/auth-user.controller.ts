import { Request, Response } from 'express';
import { createAuthUserDto } from '../dtos/auth-user.dto';
import { hashPassword } from '../utils/hashPassword';
import {
  createAuthUser,
  isEmailOrPhoneRegistered,
} from '../services/auth-user.service';
import CustomError from '../config/errors/CustomError';
import twilioService from '../services/twilioService';

export const registerUser = async (req: Request, res: Response) => {
  const validatedBody = createAuthUserDto.parse(req.body);
  const { email, password, phoneNumber } = validatedBody;

  let hashedPassword;
  if (password) {
    hashedPassword = await hashPassword(password);
  }

  const isRegistered = await isEmailOrPhoneRegistered({
    email: email,
    phoneNumber: phoneNumber,
  });
  if (isRegistered)
    throw new CustomError(
      'Email or phone number is already associated with an existing account',
      405
    );

  const authUser = await createAuthUser({
    ...validatedBody,
    password: hashedPassword,
    accountStatus: 'PENDING_APPROVAL',
  });

  const to = email ?? (phoneNumber as string);
  const channel = email ? 'email' : 'sms';

  const {
    sid,
    channel: _channel,
    to: _to,
  } = await twilioService.sendOtp(to, channel);

  res.status(201).json({
    data: authUser,
    message: 'User created successfully',
    success: true,
    otp: {
      sid,
      channel: _channel,
      to: _to,
    },
  });
};

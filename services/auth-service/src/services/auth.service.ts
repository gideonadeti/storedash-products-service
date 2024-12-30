import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { ROLE_ENUM } from '../dtos/auth-user.dto';
import crypto from 'crypto';
import { z } from 'zod';
import prisma from '../config/database';

const generateRefreshToken = async ({
  id,
  role,
}: {
  id: string;
  role: string;
}) => {
  const REFRESH_TOKEN = {
    secret: process.env.AUTH_REFRESH_TOKEN_SECRET!,
    expiry: process.env.AUTH_REFRESH_TOKEN_EXPIRY!,
  };

  const refreshToken = jwt.sign(
    {
      id: id,
      role: role,
    },
    REFRESH_TOKEN.secret,
    {
      expiresIn: REFRESH_TOKEN.expiry,
    }
  );

  const rTknHash = crypto
    .createHmac('sha256', REFRESH_TOKEN.secret)
    .update(refreshToken)
    .digest('hex');

  return rTknHash;
};

const generateAccessToken = ({
  id,
  role,
}: {
  id: string;
  role: z.infer<typeof ROLE_ENUM>;
}) => {
  const ACCESS_TOKEN = {
    secret: process.env.AUTH_ACCESS_TOKEN_SECRET!,
    expiry: process.env.AUTH_ACCESS_TOKEN_EXPIRY,
  };

  const accessToken = jwt.sign(
    {
      id,
      role,
    },
    ACCESS_TOKEN.secret,
    {
      expiresIn: ACCESS_TOKEN.expiry,
    }
  );
  return accessToken;
};

const storeRefreshToken = async (accountId: string, refreshToken: string) => {
  // Store the refresh token in the database
  const res = await prisma.token.create({
    data: {
      token: refreshToken,
      accountId: accountId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });
  return res;
};
export { generateAccessToken, generateRefreshToken, storeRefreshToken };

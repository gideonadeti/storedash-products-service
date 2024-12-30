import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import AuthorizationError from '../config/errors/AuthorizationError';

const requireAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ACCESS_TOKEN = {
    secret: process.env.AUTH_ACCESS_TOKEN_SECRET!,
  };
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader?.startsWith('Bearer '))
      throw new AuthorizationError(
        'Authentication Error',
        undefined,
        'You are unauthenticated!',
        {
          error: 'invalid_access_token',
          error_description: 'unknown authentication scheme',
        }
      );

    const accessTokenParts = authHeader.split(' ');
    const aTkn = accessTokenParts[1];

    const decoded = jwt.verify(aTkn, ACCESS_TOKEN.secret);

    // Attach authenticated user and Access Token to request object
    // @ts-ignore
    req.accountId = decoded._id;
    // @ts-ignore
    req.token = aTkn;
    next();
  } catch (err: any) {
    // Authentication check didn't go well
    console.log(err);

    const expParams = {
      error: 'expired_access_token',
      error_description: 'access token is expired',
    };
    if (err.name === 'TokenExpiredError')
      return next(
        new AuthorizationError(
          'Authentication Error',
          undefined,
          'Token lifetime exceeded!',
          expParams
        )
      );

    next(err);
  }
};

export default requireAuthentication;

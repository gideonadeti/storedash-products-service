import { Request, Response } from 'express';

export const createRetailerProfile = async (req: Request, res: Response) => {
  try {
    const { session, otp, name } = req.body;
    const { id: userAuthId } = req.params;
    //verify user otp

    // if otp is correect, create the profile, else,
  } catch (error: any) {
    res
      .status(400)
      .json({ error: error.message || 'Error creating  retailer profile' });
  }
};

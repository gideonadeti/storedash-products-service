import { string } from 'zod';
import prisma from '../config/database';
import { AuthUser } from '../types/auth-user.type';

export const createAuthUser = async (authUser: AuthUser) => {
  console.log('Cre', authUser);
  const user = prisma.authUser.create({ data: authUser });
  return user;
};

export const isEmailOrPhoneRegistered = async ({
  email,
  phoneNumber,
}: {
  email?: string;
  phoneNumber?: string;
}) => {
  const user = await prisma.authUser.findFirst({
    where: {
      email,
      phoneNumber,
    },
  });
  return !!user;
};

export const getAuthUserById = async (uid: string) => {
  const user = await prisma.authUser.findFirst({
    where: { id: uid },
  });
  return user;
};

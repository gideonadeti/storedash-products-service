import mongoose, { Document } from 'mongoose';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
// Define the TypeScript interface for the document
export interface IUserAuth extends Document {
  id: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  role: 'admin' | 'driver' | 'distributor' | 'retailer';
  tokens?: { token: string }[];
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  generateAccessToken: () => Promise<string>;
  generateRefreshToken: () => Promise<string>;
}

export const userAuthSchema = new mongoose.Schema<IUserAuth>(
  {
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
      validate: {
        validator: function (v: string) {
          return /^(?:\+?\d{1,4}[\s-]?)?(?:\(?\d{1,3}\)?[\s-]?)?\d{7,14}$/.test(
            v
          );
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid phone number!`,
      },
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      validate: {
        validator: function (v: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Basic email validation
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: function () {
        return !!this.email; // Required if email is present,  phoneNumbers will use otp
      },
    },
    role: {
      type: String,
      enum: ['admin', 'driver', 'distributor', 'retailer'],
      required: true,
    },
    tokens: [
      {
        token: { type: String, required: true },
      },
    ],
    refreshToken: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

// Validation to ensure either `email` or `phoneNumber` exists
userAuthSchema.pre('validate', function (next) {
  const user = this as IUserAuth; // Explicit type assertion
  if (!user.email && !user.phoneNumber) {
    return next(new Error('Either email or phoneNumber must be provided.'));
  }
  next();
});

userAuthSchema.methods.generateAccessToken = async function () {
  const ACCESS_TOKEN = {
    secret: process.env.AUTH_ACCESS_TOKEN_SECRET!,
    expiry: process.env.AUTH_ACCESS_TOKEN_EXPIRY,
  };
  const user = this as IUserAuth;

  const accessToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    ACCESS_TOKEN.secret,
    {
      expiresIn: ACCESS_TOKEN.expiry,
    }
  );
  return accessToken;
};

userAuthSchema.methods.generateRefreshToken = async function () {
  const REFRESH_TOKEN = {
    secret: process.env.AUTH_REFRESH_TOKEN_SECRET!,
    expiry: process.env.AUTH_REFRESH_TOKEN_EXPIRY,
  };
  const user = this as IUserAuth;

  const refreshToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
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

  //saving refresh token hash to db
  user.tokens?.push({ token: rTknHash });

  await user.save();

  return refreshToken;
};

const UserAuth = mongoose.model<IUserAuth>('UserAuth', userAuthSchema);
export default UserAuth;

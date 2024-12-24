import mongoose, { Document } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';

// Define the TypeScript interface for the document
export interface IUserAuth extends Document {
  id: string;
  phoneNumber?: string;
  email?: string;
  password: string;
  role: 'admin' | 'driver' | 'distributor' | 'retailer';
  token?: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userAuthSchema = new mongoose.Schema<IUserAuth>(
  {
    id: {
      type: String,
      default: uuidV4,
      unique: true,
      immutable: true,
    },
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
    token: {
      type: String,
    },
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

const UserAuth = mongoose.model<IUserAuth>('UserAuth', userAuthSchema);
export default UserAuth;

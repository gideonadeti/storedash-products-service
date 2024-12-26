import mongoose, { Schema, Document } from 'mongoose';

// Define the TypeScript interface for the RetailerProfile document
export interface RetailerProfile extends Document {
  uid: mongoose.Schema.Types.ObjectId;
  ownerName: string;
  storeName: string;
  profileImage?: string;
  storeAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const retailerSchema = new Schema<RetailerProfile>(
  {
    uid: {
      type: mongoose.Schema.Types.ObjectId, // Relates to UserAuth table
      required: true,
      ref: 'UserAuth',
      index: true,
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    storeName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    profileImage: {
      type: String,
      required: false,
      validate: {
        validator: function (value: string) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp|svg)$/.test(value);
        },
        message: 'Invalid profile image URL format',
      },
    },
    storeAddress: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Retailer = mongoose.model<RetailerProfile>('Retailer', retailerSchema);
export default Retailer;

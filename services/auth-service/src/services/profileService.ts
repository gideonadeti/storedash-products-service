import Retailer, { RetailerProfile } from '../models/retailer';
import { IUserAuth } from '../models/userAuth';

class RetailerProfileService {
  async createRetailerProfile(
    uid: string,
    data: {
      ownerName: string;
      storeName: string;
      profileImage?: string;
      storeAddress?: string;
    }
  ) {
    const { ownerName, storeName, profileImage, storeAddress } = data;
    const retailerProfile = new Retailer({
      ownerName,
      storeAddress,
      storeName,
      profileImage,
      uid,
    });
    return await retailerProfile.save();
  }

  async getRetailerProfileByUid(uid: string) {
    const retailerProfile = await Retailer.findOne({ uid }).populate<{
      uid: Pick<IUserAuth, 'email' | 'phoneNumber'>;
    }>('uid', 'email phoneNumber');
    return retailerProfile;
  }
  async searchRetailers(data: {
    storeName?: string | any;
    email?: string | any;
    phoneNumber?: string | any;
    ownerName?: string | any;
    page?: string | any;
    limit?: string | any;
  }) {
    const {
      email,
      phoneNumber,
      storeName,
      ownerName,
      page = 1,
      limit = 10,
    } = data;

    const filters: any = {};

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    if (email) {
      filters['uid.email'] = { $regex: email, $options: 'i' }; // Case-insensitive
    }
    if (phoneNumber) {
      filters['uid.phoneNumber'] = { $regex: phoneNumber, $options: 'i' };
    }
    if (storeName) {
      filters['storeName'] = { $regex: storeName, $options: 'i' };
    }
    if (ownerName) {
      filters['ownerName'] = { $regex: ownerName, $options: 'i' };
    }

    const totalCount = await Retailer.countDocuments(filters);
    const retailers = await Retailer.find(filters)
      .populate('uid', 'email phoneNumber')
      .skip((pageNumber - 1) * limitNumber) // Skip to the correct page
      .limit(limitNumber);
    return {
      data: retailers,
      pagination: {
        total: totalCount, // Total documents matching the filter
        page: pageNumber, // Current page
        limit: limitNumber, // Number of items per page
        totalPages: Math.ceil(totalCount / limitNumber), // Total pages
      },
    };
  }

  async updatedProfile(
    uid: string,
    updates: Partial<Omit<RetailerProfile, 'uid'>>
  ) {
    const retailerProfile = await Retailer.findOneAndUpdate(
      { uid }, // Find the profile by user ID
      { $set: updates }, // Apply the updates (partial update)
      { new: true, runValidators: true } // Return updated document and validate
    ).populate('uid', 'email phoneNumber'); // Populate additional fields if needed
    return retailerProfile;
  }
}

export default new RetailerProfileService();

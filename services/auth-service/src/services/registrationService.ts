import bcrypt from 'bcrypt';
import UserAuth, { IUserAuth } from '../models/userAuth';

class RegistrationService {
  async registerDriver(data: {
    phoneNumber?: string;
    email?: string;
    password: string;
    role: 'driver';
  }): Promise<IUserAuth> {
    //
    if (data.role !== 'driver') {
      throw new Error(
        'Invalid role. Only drivers can be registered using this service.'
      );
    }

    let hashedPassword = null;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
      // Hash the password
    }

    // Create the driver document
    const driver = new UserAuth({
      ...data,
      ...(hashedPassword && { password: hashedPassword }),
    });

    // Save the driver to the database
    return await driver.save();
  }
}

export default new RegistrationService();

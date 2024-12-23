dotenv.config();
import app from './app';
import { connectToDB } from './config/database';
import dotenv from 'dotenv';

const PORT = process.env.PORT || 3003;

connectToDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((e) => {
    console.error('Error starting starting auth service', e);
  });

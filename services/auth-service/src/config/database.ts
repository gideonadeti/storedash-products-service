import mongoose from 'mongoose';

const connectToDB = async () => {
  const { MONGO_DB_URL } = process.env;
  if (!MONGO_DB_URL) throw Error('MONGO_DB_URL is not in the env');
  await mongoose.connect(MONGO_DB_URL, {});
  console.log('Connected to mongodb instance');
};

export { connectToDB };

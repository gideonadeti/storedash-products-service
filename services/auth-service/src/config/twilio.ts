import twilio from 'twilio';

const TwilioClient = () => {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
  console.log('Twilio', process.env.MONGO_DB_URL);
  return twilio(
    'ACd3e14e382a4d58826edab30b70543c40',
    'b8f088baa4374183103578f7b6e09a4c',
    {
      lazyLoading: true,
    }
  );
};

export default TwilioClient;

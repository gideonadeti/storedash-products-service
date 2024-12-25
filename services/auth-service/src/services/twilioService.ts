import twilio from 'twilio';
import TwilioClient from '../config/twilio';

class TwilioService {
  sendOtp = async (to: string, channel: 'sms' | 'email') => {
    const { TWILIO_VERIFY_SERVICE_SID } = process.env;
    if (!TWILIO_VERIFY_SERVICE_SID) {
      throw new Error('TWILIO_VERIFY_SERVICE_SID is not defined');
    }

    const verification = await TwilioClient()
      .verify.v2.services(TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to,
        channel,
      });

    console.log(verification.sid);

    return verification;
  };

  verifyOtp = async (sid: string, code: string) => {
    const { TWILIO_VERIFY_SERVICE_SID } = process.env;
    if (!TWILIO_VERIFY_SERVICE_SID) {
      throw new Error('TWILIO_VERIFY_SERVICE_SID is not defined');
    }
    const verificationCheck = await TwilioClient()
      .verify.v2.services(TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        code,
        verificationSid: sid,
      });

    console.log(verificationCheck.status);
    return verificationCheck;
  };
}

export default new TwilioService();

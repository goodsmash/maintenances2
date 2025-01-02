import twilio from 'twilio';

const client = twilio(
  import.meta.env.VITE_TWILIO_ACCOUNT_SID,
  import.meta.env.VITE_TWILIO_AUTH_TOKEN
);

export const sendSMS = async ({
  to,
  message,
}: {
  to: string;
  message: string;
}) => {
  try {
    const result = await client.messages.create({
      body: message,
      to,
      from: import.meta.env.VITE_TWILIO_PHONE_NUMBER,
    });
    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { success: false, error };
  }
};

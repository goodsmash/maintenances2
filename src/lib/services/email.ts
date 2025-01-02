import sgMail from '@sendgrid/mail';

if (import.meta.env.VITE_SENDGRID_API_KEY) {
  sgMail.setApiKey(import.meta.env.VITE_SENDGRID_API_KEY);
}

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    const msg = {
      to,
      from: import.meta.env.VITE_EMAIL_FROM!,
      subject,
      html,
    };
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

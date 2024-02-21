import * as nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_ACCOUNT,
    pass: process.env.BREVO_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
export const inviteExamination = async (
  receiver: string,
  examinationId: number,
) => {
  await transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to: receiver,
    subject: "Invite to do exam",
    text: `Your examination is: ${process.env.CLIENT_WEB_URL}/examination/${examinationId}`,
  });
};

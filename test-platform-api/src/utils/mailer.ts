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
    text: `Your examination is: ${process.env.CLIENT_WEB_URL}/exam_invitation/${examinationId}`,
  });
};

export const sendResult = async (
  receiver: string,
  assessmentName: string,
  score: number,
) => {
  let text: string;
  if (score >= 5) {
    text = `Congratulations! Your score in ${assessmentName} is ${score}.`;
  } else {
    text = `Your score in ${assessmentName} is ${score}. Please improve and try later.`;
  }
  await transporter.sendMail({
    text,
    from: process.env.SENDER_EMAIL,
    to: receiver,
    subject: "Your examination result",
  });
};

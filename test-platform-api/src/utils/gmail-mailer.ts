import * as nodemailer from "nodemailer";

const clientMailer = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "flatformtester@gmail.com",
    pass: "xftofqssbnbisubm",
  },
});

const sender = (mailTo: string, assessmentName: string, score: number) => {
  clientMailer.sendMail({
    from: "flatformtester@gmail.com",
    to: mailTo,
    subject: `Test result of ${assessmentName}`,
    text: `Technical examination result: ${score}`,
  });
};

export const handleSendmail = async (
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
  await sender(receiver, assessmentName, score);
};

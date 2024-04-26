import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_MAILER_ACCOUNT,
    pass: process.env.BREVO_MAILER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

console.log(process.env);

export const inviteExamination = async (
  receiver: string,
  examinationId: number,
) => {
  await transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to: receiver,
    subject: "Invite to do exam - via Brevo",
    text: invitationTemplate(
      receiver,
      process.env.SENDER_EMAIL,
      "SaigonTechnology",
      `${process.env.CLIENT_WEB_URL}/exam_invitation/${examinationId}`,
    ),
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
    subject: "Your examination result via Brevo",
  });
};

const invitationTemplate = (
  receiver: string,
  sender: string,
  organization: string,
  examURL: string,
): string => {
  return `
    <h1>Hi, ${receiver}!</h1>
    <p>${sender} with ${organization} has invited you to do technical examination. Use the button below to set up your account and get started:</p>
    <!-- Action -->
    <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <!-- Border based button https://litmus.com/blog/a-guide-to-bulletproof-buttons-in-email-design -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center">
                <table border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td>
                      <a href="${examURL}" class="button button--" target="_blank">Take Examination</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <p>If you have any questions for ${organization}, you can reply to this email and it will go right to us. Alternatively, feel free to <a href="mailto:${sender}">contact Recruiting </a> anytime. (We're lightning quick at replying.) We also offer <a href="{{live_chat_url}}">live chat</a> during business hours.</p>
  `;
};

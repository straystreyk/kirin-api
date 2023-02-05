import nodemailer from "nodemailer";
import { MAIL_PASSWORD, MAIL_USERNAME } from "../constants";

const transporter = nodemailer.createTransport({
  host: "smtp.mail.ru",
  port: 465,
  secure: true,
  auth: {
    user: MAIL_USERNAME, // generated ethereal user
    pass: MAIL_PASSWORD, // generated ethereal password
  },
});

const sendActivationLink = async (emailTo: string, activationLink: string) => {
  try {
    await transporter.sendMail({
      from: MAIL_USERNAME,
      to: emailTo,
      subject: "activation",
      text: "",
      html: `
    HI <a href="${activationLink}">${activationLink}</a>
    `,
    });
  } catch (e) {
    console.log(e);
  }
};

export const mailService = {
  sendActivationLink,
};

import nodemailer from "nodemailer";
import variables from "../config/variable.js";

const sendEmail = async (options) => {
  // Create transporter with updated SMTP config
  const transporter = nodemailer.createTransport({
    host: variables.smtp.server,
    port: variables.smtp.port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: variables.smtp.username,
      pass: variables.smtp.password,
    },
  });

  // Define email options with updated from address
  const mailOptions = {
    from: `${variables.smtp.fromName} <${variables.smtp.fromEmail}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;

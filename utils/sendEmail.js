const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create a transporter using direct host & port options
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // smtp.gmail.com
    port: process.env.EMAIL_PORT, // 587
    secure: false, // false for port 587 (TLS), true for port 465 (SSL)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, // بتلغي فحص الشهادة وتعدي الـ Antivirus / Network SSL Blocking
    },
  });

  // 2) Define email options
  const mailOpts = {
    from: `E-Commerce App <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send email
  await transporter.sendMail(mailOpts);
};

module.exports = sendEmail;

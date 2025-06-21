// utils/mailHelper.js
const nodemailer = require('nodemailer');

const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // App password
    },
  });

  const mailOptions = {
    from: `"DNATechVerse" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP for Email Verification',
    html: `<h2>OTP Verification</h2>
           <p>Your 6-digit OTP is:</p>
           <h1 style="letter-spacing: 5px;">${otp}</h1>
           <p>This OTP is valid for 10 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };

const nodemailer = require("nodemailer");
const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      //   host: "smtp.gmail.com",
      //   host: "smtp.sendgrid.net",
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    console.log("TRANSPORTER IS : ", transporter);
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: options.email,
      subject: "Welcome to Artify🎉",
      text: options.message,
      headers: {
        "X-Priority": "3",
        "X-MSMail-Priority": "Normal",
        Importance: "Normal",
      },
    };

    console.log("MAIL OPTIONS ARE : ", mailOptions);
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Error is ----->", err.message);
  }
};

module.exports = { sendEmail };
console.log("EMAIL");

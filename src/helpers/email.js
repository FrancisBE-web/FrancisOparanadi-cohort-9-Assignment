const nodemailer = require('nodemailer');
const ejs = require("ejs");
const path = require('path');

// SENDING EMAIL TO THE USER 
const sendEmail = async (email, subject, text, token, firstName) => {
    const transporter = nodemailer.createTransport({ //THIS HELPS TO AUTHENTICATE THE EMAIL BEEN USED 
        host : process.env.EMAIL_HOST,
        port : process.env.EMAIL_PORT,
        secure : false,
        auth : {
            user : process.env.EMAIL_USER,
            pass : process.env.EMAIL_PASSWORD,
        },
    });
    const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;

    // Path to EJS template file
  const templatePath = path.join(__dirname, '../views/emails/verifyemails.ejs');

  // Render EJS file to HTML string to pass dynamic variables
  const htmlContent = await ejs.renderFile(templatePath, {
    firstName: firstName,
    verificationUrl: verificationUrl
  });

    const mailoptions = { // GIVES DETAILS OF THE EMAIL WHERE ITS COMING FROM ,WHERE ITS GOING AND ITS CONTENTS
        from: `"EventHorizon" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify Your Email Address",
        html: htmlContent
    };
    await transporter.sendMail(mailoptions);
};


module.exports = sendEmail;
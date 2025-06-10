const { transporter } = require("./email.config.js");
const { Verification_Email_Template, Welcome_Email_Template } = require("./emailTemplete.js");


exports.sendVerificationCode = async(email, verificationCode) => {
    try {
        const response = await transporter.sendMail({
            from: '"K-TheCoder 👾" <kaushikladumor80@gmail.com>',

            to: email, // list of receivers
            subject: "Verify your Email", // Subject line
            text: "Verify your Email", // plain text body
            html: Verification_Email_Template.replace("{verificationCode}", verificationCode)
        })
        console.log('Email send Successfully', response)
    } catch (error) {
        console.log('Email error', error)
    }
};

exports.sendWelcomeEmail = async (email, name) => {
  try {
    const response = await transporter.sendMail({
      from: '"K-TheCoder 👾" <kaushikladumor80@gmail.com>',
      to: email,
      subject: "Welcome Email",
      text: "Welcome Email",
      html: Welcome_Email_Template.replace("{name}", name)
    });
    console.log('Email sent successfully', response);
  } catch (error) {
    console.log('Email error', error);
  }
};

import nodemailer from "nodemailer";
import Mailgen from "mailgen";
export const sendEmailReg = (data) => {
  let config = {
    service: "gmail",
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);

  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Blink Chat",
      link: "https://mailgen.js",
    },
  });

  let response = {
    body: {
      name: data?.name,
      intro: "Welcome to Blik Chat",
      outro: `You are receiving this mail just to inform you about your recent account creation  for Blink Chat
        <br/>
        Current Date: ${new Date()}
        <br/>
        `,
    },
  };

  let mail = MailGenerator.generate(response);

  let message = {
    from: process.env.MAIL_ID,
    to: data.email,
    subject: "Account Creation",
    html: mail,
  };

  transporter
    .sendMail(message)
    .then(() => {
      console.log("You Should Recieve An Email");
    })
    .catch((error) => {
      console.log(error);
    });
};

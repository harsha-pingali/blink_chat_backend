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

export const sendResetMail = async (data) => {
  let config = {
    service: "gmail",
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASSWORD,
    },
  };
  console.log(process.env.MAIL_ID);
  let transporter = nodemailer.createTransport(config);
  var mailGenerator = new Mailgen({
    theme: "default",
    product: {
      // Appears in header & footer of e-mails
      name: "Blink Chat",
      link: "https://mailgen.js/",
      // Optional product logo
      // logo: 'https://mailgen.js/img/logo.png'
    },
  });

  var email = {
    body: {
      name: `${data?.userData?.name}`,
      intro: [
        "This is your reset mail",
        `<h2>Your Reset Code is</h2>`,
        `<h1 style="  letter-spacing: 2px;">${data?.otp}</h1>`,
      ],
      // action: {
      //   instructions: ["Your Reset Code is ", `<h1>${678908}</h1>`],
      //   // button: {
      //   //   color: "#22BC66", // Optional action button color
      //   //   text: `${602345}`,
      //   //   link: "https://mailgen.js/confirm?s=d9729feb74992cc3482b350163a1a010",
      //   // },
      // },
      outro: "Do Not Share This Code With Any One!🤫",
    },
  };

  var emailBody = mailGenerator.generate(email);

  let message = {
    from: process.env.MAIL_ID,
    to: data.email,
    subject: "RESET AUTH!",
    html: emailBody,
  };
  await transporter
    .sendMail(message)
    .then(() => {
      console.log("You Should Recieve An Email");
    })
    .catch((error) => {
      console.log(error.message);
    });
};

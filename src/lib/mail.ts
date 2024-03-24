import nodemailer from "nodemailer";
import * as handlebars from "handlebars";
import { templateForgotPassword } from "./templateForgotPassword";
import { templateActivation } from "./templateActivation";
import _ from "lodash";
import { temNewRequest } from "./temNewRequest";

export const sendMail = async ({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) => {
  //setting smtp server with my gmail account
  //go to google manage account/settings/2step verification
  //create app password
  const { SMTP_EMAIL, SMTP_GMAIL_PASS } = process.env;
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_GMAIL_PASS,
    },
  });

  try {
    const sendResult = await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html: body,
    });
    console.log("send result", { result: sendResult.accepted });

    if (!_.isEmpty(sendResult.accepted)) {
      return {
        success: true,
        message: "Email Sent Successfully",
      };
    }

    return {
      success: false,
      message: "Could not send activation link, try again later",
    };
  } catch (error) {
    console.log(error);
  }
};

export const comNewRequest = (name: string, from: string, to: string) => {
  const template = handlebars.compile(temNewRequest);
  const htmlBody = template({
    name,
    from,
    to,
  });

  return htmlBody;
};

export const compileActivationMailTemplate = (name: string, url: string) => {
  const template = handlebars.compile(templateActivation);
  const htmlBody = template({
    name,
    url,
  });

  return htmlBody;
};

export const compileForgotPasswordMailTemplate = (
  name: string,
  url: string
) => {
  const template = handlebars.compile(templateForgotPassword);
  const htmlBody = template({
    name,
    url,
  });

  return htmlBody;
};

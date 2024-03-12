"use server";
import { signJwt, verifyJwt } from "@/lib/jwt";
import {
  compileActivationMailTemplate,
  compileForgotPasswordMailTemplate,
  sendMail,
} from "@/lib/mail";
import prisma from "@/lib/prismadb";
import { RegisterSchema } from "@/lib/schema";
import bcrypt from "bcrypt";
import { z } from "zod";
import _ from "lodash";

/*******************************************ACTIVATE USER */
/*******************************************RESISTER USER ACTION */
/*******************************************FORGOT PASSWORD LINK */
/*******************************************RESET PASSWORD LINK */

/*******************************************ACTIVATE USER */
export const activateUser = async (jwtUserId: string) => {
  const payload = verifyJwt(jwtUserId);
  const userId = payload?.id;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return {
      success: false,
      message: "User Not Exist",
    };
  }
  if (user.emailVerified) {
    return {
      success: false,
      message: "User Already Verified",
    };
  }

  //update emailVerified
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  if (result) {
    return {
      success: true,
      message: "User Verified Successfully",
    };
  }

  return {
    success: false,
    message: "Could not Verify User, please try again later",
  };
};

/*******************************************RESISTER USER ACTION */
export const registerUserAction = async (
  values: z.infer<typeof RegisterSchema>
) => {
  try {
    const validatedFields = RegisterSchema.safeParse(values);
    if (!validatedFields) {
      return {
        success: false,
        error: "Error Creating User,Missing Fields",
      };
    }

    const { name, email, password } = values;

    const exist = await prisma.user.findMany({
      where: {
        OR: [{ email }, { name }],
      },
    });
    if (!_.isEmpty(exist)) {
      return {
        success: false,
        error: "Could not register, User Address Already Exist",
      };
    }

    const hashedPw = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword: hashedPw,
      },
    });
    if (!newUser) {
      return {
        success: false,
        error: "Unable register user, please try again later",
      };
    }

    const { hashedPassword, ...userNoPass } = newUser;

    // send activation mail
    const jwtUserId = signJwt({ id: userNoPass.id });
    const activationUrl = `${process.env.NEXTAUTH_URL}/auth/activation/${jwtUserId}`;
    const body = compileActivationMailTemplate(
      newUser.name || "guest",
      activationUrl
    );
    const sendMailRes = await sendMail({
      to: userNoPass.email as string,
      subject: "My Leave Plan | Activate Your Account",
      body,
    });

    console.log("sendMailRes", sendMailRes);
    console.log(!_.isEmpty(sendMailRes));
    if (sendMailRes?.success) {
      return {
        success: true,
        message: "Please check your email to Activate Account",
      };
    }

    return {
      success: false,
      error: "Could not register user, please try again later",
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      error: "Internal Server Error,try again later",
    };
  }
};

/*******************************************FORGOT PASSWORD LINK */
export const forgotPassword = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return {
        success: false,
        error: "No user found for this email",
      };
    }

    //send email with password re-set link
    const jwtUserId = signJwt({
      id: user.id,
    });
    const resetPassUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password/${jwtUserId}`;
    const body = compileForgotPasswordMailTemplate(
      user.name ?? "",
      resetPassUrl
    );
    const sendResult = await sendMail({
      to: user.email as string,
      subject: "Reset Password Request",
      body,
    });

    console.log("sendResult", sendResult);

    return {
      success: true,
      message: "Email has been sent to re-set password",
    };
  } catch (error) {
    console.log(error);
    throw Error("Internal Server Error, try again later");
  }
};

/*******************************************RESET PASSWORD LINK */
export const resetPassword = async (id: string, password: string) => {
  const payload = verifyJwt(id);
  if (!payload) {
    return {
      success: false,
      error: "Could not reset password, User not found",
    };
  }

  const userId = payload.id;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return {
      success: false,
      error: "Could not reset password, User not found",
    };
  }

  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      hashedPassword: await bcrypt.hash(password, 10),
    },
  });

  if (!result) {
    return {
      success: false,
      error: "Could not reset password, please contact ADMIN",
    };
  }

  return {
    success: true,
    message: "Password reset Successfully",
  };
};
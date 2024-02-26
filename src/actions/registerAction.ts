"use server";
import prisma from "@/lib/prismadb";
import { RegisterSchema } from "@/lib/schema";
import bcrypt from "bcrypt";
import { z } from "zod";

export const registerUserAction = async (
  values: z.infer<typeof RegisterSchema>
) => {
  try {
    const validatedFields = RegisterSchema.safeParse(values);
    if (!validatedFields) {
      throw Error("Error Creating User,Missing Fields");
    }

    const { name, email, password } = values;

    const exist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (exist) {
      throw Error("Email Address Already Exist");
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
      throw Error("Unable to create user, please try later");
    }

    const { hashedPassword, ...userNoPass } = newUser;

    //send activation mail
    // const jwtUserId = signJwt({ id: userNoPass.id });
    // const activationUrl = `${process.env.NEXTAUTH_URL}/auth/activation/${jwtUserId}`;
    // const body = compileActivationMailTemplate(
    //   newUser.name || "guest",
    //   activationUrl
    // );
    // await sendMail({
    //   to: userNoPass.email as string,
    //   subject: "Activate Your Account",
    //   body,
    // });

    return {
      success: true,
      data: userNoPass,
    };
  } catch (error: any) {
    throw Error("Internal Server Error");
  }
};

"use server";
import prisma from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

export const updateUserProfile = async ({
  name,
  email,
  userId,
}: {
  name: string;
  email: string;
  userId: string;
}) => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        email,
      },
    });

    if (updatedUser) {
      console.log("revalidating path");
      revalidatePath(`/profile/${userId}`);
      return {
        success: true,
        message: "Profile updated successfully",
      };
    }

    return {
      success: false,
      error: "Could not update profile,try again later",
    };
  } catch (error) {
    return {
      success: false,
      error: "Internal Server Error,try again later",
    };
  }
};

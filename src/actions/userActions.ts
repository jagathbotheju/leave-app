"use server";
import prisma from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

export const getUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      include: {
        leave: {
          orderBy: {
            startDate: "asc",
          },
        },
        leaveBalance: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    if (users) {
      return {
        success: true,
        data: users,
      };
    }

    return {
      success: false,
      error: "Could not get users,try again later",
    };
  } catch (error) {
    return {
      success: false,
      error: "Internal Server Error,try again later",
    };
  }
};

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

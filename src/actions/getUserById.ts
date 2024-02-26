"use server";
import prisma from "@/lib/prismadb";

export const getUserById = async (userid: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userid },
      include: {
        leave: true,
        leaveBalance: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "No user Found!",
      };
    }

    return {
      success: true,
      user,
    };
  } catch (error) {
    return {
      success: false,
      error: "Inter Server Error",
    };
  }
};

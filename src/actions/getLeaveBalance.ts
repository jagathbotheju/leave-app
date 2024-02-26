"use server";
import prisma from "@/lib/prismadb";

export const getLeaveBalance = async (userid: string) => {
  try {
    if (!userid) {
      return {
        success: false,
        error: "No user Found!",
      };
    }
    const leaveBalance = await prisma.leaveBalance.findFirst({
      where: { userId: userid },
    });

    if (!leaveBalance) {
      return {
        success: false,
        error: "Please set your leave balance",
      };
    }

    return {
      success: true,
      data: leaveBalance,
    };
  } catch (error) {
    return {
      success: false,
      error: "Internal Sever Error",
    };
  }
};

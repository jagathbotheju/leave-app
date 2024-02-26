"use server";
import { LeaveType, User } from "@prisma/client";
import prisma from "@/lib/prismadb";
import { z } from "zod";
import { LeaveBalanceSchema, LeaveRequestSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";

/*******************************SET LEAVE */
export const setLeave = async ({
  userid,
  newLeave,
}: {
  userid: string;
  newLeave: z.infer<typeof LeaveRequestSchema>;
}) => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userid,
      },
      data: {
        leave: {
          create: {
            year: newLeave.year,
            startDate: newLeave.startDate,
            endDate: newLeave.endDate,
            days: newLeave.days,
            leaveType: LeaveType.ANNUAL,
          },
        },
      },
    });

    if (updatedUser) {
      return {
        success: true,
        message: "New Leave Requested",
      };
    }

    return {
      success: false,
      error: "Could not create New Leave, Try again later.",
    };
  } catch (error) {
    return {
      success: false,
      error: "Internal Server Error",
    };
  }
};

/*******************************SET LEAVE BALANCE*/
export const setLeaveBalance = async ({
  userid,
  balance,
  isEditMode,
}: {
  userid: string;
  balance: z.infer<typeof LeaveBalanceSchema>;
  isEditMode: boolean;
}) => {
  console.log("balance", balance);
  try {
    let res: any = null;
    if (isEditMode) {
      res = await prisma.leaveBalance.update({
        where: {
          userId: userid,
        },
        data: {
          ...balance,
        },
      });
    } else {
      res = await prisma.user.update({
        where: {
          id: userid,
        },
        data: {
          leaveBalance: {
            create: {
              ...balance,
            },
          },
        },
      });
    }

    if (res) {
      revalidatePath(`/profile/${userid}`);
      return {
        success: true,
        message: "Leave Balance Updated",
      };
    }

    return {
      success: false,
      error: "Could not set leave balance, try later",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Internal Server Error",
    };
  }
};

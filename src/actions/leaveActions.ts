"use server";
import { LeaveStatus, LeaveType, User } from "@prisma/client";
import prisma from "@/lib/prismadb";
import { z } from "zod";
import { LeaveBalanceSchema, LeaveRequestSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserExt } from "@/types";

const getCurrentUser = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user as UserExt;
  return user;
};

/*******************************UPDATE LEAVE*/
/*******************************DELETE LEAVE */
/*******************************SET USER LEAVE */
/*******************************SET LEAVE STATUS*/
/*******************************SET LEAVE BALANCE*/

/*******************************UPDATE LEAVE*/
export const updateLeave = async ({
  userId,
  leaveId,
  newLeave,
}: {
  userId: string;
  leaveId: string;
  newLeave: z.infer<typeof LeaveRequestSchema>;
}) => {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser.id !== userId) {
      return {
        success: false,
        error: "Not Authorized to update this leave, please contact ADMIN",
      };
    }

    const leaveType =
      newLeave.leaveType === "annual"
        ? LeaveType.ANNUAL
        : newLeave.leaveType === "casual"
        ? LeaveType.CASUAL
        : newLeave.leaveType === "sick"
        ? LeaveType.SICK
        : LeaveType.UNKNOWN;

    const leave = await prisma.leave.update({
      where: {
        id: leaveId,
        userId,
      },
      data: {
        year: newLeave.year,
        startDate: newLeave.startDate,
        endDate: newLeave.endDate,
        days: newLeave.days,
        leaveType: leaveType,
      },
    });

    if (leave) {
      return {
        success: true,
        message: "Leave Updated Successfully",
      };
    }

    return {
      success: false,
      error: "Could not update leave, try again later",
    };
  } catch (error) {
    return {
      success: false,
      error: "Internal Server Error, try again later",
    };
  }
};

/*******************************DELETE LEAVE */
export const deleteLeave = async ({
  leaveId,
  userId,
  path,
}: {
  leaveId: string;
  userId: string;
  path: string;
}) => {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser.id !== userId) {
      return {
        success: false,
        error: "You are Not Authorized to delete this Leave",
      };
    }
    const deletedLeave = await prisma.leave.delete({
      where: {
        id: leaveId,
        userId,
      },
    });

    if (deletedLeave) {
      revalidatePath(path);
      return {
        success: true,
        message: "Leave Deleted Successfully",
      };
    }

    return {
      success: false,
      error: "Could not delete leave, tay again later...",
    };
  } catch (error) {
    return {
      success: false,
      error: "Internal Server Error, tay again later...",
    };
  }
};

/*******************************SET USER LEAVE */
export const setLeave = async ({
  userid,
  newLeave,
}: {
  userid: string;
  newLeave: z.infer<typeof LeaveRequestSchema>;
}) => {
  const leaveType =
    newLeave.leaveType === "annual"
      ? LeaveType.ANNUAL
      : newLeave.leaveType === "casual"
      ? LeaveType.CASUAL
      : newLeave.leaveType === "sick"
      ? LeaveType.SICK
      : LeaveType.UNKNOWN;

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
            leaveType: leaveType,
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
    console.log(error);
    return {
      success: false,
      error: "Internal Server Error",
    };
  }
};

/*******************************SET LEAVE STATUS*/
export const setLeaveStatus = async ({
  userId,
  leaveId,
  status,
}: {
  userId: string;
  leaveId: string;
  status: string;
}) => {
  console.log("userid", userId);
  console.log("leaveid", leaveId);
  try {
    const leaveStatus =
      status === "PENDING"
        ? LeaveStatus.PENDING
        : status === "APPROVED"
        ? LeaveStatus.APPROVED
        : status === "REJECTED"
        ? LeaveStatus.REJECTED
        : LeaveStatus.UNKNOWN;

    console.log("status", leaveStatus);
    const updatedLeave = await prisma.leave.update({
      where: {
        id: leaveId,
        userId,
      },
      data: {
        leaveStatus,
      },
    });

    if (updatedLeave) {
      revalidatePath(`/profile/${userId}`);
      return {
        success: true,
        message: `Leave Status updated to ${status}`,
      };
    }

    return {
      success: false,
      error: "Could not change leave status, try later!",
    };
  } catch (error) {
    console.log(error);
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

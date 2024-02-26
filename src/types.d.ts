import { User, LeaveBalance } from "@prisma/client";

type UserExt = User & {
  leaveBalance: LeaveBalance;
};

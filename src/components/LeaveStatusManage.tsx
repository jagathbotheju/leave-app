"use client";
import { useSession } from "next-auth/react";
import { LeaveHistoryColumnType } from "./LeaveHistoryColumns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { LeaveStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import { UserExt } from "@/types";
import { useTransition } from "react";
import { setLeaveStatus } from "@/actions/leaveActions";
import { toast } from "sonner";

interface Props {
  rowData: LeaveHistoryColumnType;
}

const LeaveStatusManage = ({ rowData }: Props) => {
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();
  const user = session?.user as UserExt;
  console.log(rowData);

  return (
    <Select
      disabled={user.role !== "ADMIN" || isPending}
      onValueChange={(value) => {
        setLeaveStatus({
          leaveId: rowData.leaveId,
          userId: user.id,
          status: value,
        })
          .then((response) => {
            if (response.success) {
              return toast.success(response.message);
            } else {
              return toast.error(response.error);
            }
          })
          .catch((err) => {
            toast.error("Internal Server Error, try later");
          });
      }}
    >
      <SelectTrigger
        className={cn("w-[150px] font-semibold text-white tracking-widest", {
          "bg-yellow-500": rowData.leaveStatus === LeaveStatus.PENDING,
          "bg-green-400": rowData.leaveStatus === LeaveStatus.APPROVED,
          "bg-red-400": rowData.leaveStatus === LeaveStatus.REJECTED,
        })}
      >
        <SelectValue placeholder={rowData.leaveStatus.toUpperCase()} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={LeaveStatus.PENDING}>PENDING</SelectItem>
          <SelectItem value={LeaveStatus.APPROVED}>APPROVED</SelectItem>
          <SelectItem value={LeaveStatus.REJECTED}>REJECTED</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default LeaveStatusManage;

import { months } from "@/lib/data";
import { cn } from "@/lib/utils";
import { LeaveStatus } from "@prisma/client";

interface Props {
  leaveInfo: {
    date: Date;
    isOnLeave: boolean;
    status: LeaveStatus;
  };
}

const DateChip = ({ leaveInfo }: Props) => {
  const date = leaveInfo.date.getDate();
  const month = leaveInfo.date.getMonth();
  console.log(leaveInfo.date.getMonth() + 1, leaveInfo.date.getMonth() + 1);

  return (
    <div
      className={cn(
        `p-2 px-4 w-5 flex items-center justify-center h-10 text-xs text-slate-500 rounded-md border`,
        leaveInfo.isOnLeave && "text-slate-700 font-semibold",
        {
          "bg-green-300":
            leaveInfo.status === LeaveStatus.APPROVED && leaveInfo.isOnLeave,
          "bg-orange-300":
            leaveInfo.status === LeaveStatus.PENDING && leaveInfo.isOnLeave,
          "bg-red-300": leaveInfo.status === LeaveStatus.REJECTED,
        }
      )}
    >
      <div className="flex items-center justify-between flex-col">
        <p
          className={cn(
            "text-[8px] text-slate-400",
            leaveInfo.isOnLeave && "text-slate-700 font-semibold"
          )}
        >
          {months[month]}
        </p>
        <p>{date}</p>
      </div>
    </div>
  );
};

export default DateChip;

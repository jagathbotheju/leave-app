import { months } from "@/lib/data";
import { cn } from "@/lib/utils";
import { UserExt } from "@/types";
import moment from "moment";

interface Props {
  user: UserExt;
  date: number;
  userIndex: number;
  monthIndex: number;
  bgColor?: string;
}

const DateChip = ({
  user,
  date,
  userIndex,
  monthIndex,
  bgColor = "",
}: Props) => {
  return (
    <div
      className={cn(
        `p-2 px-4 w-5 flex items-center justify-center h-10 text-xs text-slate-500 rounded-md border`,
        bgColor
        // {
        //   [bgColor]:
        //     moment(user.leave[userIndex].startDate).date() <= date + 1 &&
        //     moment(user.leave[userIndex].endDate).date() >= date + 1,
        // }
      )}
    >
      <div className="flex items-center justify-between flex-col">
        <p className="text-[8px] text-slate-400">{months[monthIndex]}</p>
        <p>{date + 1}</p>
      </div>
    </div>
  );
};

export default DateChip;

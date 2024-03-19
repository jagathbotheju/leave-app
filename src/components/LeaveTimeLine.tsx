"use client";
import "react-calendar-timeline/lib/Timeline.css";
import _ from "lodash";
import moment from "moment";
import useDraggableScroll from "use-draggable-scroll";
import { useRef } from "react";
import { UserExt } from "@/types";
import { months } from "@/lib/data";
import DateChip from "./DateChip";
import { LeaveStatus } from "@prisma/client";

interface Props {
  users: UserExt[];
}

const LeaveTimeLine = ({ users }: Props) => {
  const ref = useRef(null);
  const { onMouseDown } = useDraggableScroll(ref);
  const daysInMonth = (month: number) =>
    new Date(new Date().getFullYear(), month, 0).getDate();

  const getDateRange = (startDate: Date, endDate: Date, steps = 1) => {
    const dateArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      dateArray.push(new Date(currentDate));
      // Use UTC date to prevent problems with time zones and DST
      currentDate.setUTCDate(currentDate.getUTCDate() + steps);
    }

    return dateArray;
  };

  const getCalendar = () => {
    const cal: {
      date: Date;
      isOnLeave: boolean;
      status: LeaveStatus;
    }[] = [];
    _.times(12).map((month: number, monthIndex) => {
      return _.times(daysInMonth(month + 1)).map((date: number, index) => {
        const checkDate = new Date(
          `${moment().year()}-${month + 1}-${date + 1}`
        );
        cal.push({
          date: checkDate,
          isOnLeave: false,
          status: LeaveStatus.PENDING,
        });
      });
    });

    return cal;
  };

  const getUserLeaves = (user: UserExt) => {
    const userLeaves: { date: Date; status: LeaveStatus }[] = [];
    user.leave.map((item) => {
      const range = getDateRange(item.startDate, item.endDate);
      range.map((date) =>
        userLeaves.push({
          date: date,
          status: item.leaveStatus,
        })
      );
    });
    return userLeaves;
  };

  const getUserLeaveCalendar = (
    calendar: {
      date: Date;
      isOnLeave: boolean;
      status: LeaveStatus;
    }[],
    userLeaves: { date: Date; status: LeaveStatus }[]
  ) => {
    const userLeaveCalendar = calendar.map((calendarItem) => {
      const includes = userLeaves.find(
        (userLeave) =>
          userLeave.date.toISOString() === calendarItem.date.toISOString()
      );
      if (includes) {
        return {
          date: calendarItem.date,
          isOnLeave: true,
          status: includes.status,
        };
      }
      return calendarItem;
    });
    return userLeaveCalendar;
  };

  const calendar = getCalendar();
  // console.log("user", users[0]);
  //const userLeaves = getUserLeaves(users[0]);
  //console.log(userLeaves.map((leave) => leave.date.toDateString()));

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full h-[700px] gap-1">
        {/* user names */}
        <div className="flex flex-col w-[10%] gap-4 mt-10">
          {users.map((user) => (
            <p
              key={user.id}
              className="p-2 h-10 text-end font-semibold rounded-md bg-orange-100 text-slate-700"
            >
              {user.name}
            </p>
          ))}
        </div>

        <div
          className="flex w-full gap-1 overflow-hidden"
          ref={ref}
          onMouseDown={onMouseDown}
        >
          <div className="flex flex-col w-full">
            <div className="flex w-full h-10 items-center gap-1 ml-2">
              {months.map((month, index) =>
                _.times(daysInMonth(index + 1)).map((date: number, index) => {
                  if (date + 1 === 1) {
                    return <div key={date}>{month}</div>;
                  } else {
                    return (
                      <div
                        key={date + month}
                        className="p-2 px-4 w-5 flex items-center justify-center h-10 text-xs rounded-md border border-transparent"
                      >
                        {" "}
                      </div>
                    );
                  }
                })
              )}
            </div>

            {/* user leaves */}
            <div className="flex flex-col gap-4">
              {users.map((user, index) => {
                const userLeaves = getUserLeaves(user);
                const userLeaveCalendar = getUserLeaveCalendar(
                  calendar,
                  userLeaves
                );

                const row = userLeaveCalendar.map((leaveInfo) => (
                  <DateChip
                    key={leaveInfo.date.toISOString()}
                    leaveInfo={leaveInfo}
                  />
                ));

                return (
                  <div key={index} className="flex gap-1">
                    {row}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveTimeLine;

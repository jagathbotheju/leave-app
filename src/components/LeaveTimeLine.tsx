"use client";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import _ from "lodash";
import moment from "moment";
import useDraggableScroll from "use-draggable-scroll";
import { useRef } from "react";
import { UserExt } from "@/types";
import { cn } from "@/lib/utils";
import { months } from "@/lib/data";
import DateChip from "./DateChip";
import { Leave } from "@prisma/client";

interface Props {
  users: UserExt[];
}

const LeaveTimeLine = ({ users }: Props) => {
  const ref = useRef(null);
  const { onMouseDown } = useDraggableScroll(ref);
  const daysInMonth = (month: number) =>
    new Date(new Date().getFullYear(), month, 0).getDate();

  const sDate = moment(users[0].leave[0].startDate);
  const eDate = moment(users[0].leave[0].endDate);
  const checkDate = moment(users[0].leave[0].startDate).add("d", 6);

  const startDays: moment.Moment[] = [];
  const endDays: moment.Moment[] = [];
  let dateRange: Date[][] = [];
  const leaveDates: Date[] = [];

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

  users[0].leave.map((item: Leave) => {
    const range = getDateRange(item.startDate, item.endDate);
    range.map((date) => leaveDates.push(date));
    dateRange.push(range);
  });

  //console.log(leaveDates);
  //console.log(endDays);

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full h-[700px] gap-1">
        {/* user names */}
        <div className="flex flex-col w-[10%] bg-slate-100 gap-4 mt-10">
          {users.map((user) => (
            <p key={user.id} className="p-2 bg-slate-200 h-10">
              {user.name}
            </p>
          ))}
          {/* <p className="p-2 bg-slate-200 h-10">Jagath</p>
          <p className="p-2 bg-slate-200 h-10">Jagath</p>
          <p className="p-2 bg-slate-200 h-10">Jagath</p>
          <p className="p-2 bg-slate-200 h-10">Jagath</p> */}
        </div>

        <div
          className="flex w-full gap-1 overflow-hidden"
          ref={ref}
          onMouseDown={onMouseDown}
        >
          <div className="flex flex-col">
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
            {users.map((user, userIndex) => {
              return (
                <div key={user.id} className="flex gap-1 mb-4">
                  {_.times(12).map((month, monthIndex) => {
                    let startDate: moment.Moment;
                    let endDate: moment.Moment;
                    //let checkDate: moment.Moment;
                    let isAfter = false;
                    let isBefore = false;
                    return _.times(daysInMonth(month + 1)).map(
                      //date and index 0 based
                      (date: number, index) => {
                        let isBetween = false;

                        if (isBetween) {
                          return (
                            <DateChip
                              key={index + date}
                              user={user}
                              date={date}
                              userIndex={userIndex}
                              monthIndex={monthIndex}
                              bgColor="bg-red-100"
                            />
                          );
                        } else {
                          return (
                            <DateChip
                              key={index + date}
                              user={user}
                              date={date}
                              userIndex={userIndex}
                              monthIndex={monthIndex}
                            />
                          );
                        }
                      }
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveTimeLine;

"use client";

import { LeaveRequestSchema, LeaveBalanceSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import moment from "moment";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { FaCalendarAlt } from "react-icons/fa";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { UserExt } from "@/types";
import { toast } from "sonner";
import { setLeave, setLeaveBalance } from "@/actions/leaveActions";
import { keysIn, merge } from "lodash";
import { revalidatePath } from "next/cache";

interface Props {
  user: UserExt;
}

const LeaveRequestForm = ({ user }: Props) => {
  const [mount, setMount] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof LeaveRequestSchema>>({
    resolver: zodResolver(LeaveRequestSchema),
    defaultValues: {
      year: moment().year().toString(),
      startDate: new Date(),
      endDate: new Date(),
      days: 1,
      leaveType: "",
    },
    mode: "all",
  });

  //console.log("leaveBalance", user.leaveBalance);

  const onSubmit = (data: z.infer<typeof LeaveRequestSchema>) => {
    const annualBalance =
      user.leaveBalance.annual + user.leaveBalance.annualForward;
    const casualBalance = user.leaveBalance.casual;
    const leaveBalance = user.leaveBalance;
    const leaveStartDate = data.startDate;

    if (data.leaveType === "annual" && data.days > annualBalance) {
      return toast.error("Annual Leave exceeds available balance");
    }
    if (data.leaveType === "casual" && data.days > casualBalance) {
      return toast.error("Casual Leave exceeds available balance");
    }

    const newLeaveTypeBal =
      (leaveBalance[data.leaveType as keyof typeof leaveBalance] as number) -
      data.days;
    const newBalObject = {
      [data.leaveType]: newLeaveTypeBal,
    };
    const newLeaveBalance = { ...leaveBalance, ...newBalObject };
    const newLeaveBalanceRequest: z.infer<typeof LeaveBalanceSchema> = {
      year: newLeaveBalance.year,
      annual: newLeaveBalance.annual,
      annualForward: newLeaveBalance.annualForward,
      casual: newLeaveBalance.casual,
      sick: newLeaveBalance.sick,
    };

    setLeave({ userid: user.id, newLeave: data })
      .then((response) => {
        if (response.success) {
          setLeaveBalance({
            userid: user.id,
            balance: newLeaveBalanceRequest,
            isEditMode: true,
          })
            .then((res) => {
              if (res.success) {
                form.reset();
                return toast.success("New Leave Requested Successfully");
              }
              if (!response.success) {
                return toast.error(response.error);
              }
            })
            .catch((err) => {
              return toast.error("Internal Server Error, Try Later");
            });
        }
        if (!response.success) {
          return toast.error(response.error);
        }
      })
      .catch((error) => {
        toast.error("Internal Server Error, Try Later");
      })
      .finally(() => {
        form.reset();
      });
  };

  const calculateDays = () => {
    const days =
      moment(form.getValues().endDate)
        .endOf("day")
        .diff(moment(form.getValues().startDate).startOf("day"), "days") + 1 ??
      0;
    form.setValue("days", days);
  };

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) return null;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-lg"
      >
        {/* year */}
        <FormField
          disabled={isPending}
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* leave type */}
        <FormField
          control={form.control}
          name="leaveType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Leave Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="annual">Annual</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="sick">Sick</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* start date */}
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <FaCalendarAlt className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(value) => {
                      field.onChange(value);
                      setStartDateOpen(false);
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* end date */}
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date</FormLabel>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Start Date</span>
                      )}
                      <FaCalendarAlt className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(value) => {
                      field.onChange(value);
                      setEndDateOpen(false);
                      calculateDays();
                    }}
                    disabled={(date) =>
                      date < new Date() || date < form.getValues().startDate
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* number of days */}
        <FormField
          disabled={isPending}
          control={form.control}
          name="days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Days</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* submit button */}
        <Button type="submit" size="sm" disabled={!form.formState.isValid}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default LeaveRequestForm;

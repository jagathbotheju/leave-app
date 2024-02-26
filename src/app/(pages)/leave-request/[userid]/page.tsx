import { getUserById } from "@/actions/getUserById";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LeaveRequestForm from "@/components/LeaveRequestForm";
import { UserExt } from "@/types";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface Props {
  params: {
    userid: string;
  };
}

const LeaveRequestPage = async ({ params }: Props) => {
  const response = await getUserById(params.userid);
  const user = response.user as UserExt;

  if (!user) {
    redirect("/auth/login");
  }

  if (!user.leaveBalance) {
    redirect(`/profile/${user.id}`);
  }

  return (
    <div className="flex flex-col-reverse md:flex-row container mx-auto md:justify-center mt-10">
      <div className="flex flex-col md:w-[50%] mt-10">
        <h1 className="text-3xl font-bold text-slate-700 mb-8">
          New Leave Request
        </h1>
        <LeaveRequestForm user={user} />
      </div>

      <div className="flex flex-col mt-10 p-5 shadow-lg md:w-[30%] rounded-md">
        <h1 className="text-3xl font-bold text-slate-700 mb-8">
          Leave Balance
        </h1>

        <div className="grid grid-cols-3 font-semibold gap-2">
          <p className="col-span-2">Annual</p>
          <p>{user.leaveBalance.annual}</p>

          <p className="col-span-2">Annual from Last Year</p>
          <p>{user.leaveBalance.annualForward}</p>

          <p className="col-span-2">Casual</p>
          <p>{user.leaveBalance.casual}</p>

          <p className="col-span-2">Sick</p>
          <p>{user.leaveBalance.sick}</p>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestPage;

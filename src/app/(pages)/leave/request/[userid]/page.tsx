import { getUserById } from "@/actions/getUserById";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Header from "@/components/Header";
import LeaveRequestForm from "@/components/LeaveRequestForm";
import LeaveSummary from "@/components/LeaveSummary";
import { UserExt } from "@/types";
import { User } from "@prisma/client";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface Props {
  params: {
    userid: string;
  };
}

export const metadata: Metadata = {
  title: "New Leave | My Leave Plan",
};

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
    <div className="w-full">
      <Header title="New Leave Request" />

      <div className="flex flex-col-reverse md:flex-row container mx-auto md:justify-center mt-10">
        <div className="md:w-[50%]">
          <LeaveRequestForm user={user} />
        </div>

        <LeaveSummary user={user} />
      </div>
    </div>
  );
};

export default LeaveRequestPage;

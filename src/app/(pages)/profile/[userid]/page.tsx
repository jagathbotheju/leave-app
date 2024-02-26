import { getLeaveBalance } from "@/actions/getLeaveBalance";
import { getUserById } from "@/actions/getUserById";
import LeaveBalanceForm from "@/components/LeaveBalanceForm";
import { UserExt } from "@/types";
import _ from "lodash";

interface Props {
  params: {
    userid: string;
  };
}

const ProfilePage = async ({ params }: Props) => {
  const response = await getUserById(params.userid);
  const user = response.user as UserExt;

  return (
    <div className="flex w-full max-w-6xl container mt-10">
      <div className="flex flex-col mt-2 space-y-4 w-full">
        {response?.success && user && _.isEmpty(user.leaveBalance) ? (
          <>
            <h2 className="bg-red-200 text-red-500 font-semibold p-2 rounded-md">
              Please set your Leave Balance
            </h2>
            <LeaveBalanceForm user={user} isEditMode={false} />
          </>
        ) : (
          <>
            <LeaveBalanceForm user={user} isEditMode />
          </>
        )}
      </div>

      <div className="mt-5">
        <h1 className="font-bold text-3xl">Leave History</h1>
      </div>
    </div>
  );
};

export default ProfilePage;

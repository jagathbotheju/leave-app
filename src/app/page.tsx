import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import _ from "lodash";
import { UserExt } from "@/types";
import LeaveTimeLine from "@/components/LeaveTimeLine";
import { getUsers } from "@/actions/userActions";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const user = session?.user as UserExt;
  const res = await getUsers();
  const users = res.data as UserExt[];
  console.log(users[0].leave);

  return (
    <main className="flex flex-col mt-10 mx-auto px-20">
      {session && user && _.isEmpty(user.leaveBalance) && (
        <h2 className="bg-red-200 text-red-500 font-semibold p-5 rounded-md">
          Please go to Profile and set your Leave Balance, for this year
        </h2>
      )}
      <div className="mt-10">
        <LeaveTimeLine users={users} />
      </div>
    </main>
  );
}

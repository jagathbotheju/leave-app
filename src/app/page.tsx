import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import _ from "lodash";
import { UserExt } from "@/types";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const user = session?.user as UserExt;

  return (
    <main className="flex flex-col container max-w-7xl mt-10 mx-auto">
      {session && user && _.isEmpty(user.leaveBalance) && (
        <h2 className="bg-red-200 text-red-500 font-semibold p-5 rounded-md">
          Please go to Profile and set your Leave Balance, for this year
        </h2>
      )}
      Home Page
    </main>
  );
}

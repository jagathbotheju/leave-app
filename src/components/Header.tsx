import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { cn } from "@/lib/utils";
import { UserExt } from "@/types";
import { getServerSession } from "next-auth";

interface Props {
  title: string;
  className?: string;
}

const Header = async ({ title, className }: Props) => {
  const session = await getServerSession(authOptions);
  const user = session?.user as UserExt;

  return (
    <div className={cn("w-full bg-slate-50 p-4 my-2", className)}>
      <div className="container mx-auto max-w-7xl flex items-center justify-between">
        <h1 className=" font-bold text-4xl">{title}</h1>
        <div className="flex gap-4">
          {/* annual */}
          <div className="flex flex-col items-center px-5 py-4 bg-orange-100 rounded-md">
            <p className="font-semibold">ANNUAL</p>
            <p className="font-bold text-lg text-orange-600">
              {user.leaveBalance.annual}
            </p>
          </div>

          {/* casual */}
          <div className="flex flex-col items-center px-5 py-4 bg-amber-100 rounded-md">
            <p className="font-semibold">CASUAL</p>
            <p className="font-bold text-lg text-amber-600">
              {user.leaveBalance.casual}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

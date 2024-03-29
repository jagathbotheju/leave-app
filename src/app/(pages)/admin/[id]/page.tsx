import { getUserById } from "@/actions/getUserById";
import { getUsers } from "@/actions/userActions";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AdminHistoryColumns, {
  AdminHistoryColumnType,
} from "@/components/AdminHistoryColumns";
import { DataTable } from "@/components/DataTable";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { UserExt } from "@/types";
import { Leave } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect, useRouter } from "next/navigation";
import { Suspense } from "react";
import _ from "lodash";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminUsers from "@/components/AdminUsers";

interface Props {
  params: {
    id: string;
  };
}

const AdminPage = async ({ params }: Props) => {
  const response = await getUserById(params.id);
  const user = response.user as UserExt;
  const session = await getServerSession(authOptions);
  const currentUser = session?.user as UserExt;

  const leaveHistoryData = user?.leave.map((leave: Leave) => ({
    leaveId: leave.id,
    year: leave.year,
    appliedOn: leave.updatedAt,
    startDate: leave.startDate,
    endDate: leave.endDate,
    days: leave.days,
    leaveType: leave.leaveType,
    leaveStatus: leave.leaveStatus,
    userId: user.id,
    leaveBalance: user.leaveBalance,
  }));

  if (!session || !session.user) redirect("/login");
  if (currentUser.id !== user.id) redirect("/");
  if (user.role !== "ADMIN") {
    return redirect("/auth/not-authorized");
  }

  const resUsers = await getUsers();
  const users = resUsers.data as UserExt[];
  if (_.isEmpty(users)) return <Loading />;

  const adminHistoryData: AdminHistoryColumnType[] = [];
  users.map((user) => {
    user.leave.map((leave: Leave) => {
      const data = {
        name: user.name!,
        id: user.id,
        leaveId: leave.id,
        year: leave.year,
        appliedOn: leave.updatedAt,
        startDate: leave.startDate,
        endDate: leave.endDate,
        days: leave.days,
        leaveType: leave.leaveType,
        leaveStatus: leave.leaveStatus,
        userId: user.id,
        leaveBalance: user.leaveBalance,
      };
      adminHistoryData.push(data);
    });
    // return history;
  });

  return (
    <div className="flex w-full flex-col">
      <Header title="ADMIN AREA" className="bg-red-100 text-red-500" />

      <div className="flex flex-col container mx-auto max-w-7xl">
        <Tabs defaultValue="history">
          <TabsList className="grid w-full grid-cols-2 bg-transparent items-center gap-10">
            <TabsTrigger
              className="data-[state=active]:border-b border-primary rounded-none dark:bg-slate-700"
              value="history"
            >
              Users Leave History
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:border-b border-primary rounded-none dark:bg-slate-700"
              value="users"
            >
              Users
            </TabsTrigger>
          </TabsList>
          <TabsContent value="history">
            <Suspense fallback={<Loading />}>
              <DataTable
                columns={AdminHistoryColumns}
                data={adminHistoryData}
              />
            </Suspense>
          </TabsContent>
          <TabsContent value="users">
            <AdminUsers users={users} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;

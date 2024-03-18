"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserExt } from "@/types";
import { useState } from "react";

const AuthButton = () => {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const { data: session } = useSession();
  const user = session?.user as UserExt;

  return (
    <div className="flex items-center gap-2">
      {user ? (
        <>
          <Link
            href={`/profile/${user.id}`}
            className="font-bold underline underline-offset-2 decoration-2 hover:decoration-sky-500"
          >
            {user.name}
          </Link>

          <Button
            className="text-sky-300 hover:text-sky-400 transition-colors"
            onClick={() => router.push(`/leave/request/${user.id}`)}
          >
            NEW
          </Button>

          <DropdownMenu open={openMenu} onOpenChange={() => setOpenMenu(false)}>
            <DropdownMenuTrigger
              className="focus:outline-none"
              onMouseEnter={() => setOpenMenu(true)}
              // onMouseLeave={() => setOpenMenu(false)}
            >
              <Avatar>
                <AvatarImage
                  src={user.image ? user.image : "/blank-profile.png"}
                />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-36">
              {/* new request */}
              <DropdownMenuItem
                className="cursor-pointer hover:font-semibold"
                onClick={() => router.push(`/leave/request/${user.id}`)}
              >
                NEW REQUEST
              </DropdownMenuItem>

              {/* leave history */}
              <DropdownMenuItem
                className="cursor-pointer hover:font-semibold"
                onClick={() => router.push(`/leave/history/${user.id}`)}
              >
                LEAVE HISTORY
              </DropdownMenuItem>

              {/* profile */}
              <DropdownMenuItem
                className="cursor-pointer hover:font-semibold"
                onClick={() => router.push(`/profile/${user.id}`)}
              >
                PROFILE
              </DropdownMenuItem>

              {/* admin */}
              {user.role === "ADMIN" && (
                <DropdownMenuItem
                  className="cursor-pointer hover:font-semibold"
                  onClick={() => router.push(`/admin/${user.id}`)}
                >
                  ADMIN
                </DropdownMenuItem>
              )}

              {/* logout */}
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  signOut();
                  router.push("/");
                }}
              >
                LOGOUT
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <Button onClick={() => signIn()}>Log In</Button>
          <Button onClick={() => router.push("/auth/register")}>
            Register
          </Button>
        </>
      )}
    </div>
  );
};

export default AuthButton;

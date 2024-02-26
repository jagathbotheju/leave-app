"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";

const AuthButton = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as User;

  return (
    <div className="flex items-center gap-2">
      {session && session.user ? (
        <>
          <Link
            href={`/profile/${user.id}`}
            className="font-bold underline underline-offset-2 decoration-2 hover:decoration-sky-500"
          >
            {session.user.name}
          </Link>
          <Button
            className="text-sky-300 hover:text-sky-400 transition-colors"
            onClick={() => router.push(`/leave-request/${user.id}`)}
          >
            NEW
          </Button>
          <Button
            className="text-sky-300 hover:text-sky-400 transition-colors"
            onClick={() => {
              signOut();
              router.push("/");
            }}
          >
            Logout
          </Button>
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

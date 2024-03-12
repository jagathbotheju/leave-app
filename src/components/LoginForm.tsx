"use client";
import { LoginSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

interface Props {
  callbackUrl?: string;
}

const LoginForm = ({ callbackUrl }: Props) => {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    const { email, password } = values;
    console.log(email, password);
    signIn("credentials", {
      email,
      password,
      redirect: false,
    })
      .then((res) => {
        if (!res?.ok) {
          console.log(res);
          return toast.error(res?.error);
        } else {
          toast.success("Successfully Logged In");
          form.reset();
          router.push(callbackUrl ? callbackUrl : "/");
        }
      })
      .catch((err) => {
        toast.error(err.message);
        console.log(err);
      });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
        noValidate
      >
        {/* email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="your.email@example.com"
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="flex relative">
                  <Input {...field} type={showPass ? "text" : "password"} />
                  <span
                    className="absolute top-3 right-2 cursor-pointer"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? (
                      <FaEye className="h-5 w-5" />
                    ) : (
                      <FaEyeSlash className="h-5 w-5" />
                    )}
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-3 items-center pb-5">
          <Button className="w-full">Log In</Button>
          <Link
            href="/auth/forgot-password"
            className="text-xs self-end cursor-pointer hover:text-primary"
          >
            forgot password?
          </Link>

          <div className="flex items-center gap-x-5">
            <div className="flex bg-slate-200 w-20 h-[0.5px]" />
            or
            <div className="flex bg-slate-200 w-20 h-[0.5px]" />
          </div>
          <Button className="w-full" variant="secondary">
            <FaGoogle className="w-4 h-4 mr-2" />
            Google
          </Button>

          <Link href="/auth/register" className="text-xs hover:text-primary">
            {"Don't have an Account? Create New"}
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;

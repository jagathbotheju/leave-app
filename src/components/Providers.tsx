"use client";
import { Toaster } from "sonner";

interface Props {
  children: React.ReactNode;
}

const Providers = ({ children }: Props) => {
  return (
    <>
      <Toaster richColors />
      {children}
    </>
  );
};

export default Providers;

"use client";
import { Toaster } from "sonner";

interface Props {
  children: React.ReactNode;
}

const Providers = ({ children }: Props) => {
  return (
    <>
      <Toaster
        richColors
        duration={10000}
        toastOptions={{
          classNames: {
            title: "font-bold",
          },
        }}
      />
      {children}
    </>
  );
};

export default Providers;

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Leave Plan",
  description: "yearly leave plan",
  icons: {
    icon: [
      {
        url: "/images/favicon.svg",
        href: "/images/favicon.svg",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <main className="grow">
          <Providers>
            <SessionProvider session={session}>
              <Navbar />
              {children}
            </SessionProvider>
          </Providers>
        </main>
      </body>
    </html>
  );
}

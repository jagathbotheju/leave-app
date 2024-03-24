import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";

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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen flex flex-col dark:bg-slate-600`}
      >
        <main className="grow">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Providers>
              <SessionProvider session={session}>
                <Navbar />
                {children}
              </SessionProvider>
            </Providers>
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}

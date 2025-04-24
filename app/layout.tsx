import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ThemeProvider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Poppins } from "next/font/google";
import { PiggyBank } from "lucide-react";
import UserDropdown from "./UserDropdown";
import "./globals.css";
import { ModeToggle } from "@/components/ModeToggle";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MoneyBook",
  description: "An app for tracking your money.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${poppins.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <nav className="bg-background p-4 text-foreground h-20 flex items-center justify-between border-b">
              <Link
                className="font-bold text-2xl flex gap-1 items-center"
                href="/"
              >
                <PiggyBank />
                Money Book
              </Link>
              <div className="flex ">
                <SignedOut>
                  <div className="flex items-center">
                    <Button asChild variant="link" className="text-foreground">
                      <SignInButton />
                    </Button>
                    <Button asChild variant="link" className="text-foreground">
                      <SignUpButton />
                    </Button>
                  </div>
                </SignedOut>
                <SignedIn>
                  <UserDropdown />
                </SignedIn>
                <ModeToggle />
              </div>
            </nav>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

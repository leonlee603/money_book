import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Poppins } from "next/font/google";
import { PiggyBank } from "lucide-react";
import UserDropdown from "./UserDropdown";
import "./globals.css";

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
      <html lang="en">
        <body className={`${poppins.variable} antialiased`}>
          <nav className="bg-background p-4 text-foreground h-20 flex items-center justify-between">
            <Link
              className="font-bold text-2xl flex gap-1 items-center"
              href="/"
            >
              <PiggyBank />
              Money Book
            </Link>
            <div>
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
            </div>
          </nav>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

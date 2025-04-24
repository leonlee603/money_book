import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { PiggyBank } from "lucide-react";
import "./globals.css";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Money Book",
  description: "An app for tracking your money.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <nav className="bg-background p-4 text-foreground h-20 flex items-center justify-between">
          <Link className="font-bold text-2xl flex gap-1 items-center" href="/">
            <PiggyBank />
            Money Book
          </Link>
          {/* TODO Auth button */}
        </nav>
        {children}
      </body>
    </html>
  );
}

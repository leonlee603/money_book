import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-[400px] h-[calc(100vh-80px)] flex items-center justify-center bg-background relative">
      <div className="relative z-10 text-center flex flex-col gap-4">
        <h1 className="text-5xl font-bold flex gap-1 items-center justify-center">
          <PiggyBank size={60} /> Money Book
        </h1>
        <p className="text-2xl">A tool for tracking your finances</p>
        <SignedIn>
          <Button asChild size="lg">
            <Link href="/dashboard">Go To Dashboard</Link>
          </Button>
        </SignedIn>
        <SignedOut>
          <div className="flex gap-2 items-center justify-center">
            <Button asChild size="lg">
              <SignInButton />
            </Button>
            <Button asChild size="lg" variant="outline">
              <SignUpButton />
            </Button>
          </div>
        </SignedOut>
      </div>
    </main>
  );
}

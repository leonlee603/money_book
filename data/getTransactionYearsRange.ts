import "server-only";
import { auth } from "@clerk/nextjs/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { transactionsTable } from "@/db/schema";

export async function getTransactionYearsRange() {
  const { userId } = await auth();
  if (!userId) {
    return [];
  }

  // Get the user's earliest transaction from db.
  const [earliestTransaction] = await db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.userId, userId))
    .orderBy(asc(transactionsTable.transactionDate))
    .limit(1);
  // Get current year.
  const today = new Date();
  const currentYear = today.getFullYear();
  // Make sure at least has the current year.
  const earliestYear = earliestTransaction
    ? new Date(earliestTransaction.transactionDate).getFullYear()
    : currentYear;

  // Get year range.
  const years = Array.from({ length: currentYear - earliestYear + 1 }).map(
    (_, i) => currentYear - i
  );

  return years;
}

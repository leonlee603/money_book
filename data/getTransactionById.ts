import "server-only";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { transactionsTable } from "@/db/schema";

export async function getTransactionById(transactionId: number) {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const [transaction] = await db
    .select()
    .from(transactionsTable)
    .where(
      and(
        eq(transactionsTable.id, transactionId),
        eq(transactionsTable.userId, userId)
      )
    );

  return transaction;
}

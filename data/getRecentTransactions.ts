import "server-only";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categoriesTable, transactionsTable } from "@/db/schema";

// Get the user's latest 5 transactions.
export async function getRecentTransactions() {
  const { userId } = await auth();
  if (!userId) {
    return [];
  }

  const transactions = await db
    .select({
      id: transactionsTable.id,
      description: transactionsTable.description,
      amount: transactionsTable.amount,
      transactionDate: transactionsTable.transactionDate,
      category: categoriesTable.name,
      transactionType: categoriesTable.type,
    })
    .from(transactionsTable)
    .where(eq(transactionsTable.userId, userId))
    .orderBy(
      desc(transactionsTable.transactionDate),
      desc(transactionsTable.id)
    )
    .limit(5)
    .leftJoin(
      categoriesTable,
      eq(transactionsTable.categoryId, categoriesTable.id)
    );

  return transactions;
}

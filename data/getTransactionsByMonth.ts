import "server-only";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "@/db";
import { categoriesTable, transactionsTable } from "@/db/schema";

export async function getTransactionsByMonth({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const earliestDate = new Date(year, month - 1, 1);
  const latestDate = new Date(year, month, 0); // 0 get the last day of the previous month.

  const transactions = await db
    // Select the columns we want.
    .select({
      id: transactionsTable.id,
      transactionDate: transactionsTable.transactionDate,
      description: transactionsTable.description,
      transactionType: categoriesTable.type,
      category: categoriesTable.name,
      amount: transactionsTable.amount,
    })
    .from(transactionsTable)
    .where(
      // Conditions of the query.
      and(
        eq(transactionsTable.userId, userId),
        gte(
          transactionsTable.transactionDate,
          format(earliestDate, "yyyy-MM-dd")
        ),
        lte(transactionsTable.transactionDate, format(latestDate, "yyyy-MM-dd"))
      )
    )
    .orderBy(desc(transactionsTable.transactionDate))
    // Combine the data from 2 tables.
    .leftJoin(
      categoriesTable,
      eq(transactionsTable.categoryId, categoriesTable.id)
    );

  return transactions;
}

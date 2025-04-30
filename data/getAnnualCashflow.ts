import "server-only";
import { auth } from "@clerk/nextjs/server";
import { and, eq, sql, sum } from "drizzle-orm";
import { db } from "@/db";
import { categoriesTable, transactionsTable } from "@/db/schema";

export async function getAnnualCashflow(year: number) {
  const { userId } = await auth();
  if (!userId) {
    return [];
  }

  const month = sql`EXTRACT(MONTH FROM ${transactionsTable.transactionDate})`;

  // Get the cashflow for months with income or expenses
  // cashflow = [
  //   { month: '3', totalIncome: '40000', totalExpenses: '0' },
  //   { month: '4', totalIncome: '50000', totalExpenses: '53.5' }
  // ]
  const cashflow = await db
    .select({
      month,
      totalIncome: sum(
        sql`CASE WHEN ${categoriesTable.type} = 'income' THEN ${transactionsTable.amount} ELSE 0 END`
      ),
      totalExpenses: sum(
        sql`CASE WHEN ${categoriesTable.type} = 'expense' THEN ${transactionsTable.amount} ELSE 0 END`
      ),
    })
    .from(transactionsTable)
    .leftJoin(
      categoriesTable,
      eq(transactionsTable.categoryId, categoriesTable.id)
    )
    .where(
      and(
        eq(transactionsTable.userId, userId),
        sql`EXTRACT(YEAR FROM ${transactionsTable.transactionDate}) = ${year}`
      )
    )
    .groupBy(month);

  // Generate the cashflow from Jan to Dec
  // annualCashflow = [
  //   { month: 1, income: 0, expenses: 0 },
  //   { month: 2, income: 0, expenses: 0 },
  //   { month: 3, income: 40000, expenses: 0 },
  //   { month: 4, income: 50000, expenses: 53.5 },
  //   { month: 5, income: 0, expenses: 0 },
  //   { month: 6, income: 0, expenses: 0 },
  //   { month: 7, income: 0, expenses: 0 },
  //   { month: 8, income: 0, expenses: 0 },
  //   { month: 9, income: 0, expenses: 0 },
  //   { month: 10, income: 0, expenses: 0 },
  //   { month: 11, income: 0, expenses: 0 },
  //   { month: 12, income: 0, expenses: 0 }
  // ]
  const annualCashflow: {
    month: number;
    income: number;
    expenses: number;
  }[] = [];

  for (let i = 1; i <= 12; i++) {
    const monthlyCashflow = cashflow.find((cf) => Number(cf.month) === i);
    annualCashflow.push({
      month: i,
      income: Number(monthlyCashflow?.totalIncome ?? 0),
      expenses: Number(monthlyCashflow?.totalExpenses ?? 0),
    });
  }

  return annualCashflow;
}

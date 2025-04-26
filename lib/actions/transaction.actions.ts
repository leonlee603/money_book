"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { transactionsTable } from "@/db/schema";
import { transactionSchema } from "@/validation/transactionSchema";

export const createTransaction = async (data: {
  categoryId: number;
  transactionDate: string;
  amount: number;
  description: string;
}) => {
  const { userId } = await auth();

  if (!userId) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  const validation = transactionSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0].message,
    };
  }

  const [transaction] = await db
    .insert(transactionsTable)
    .values({
      userId,
      categoryId: data.categoryId,
      transactionDate: data.transactionDate,
      amount: data.amount.toString(),
      description: data.description,
    })
    .returning();

  return {
    id: transaction.id,
  };
};

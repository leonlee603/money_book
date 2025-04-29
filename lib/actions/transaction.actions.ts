"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
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

const updateTransactionSchema = transactionSchema.and(
  z.object({
    id: z.number(),
  })
);

export async function updateTransaction(data: {
  id: number;
  categoryId: number;
  transactionDate: string;
  amount: number;
  description: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  const validation = updateTransactionSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0].message,
    };
  }

  await db
    .update(transactionsTable)
    .set({
      categoryId: data.categoryId,
      transactionDate: data.transactionDate,
      amount: data.amount.toString(),
      description: data.description,
    })
    .where(
      and(
        eq(transactionsTable.id, data.id),
        eq(transactionsTable.userId, userId)
      )
    );
}

export async function deleteTransaction(transactionId: number) {
  const { userId } = await auth();

  if (!userId) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  await db
    .delete(transactionsTable)
    .where(
      and(
        eq(transactionsTable.id, transactionId),
        eq(transactionsTable.userId, userId)
      )
    );
}

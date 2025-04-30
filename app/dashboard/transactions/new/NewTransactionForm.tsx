"use client";

import { z } from "zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import TransactionForm, {
  transactionFormSchema,
} from "@/components/TransactionForm";
import { type Category } from "@/types/Category";
import { createTransaction } from "@/lib/actions/transaction.actions";

export default function NewTransactionForm({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();

  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    const result = await createTransaction({
      categoryId: data.categoryId,
      transactionDate: format(data.transactionDate, "yyyy-MM-dd"),
      amount: data.amount,
      description: data.description,
    });

    if (result.error) {
      toast.error(`${result.message}`);
      return;
    }

    toast.success("Transaction created");

    router.push(
      `/dashboard/transactions?month=${
        data.transactionDate.getMonth() + 1
      }&year=${data.transactionDate.getFullYear()}`
    );

    // console.log(result.id);
  };
  return <TransactionForm onSubmit={handleSubmit} categories={categories} />;
}

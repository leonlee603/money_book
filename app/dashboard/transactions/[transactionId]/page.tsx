import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategories } from "@/data/getCategories";
import { getTransactionById } from "@/data/getTransactionById";

import EditTransactionForm from "./EditTransactionForm";
import DeleteTransactionDialog from "../../../../components/DeleteTransactionDialog";

export default async function EditTransactionPage({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) {
  const paramsValues = await params;
  const transactionId = Number(paramsValues.transactionId);

  if (isNaN(transactionId)) {
    notFound();
  }

  const categories = await getCategories();
  const transaction = await getTransactionById(transactionId);

  if (!transaction) {
    notFound();
  }

  return (
    <Card className="mt-4 max-w-screen-md">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Edit Transaction</span>
          <DeleteTransactionDialog
            transactionId={transaction.id}
            transactionDate={transaction.transactionDate}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EditTransactionForm
          transaction={transaction}
          categories={categories}
        />
      </CardContent>
    </Card>
  );
}

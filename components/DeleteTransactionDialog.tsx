"use client";

import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { deleteTransaction } from "@/lib/actions/transaction.actions";

export default function DeleteTransactionDialog({
  transactionId,
  transactionDate,
}: {
  transactionId: number;
  transactionDate: string;
}) {
  const router = useRouter();

  const handleDeleteConfirm = async () => {
    const result = await deleteTransaction(transactionId);

    if (result?.error) {
      toast.error(`${result.message}`);
      return;
    }

    toast.success("Transaction deleted");

    const [year, month] = transactionDate.split("-");

    router.push(`/dashboard/transactions?month=${month}&year=${year}`);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild  className="cursor-pointer">
        <Button variant="destructive" size="icon">
          <Trash2Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This transaction will be permanently
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <Button className="cursor-pointer" onClick={handleDeleteConfirm} variant="destructive">
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

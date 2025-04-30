import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategories } from "@/data/getCategories";
import NewTransactionForm from "./NewTransactionForm";

export default async function NewTransactionPage() {
  const categories = await getCategories();
  // console.log({ categories });

  return (
    <Card className="mt-4 max-w-screen-md">
        <CardHeader>
          <CardTitle className="text-xl">New Transaction</CardTitle>
        </CardHeader>
        <CardContent><NewTransactionForm categories={categories}/></CardContent>
      </Card>
  );
}

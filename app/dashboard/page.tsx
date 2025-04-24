import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
    <div>Dashboard page</div>
    <Link href="/dashboard/transactions/new">New Transaction</Link>
    </div>
  )
}
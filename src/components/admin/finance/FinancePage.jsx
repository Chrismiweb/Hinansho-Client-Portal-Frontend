import OverviewCards from "./OverviewCards";
import TransactionsTable from "./TransactionsTable";

export default function FinancePage() {
  return (
    <div className="min-h-screen">
      <div className="w-full">
        <OverviewCards />
        <TransactionsTable />
      </div>
    </div>
  );
}

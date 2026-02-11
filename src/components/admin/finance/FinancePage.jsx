import OverviewCards from "./OverviewCards";
import TransactionsTable from "./TransactionsTable";

export default function FinancePage() {
  return (
    <div className="min-h-screen">
      <div className="w-full lg:items-start lg:justify-start justify-center items-center flex flex-col">
        <OverviewCards />
        <TransactionsTable />
      </div>
    </div>
  );
}

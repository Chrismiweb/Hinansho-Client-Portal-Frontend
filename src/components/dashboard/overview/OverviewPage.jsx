import BalanceCard from "./BalanceCard";
import StatsCard from "./StatsCard";
import RecentActivities from "./RecentActivities";
import ProfitLoss from "./ProfitLoss";

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      {/* Top section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <BalanceCard />
        </div>
        <StatsCard />
      </div>

      {/* Activities */}
      <RecentActivities />

      {/* Profit & Loss */}
      <ProfitLoss />
    </div>
  );
}

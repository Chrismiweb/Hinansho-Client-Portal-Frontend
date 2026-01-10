import BalanceCard from "./BalanceCard";
import StatsCard from "./StatsCard";
import RecentActivities from "./RecentActivities";
import ProfitLoss from "./ProfitLoss";

export default function OverviewPage() {
  return (
    <div className="flex w-full pb-[73px] justify-between ">
        <div className="w-[72%] flex flex-col gap-9.25">
            {/* Top section */}
            <BalanceCard />
            {/* Activities */}
            <RecentActivities />
            {/* Profit & Loss */}
            <ProfitLoss />
        </div>
        <div className="w-[27%]">
        <StatsCard />
        </div>
    </div>
  );
}

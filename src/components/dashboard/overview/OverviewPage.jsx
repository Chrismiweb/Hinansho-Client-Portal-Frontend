import BalanceCard from "./BalanceCard";
import StatsCard from "./StatsCard";
import RecentActivities from "./RecentActivities";
import ProfitLoss from "./ProfitLoss";

export default function OverviewPage() {
  return (
    <div className="flex flex-col lg:flex-row w-full items-center lg:items-start pb-[73px] justify-center lg:justify-between ">
        <div className="w-[90%] lg:w-[72%] flex flex-col gap-9.25">
            {/* Top section */}
            <BalanceCard />
            {/* Activities */}
            <RecentActivities />
            {/* Profit & Loss */}
            <ProfitLoss />
        </div>
        <div className="w-[90%] md:w-[70%] mt-[30px] lg:mt-0 lg:w-[27%]">
        <StatsCard />
        </div>
    </div>
  );
}

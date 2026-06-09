import BalanceCard from "./BalanceCard";
import StatsCard from "./StatsCard";
import RecentActivities from "./RecentActivities";
import InvestmentAlternatives from "./InvestmentAlternatives";

export default function OverviewPage() {
  return (
    <div className="flex flex-col lg:flex-row w-full items-center lg:items-start pb-[73px] justify-center lg:justify-between">

      {/* Main content */}
      <div className="w-[90%] lg:w-[72%] flex flex-col gap-[30px]">
        <BalanceCard />

        {/* StatsCard — shows here on mobile only, hidden on desktop */}
        <div className="block lg:hidden w-full">
          <StatsCard />
        </div>

        <RecentActivities />
        <InvestmentAlternatives />
      </div>

      {/* Sidebar — shows here on desktop only, hidden on mobile */}
      <div className="hidden lg:block w-[27%]">
        <StatsCard />
      </div>

    </div>
  );
}

import { LuWallet } from "react-icons/lu";
export default function BalanceCard() {
  return (
    <div className="bg-white border-2 border-[#F1F5F9] rounded-3xl p-6 shadow-sm">
      <p className="text-[20px] text-[#62748E] mb-1">Total Balance</p>

      <div className=" gap-3 mb-4">
        <h2 className="text-[50px] font-bold">$689,372.00</h2>
        <span className="text-[16px] font-bold bg-[#F0FDF4] text-[#008236] px-2 py-1 rounded-full">
          ↑ 5% more than last month
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <SummaryCard
          title="TOTAL EARNINGS"
          value="$22,678.00"
          badge="↓ 5%"
          dark
          icon={<LuWallet />}
        />
        <SummaryCard
          title="PROPERTIES"
          value="12"
          badge="↑ 8%"
          dark
            icon={<LuWallet />}
        />
        <SummaryCard
          title="DOCUMENTS"
          value="15"
          subtitle="All up to date"
            icon={<LuWallet />  }
        />
      </div>
    </div>
  );
}

function SummaryCard({ title, value, badge, subtitle, dark, icon }) {
  return (
    <div
      className={`rounded-2xl px-6 pt-[24px] pb-[28px] ${
        dark
          ? "bg-[#0F172B] text-white"
          : "bg-white shadow-lg border-2 border-[#F1F5F9]"
      }`}
    >
        <div className="text-[25px] p-3 inline-block mb-2 bg-[#FFFFFF33] rounded-[10px]">{icon}</div>
      <p className="text-[14px] text-[#90A1B9] font-bold">{title}</p>
      <h3 className="text-[20px] font-bold mt-1">{value}</h3>

      {badge && (
        <p className="text-[14px] mt-2 inline-block rounded-xl px-3 py-1.25 bg-[#FEF2F21A] text-red-400">{badge}</p>
      )}

      {subtitle && (
        <p className="text-[14px] mt-2 inline-block px-3 py-1.25 rounded-xl bg-[#F8FAFC] text-[#90A1B9]">{subtitle}</p>
      )}
    </div>
  );
}

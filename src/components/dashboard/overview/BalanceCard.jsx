export default function BalanceCard() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <p className="text-sm text-gray-500 mb-1">Total Balance</p>

      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-3xl font-semibold">$689,372.00</h2>
        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
          ↑ 5% more than last month
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <SummaryCard
          title="TOTAL EARNINGS"
          value="$22,678.00"
          badge="↓ 5%"
          dark
        />
        <SummaryCard
          title="PROPERTIES"
          value="12"
          badge="↑ 8%"
          dark
        />
        <SummaryCard
          title="DOCUMENTS"
          value="15"
          subtitle="All up to date"
        />
      </div>
    </div>
  );
}

function SummaryCard({ title, value, badge, subtitle, dark }) {
  return (
    <div
      className={`rounded-2xl p-4 ${
        dark
          ? "bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white"
          : "bg-gray-50"
      }`}
    >
      <p className="text-xs text-gray-400">{title}</p>
      <h3 className="text-lg font-semibold mt-1">{value}</h3>

      {badge && (
        <p className="text-xs mt-2 text-red-400">{badge}</p>
      )}

      {subtitle && (
        <p className="text-xs mt-2 text-gray-400">{subtitle}</p>
      )}
    </div>
  );
}

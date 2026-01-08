export default function StatsCard() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Statistics</h3>
        <span className="text-xs text-gray-500">This week</span>
      </div>

      {/* Donut Placeholder */}
      <div className="relative w-40 h-40 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full border-[14px] border-yellow-400 border-b-gray-900 border-l-gray-900 rotate-45" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs text-gray-400">TOTAL INCOME</p>
            <p className="font-semibold text-lg">$14,810</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <StatRow label="Rental Income" value="$9,560" />
        <StatRow label="Investments" value="$5,250" />
      </div>
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

const StatsCard = () => {
  const stats = {
    rental: 9560,
    investments: 5250,
  };

  const total = stats.rental + stats.investments;
  const rentalPercent = (stats.rental / total) * 100;

  const radius = 70;
  const stroke = 14;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (rentalPercent / 100) * circumference;

  return (
    <div className="border-2 border-[#F1F5F9] rounded-3xl shadow-sm p-6 w-full max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900">Statistics</h2>
        <button className="text-sm px-3 py-1 rounded-full bg-slate-100 text-slate-600">
          This week ⌄
        </button>
      </div>

      {/* Donut Chart */}
      <div className="relative flex items-center justify-center mb-8">
        <svg width="180" height="180">
          {/* Background ring */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="#1E293B"
            strokeWidth={stroke}
            fill="none"
          />

          {/* Progress ring */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="#DDA04E"
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center text */}
        <div className="absolute text-center">
        <p className="text-xs tracking-widest text-[#90A1B9]">
            TOTAL INCOME
          </p>
          <p className="text-[27px] font-bold text-[#0F172B]">
            ${total.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Breakdown cards */}
      <div className="space-y-4">
        {/* Rental */}
        <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-slate-200">
              🏢
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                Rental Income
              </p>
              <p className="text-sm text-slate-500">
                {Math.round(rentalPercent)}% of total
              </p>
            </div>
          </div>
          <p className="font-bold text-slate-900">
            ${stats.rental.toLocaleString()}
          </p>
        </div>

        {/* Investments */}
        <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-[#F3E3C2]">
              📈
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                Investments
              </p>
              <p className="text-sm text-slate-500">
                {100 - Math.round(rentalPercent)}% of total
              </p>
            </div>
          </div>
          <p className="font-bold text-slate-900">
            ${stats.investments.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

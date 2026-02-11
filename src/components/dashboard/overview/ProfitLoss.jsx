const ProfitLoss = () => {
  const data = [
    { month: "Jan", profit: 70, loss: 30 },
    { month: "Feb", profit: 75, loss: 25 },
    { month: "Mar", profit: 68, loss: 32 },
    { month: "Apr", profit: 80, loss: 55 },
    { month: "May", profit: 85, loss: 90 },
    { month: "Jun", profit: 78, loss: 103 },
  ];

  return (
    <div className="border-2 border-[#F1F5F9] rounded-3xl bg-white shadow-sm p-[38px]">
      {/* Header */}
      <div className="flex flex-col-reverse md:flex-row items-start justify-between mb-[38px]">
        <div>
          <h2 className="mt-[14px] md:mt-0 text-[22px] md:text-[30px] lg:text-[24px] font-bold text-[#0F172B]">
            Profit and Loss
          </h2>
          <p className="text-[16px] md:text-[18px] lg:text-[16px] text-[#62748E]">
            View your income in a certain period of time
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#D9A441]" />
            <span className="text-[#45556C] text-[16px]">Profit</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#1E293B]" />
            <span className="text-[#45556C] text-[16px]">Loss</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between px-4">
        {data.map((item) => {
          const total = item.profit + item.loss;
          const profitHeight = (item.profit / total) * 100;
          const lossHeight = (item.loss / total) * 100;

          return (
            <div
                key={item.month}
                className="flex flex-col items-center gap-3"
                >
                {/* Bar */}
                <div className="relative w-6 h-[270px] flex flex-col justify-end">
                    
                    {/* Loss */}
                    <div
                    style={{ height: `${lossHeight}%` }}
                    className="bg-[#1E293B] rounded-t-full"
                    />

                    {/* Profit */}
                    <div
                    style={{ height: `${profitHeight}%` }}
                    className="bg-[#DDA04E] "
                    />

                </div>

                {/* Month */}
                <span className="text-sm text-slate-400">
                    {item.month}
                </span>
            </div>

          );
        })}
      </div>
    </div>
  );
};

export default ProfitLoss;

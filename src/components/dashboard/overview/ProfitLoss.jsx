export default function ProfitLoss() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex justify-between mb-6">
        <div>
          <h3 className="font-semibold">Profit and Loss</h3>
          <p className="text-sm text-gray-400">
            View your income in a certain period of time
          </p>
        </div>

        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-yellow-400 rounded-full" />
            Profit
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-gray-900 rounded-full" />
            Loss
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between h-48 gap-4">
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
          <div key={m} className="flex flex-col items-center gap-2">
            <div className="relative w-6 h-36 bg-yellow-400 rounded-full">
              <div className="absolute top-0 w-full h-6 bg-gray-900 rounded-full" />
            </div>
            <span className="text-xs text-gray-400">{m}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

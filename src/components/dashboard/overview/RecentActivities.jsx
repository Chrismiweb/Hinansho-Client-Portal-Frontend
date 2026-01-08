export default function RecentActivities() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold">Recent Activities</h3>
        <span className="text-sm text-gray-400">Filter</span>
      </div>

      <div className="space-y-4">
        <Activity
          title="Monthly Rent - Unit 304"
          amount="$25,500"
          status="Completed"
          date="17 Apr, 2024"
        />
        <Activity
          title="Plumbing Repair"
          amount="$32,750"
          status="Pending"
          date="15 Apr, 2024"
        />
        <Activity
          title="Security Deposit Return"
          amount="$40,200"
          status="Completed"
          date="15 Apr, 2024"
        />
      </div>
    </div>
  );
}

function Activity({ title, amount, status, date }) {
  const isCompleted = status === "Completed";

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-gray-400">{date}</p>
      </div>

      <div className="text-right">
        <p className="text-sm font-medium">{amount}</p>
        <span
          className={`text-xs ${
            isCompleted ? "text-green-500" : "text-yellow-500"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

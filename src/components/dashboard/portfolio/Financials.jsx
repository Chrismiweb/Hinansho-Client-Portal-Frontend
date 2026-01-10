import { FiDownload } from "react-icons/fi";
export default function Financials() {
  const rentals = [
    {
      date: "2024-06-15",
      description: "Monthly Rent - Unit 304",
      status: "completed",
      amount: 850,
    },
    {
      date: "2024-06-01",
      description: "Monthly Rent - Unit 102",
      status: "completed",
      amount: 850,
    },
  ];

  return (
    <div className="mt-6 bg-white rounded-t-2xl border border-[#0000001A] p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-[17px] font-semibold">
            Rental Income Log
          </h3>
          <p className="text-[16px] text-[#717182]">
            Recent rental payments and payouts
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 text-sm border border-[#00000000] rounded-lg shadow-sm hover:bg-gray-50">
          <FiDownload className="text-[18px]" />
          Download CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[16px]  border-b border-b-[#0000001A]">
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Description</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium text-right">Amount</th>
            </tr>
          </thead>

          <tbody>
            {rentals.map((item, index) => (
              <tr
                key={index}
                className="border-b text-[16px] border-b-[#0000001A] last:border-none"
              >
                <td className="py-4">
                  {item.date}
                </td>

                <td className="py-4">
                  {item.description}
                </td>

                <td className="py-4">
                  <span className="inline-flex items-center px-3 py-1 text-[14px] rounded-[8px] bg-[#F0FDF4] text-[#008236]">
                    {item.status}
                  </span>
                </td>

                <td className="py-4 text-right font-medium ">
                  +${item.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

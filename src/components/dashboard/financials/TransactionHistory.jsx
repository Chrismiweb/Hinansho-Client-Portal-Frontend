import TransactionRow from "./TransactionRow";
import { CiSearch } from "react-icons/ci";
import { CiFilter } from "react-icons/ci";

export default function TransactionHistory() {
  return (
    <div className="bg-white rounded-[37px] p-6 border-2 border-[#F1F5F9]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[24px] font-semibold">
          Transaction History
        </h3>

        <div className="flex items-center gap-3">
          <div className="relative">
            <CiSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="pl-9 pr-4 py-2 border-2 border-[#E2E8F0] bg-[#F8FAFC] w-74 placeholder:font-semibold rounded-lg text-sm"
              placeholder="Search transactions..."
            />
          </div>
          <button className="border-2 rounded-lg border-[#E2E8F0] bg-[#F8FAFC] p-2">
            <CiFilter className="text-[#717182]" />
          </button>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead className="text-left bg-[#F8FAFC] border-b border-[#0000001A]">
          <tr>
            <th className="py-3">Transaction ID</th>
            <th>Description</th>
            <th>Date</th>
            <th>Status</th>
            <th>Amount</th>
            <th></th>

          </tr>
        </thead>

        <tbody className="divide-y">

          <TransactionRow
            id="INV_00076"
            desc="Monthly Rent - Unit 304"
            type="Income"
            date="17 Apr, 2024"
            status="Completed"
            amount="+$25,500"
            positive
          />

          <TransactionRow
            id="INV_00075"
            desc="Plumbing Repair"
            type="Expense"
            date="15 Apr, 2024"
            status="Pending"
            amount="-$32,750"
          />
        </tbody>
      </table>
    </div>
  );
}

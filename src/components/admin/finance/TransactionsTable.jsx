import TransactionRow from "./TransactionRow";
import { CiSearch } from "react-icons/ci";
import { CiFilter } from "react-icons/ci";

export default function TransactionsTable() {
  return (
    <div className="bg-white rounded-[24px] p-6 border-2 border-[#F1F5F9] mt-[32px]">
        <div className="flex items-center w-full justify-between gap-3">
          <div className="relative">
            <CiSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="pl-9 pr-4 py-2 border-2 border-[#E2E8F0] bg-[#F3F3F5] w-74 rounded-[14px] text-sm"
              placeholder="Search transactions..."
            />
          </div>
          <button className="border-2 rounded-lg border-[#E2E8F0] bg-[#F8FAFC] p-2">
            <CiFilter className="text-[#717182]" />
          </button>
        </div>

      <table className="w-full text-sm mt-[26px]">
        <thead className="text-left  text-[#45556C] bg-[#F8FAFC] border-b border-[#F8FAFC]">
          <tr>
            <th className="py-3">ID</th>
            <th>Date</th>
            <th>Description</th>
            <th>Entity</th>
            <th>Amount</th>
            <th>Status</th>
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
            entity="John Doe"
            positive
          />

          <TransactionRow
            id="INV_00075"
            desc="Plumbing Repair"
            type="Expense"
            date="15 Apr, 2024"
            status="Pending"
            entity="ACME Plumbing"
            amount="-$32,750"
          />
        </tbody>
      </table>
    </div>
  );
}

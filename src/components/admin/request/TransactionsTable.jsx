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
            <th>Issue / Requester</th>
            <th>Location</th>
            <th>Date</th>
            <th>Priority</th>
            <th>Status</th>
            <th></th>

          </tr>
        </thead>

        <tbody className="divide-y-0">

          <TransactionRow
            id="#62748E"
            issue="AC Not Cooling"
            requester="John Doe"
            date="2024-06-14"
            status="Completed"
            entity="John Doe"
            location="Pavilion - Unit 304"
            unit="Unit 12B"
            positive
            priority="High"
          />

          <TransactionRow
            id="#62748E"
            issue="Plumbing Repair"
            requester="Jane Smith"
            date="2024-06-15"
            status="Pending"
            entity="ACME Plumbing"
            priority="Medium"
            location="Sunset Villas - Unit 202"
            unit="Unit 5A"

          />
          <TransactionRow
            id="#62748E"
            issue="Electrical Issue"
            requester="Mike Johnson"
            date="2024-06-16"
            status="In Progress"
            entity="Bright Electric"
            priority="Low"
            location="Oceanview Apartments - Unit 101"
            unit="Unit 3C"/>
        </tbody>
      </table>
    </div>
  );
}

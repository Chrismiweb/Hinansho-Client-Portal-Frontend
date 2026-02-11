// import TransactionRow from "./TransactionRow";
// import { CiSearch } from "react-icons/ci";
// import { CiFilter } from "react-icons/ci";

// export default function TransactionsTable() {
//   return (
//     <div className="bg-white rounded-[24px] p-6 border-2 border-[#F1F5F9] mt-[32px]">
//         <div className="flex items-center w-full justify-between gap-3">
//           <div className="relative">
//             <CiSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input
//               className="pl-9 pr-4 py-2 border-2 border-[#E2E8F0] bg-[#F3F3F5] w-74 rounded-[14px] text-sm"
//               placeholder="Search transactions..."
//             />
//           </div>
//           <button className="border-2 rounded-lg text-[14px] cursor-pointer shadow-sm border-[#E2E8F0] flex justify-center items-center gap-[8px] bg-[#F8FAFC] p-2">
//             <CiFilter className="" />
//             <p>All Types</p>
//           </button>
//         </div>

//       <table className="w-full text-sm mt-[26px]">
//         <thead className="text-left  text-[#45556C] bg-[#F8FAFC] border-b border-[#F8FAFC]">
//           <tr>
//             <th className="py-3">ID</th>
//             <th>Date</th>
//             <th>Description</th>
//             <th>Entity</th>
//             <th>Amount</th>
//             <th>Status</th>
//             <th></th>

//           </tr>
//         </thead>

//         <tbody className="divide-y-0">

//           <TransactionRow
//             id="INV_00076"
//             desc="Monthly Rent - Unit 304"
//             type="Income"
//             date="17 Apr, 2024"
//             status="Completed"
//             amount="+$25,500"
//             entity="John Doe"
//             positive
//           />

//           <TransactionRow
//             id="INV_00075"
//             desc="Plumbing Repair"
//             type="Expense"
//             date="15 Apr, 2024"
//             status="Pending"
//             entity="ACME Plumbing"
//             amount="-$32,750"
//           />
//         </tbody>
//       </table>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import TransactionRow from "./TransactionRow";
import { CiSearch, CiFilter } from "react-icons/ci";
import ViewTransactionModal from "./ViewTransactionModal";

const transactions = [
  {
    id: "INV_00076",
    desc: "Monthly Rent - Unit 304",
    type: "Income",
    date: "17 Apr, 2024",
    status: "Completed",
    amount: "+$25,500",
    entity: "John Doe",
    positive: true,
  },
  {
    id: "INV_00075",
    desc: "Plumbing Repair",
    type: "Expense",
    date: "15 Apr, 2024",
    status: "Pending",
    amount: "-$32,750",
    entity: "ACME Plumbing",
  },
];

export default function TransactionsTable() {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [openAction, setOpenAction] = useState(null); // "view" | "edit" | "delete
   const [selectedTransaction, setSelectedTransaction] = useState(null);

//   const handleAction = (action, id) => {
//     setActiveAction(action);
//     setActiveId(id);
//   };

  const filteredTransactions =
    filter === "All"
      ? transactions
      : transactions.filter(t => t.type === filter);

  return (
    <div className="bg-white rounded-[24px] p-6 border-2 lg:w-full w-[95%] border-[#F1F5F9] mt-[32px]">
      {/* Top controls */}
      <div className="flex items-center w-full justify-between gap-3">
        {/* Search */}
        <div className="relative">
          <CiSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="pl-9 pr-4 py-2 border-2 border-[#E2E8F0] bg-[#F3F3F5] w-[80%] md:w-74 rounded-[14px] text-sm"
            placeholder="Search transactions..."
          />
        </div>

        {/* Filter */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="border-2 rounded-lg text-sm md:text-[14px] cursor-pointer shadow-sm border-[#E2E8F0] flex items-center gap-[8px] bg-[#F8FAFC] px-3 py-2"
          >
            <CiFilter />
            <span className="hidden md:flex">{filter === "All" ? "All Types" : filter}</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-10">
              {["All", "Income", "Expense"].map(option => (
                <button
                  key={option}
                  onClick={() => {
                    setFilter(option);
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-[#F8FAFC]"
                >
                  {option === "All" ? "All Types" : option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-sm mt-[26px]">
        <thead className="text-left text-[#45556C] bg-[#F8FAFC]">
          <tr>
            <th className="py-3">ID</th>
            <th>Date</th>
            <th>Description</th>
            <th className="hidden md:table-cell">Entity</th>
            <th className="hidden md:table-cell">Amount</th>
            <th className="hidden md:table-cell">Status</th>

            <th />
          </tr>
        </thead>

        <tbody>
          {filteredTransactions.map(tx => (
            <TransactionRow key={tx.id} {...tx}  
            onAction={(action, transaction) => {
                setSelectedTransaction(transaction);
                setOpenAction(action);
              }}
            />
          ))}
        </tbody>
      </table>
    {/* OVERLAYS */}
        {/* {activeAction === "view" && (
        <ViewTransactionModal
            transaction={selectedTransaction}
            onClose={() => setActiveAction(null)}
        />
        )} */}
        {/* View Details Modal */}
      {openAction === "view" && selectedTransaction && (
        <ViewTransactionModal
          transaction={selectedTransaction}
          onClose={() => {
            setOpenAction(null);
            setSelectedTransaction(null);
          }}
        />
      )}
    </div>
  );
}

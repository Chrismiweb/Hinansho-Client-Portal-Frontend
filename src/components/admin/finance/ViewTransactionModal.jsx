"use client";

import { IoClose } from "react-icons/io5";
import { FiCalendar, FiTag, FiFileText, FiUser } from "react-icons/fi";

export default function ViewTransactionModal({ transaction, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[520px] bg-white rounded-2xl shadow-xl p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <IoClose size={22} />
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold text-[#0F172A]">
          Transaction Details
        </h2>
        <p className="text-sm text-[#64748B] mt-1">
          View details for transaction {transaction.id}
        </p>

        {/* Amount Card */}
        <div className="mt-6 bg-[#F8FAFC] rounded-xl p-5 flex justify-between items-center">
          <div>
            <p className="text-sm text-[#64748B]">Amount</p>
            <p className="text-2xl font-bold text-[#16A34A]">
              {transaction.amount}
            </p>
          </div>

          <span className="px-4 py-1 text-sm rounded-full bg-[#DCFCE7] text-[#15803D] font-medium">
            Completed
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-6 mt-6 text-sm">
          <div>
            <p className="text-xs text-[#94A3B8] mb-1">DATE</p>
            <div className="flex items-center gap-2 text-[#0F172A]">
              <FiCalendar />
              {transaction.date}
            </div>
          </div>

          <div>
            <p className="text-xs text-[#94A3B8] mb-1">TYPE</p>
            <div className="flex items-center gap-2 text-[#0F172A]">
              <FiTag />
              {transaction.type}
            </div>
          </div>

          <div className="col-span-2">
            <p className="text-xs text-[#94A3B8] mb-1">DESCRIPTION</p>
            <div className="flex items-center gap-2 text-[#0F172A]">
              <FiFileText />
              {transaction.description}
            </div>
          </div>

          <div className="col-span-2">
            <p className="text-xs text-[#94A3B8] mb-1">PAYER (TENANT)</p>
            <div className="flex items-center gap-2 text-[#0F172A]">
              <FiUser />
              {transaction.payer}
            </div>
          </div>
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full mt-8 border border-[#E2E8F0] rounded-lg py-2 text-sm font-medium hover:bg-[#F8FAFC]"
        >
          Close
        </button>
      </div>
    </div>
  );
}

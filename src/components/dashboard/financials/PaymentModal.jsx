"use client";

import { IoClose } from "react-icons/io5";
import InitialInvestmentPayment from "./InitialInvestmentPayment";
import RenovationFundPayment from "./RenovationFundPayment";

export default function PaymentModal({ isOpen, onClose, plan }) {
  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-md rounded-[24px] overflow-hidden shadow-xl relative">
        
        {/* Close */}
        {/* <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500"
        >
          <IoClose size={22} />
        </button> */}

        {/* Conditional Content */}
        {plan.type === "initial" && (
          <InitialInvestmentPayment plan={plan} onClose={onClose} />
        )}

        {plan.type === "renovation" && (
          <RenovationFundPayment plan={plan} onClose={onClose} />
        )}
      </div>
    </div>
  );
}

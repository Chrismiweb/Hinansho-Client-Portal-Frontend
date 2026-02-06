// import { RxBorderDotted } from "react-icons/rx";
// export default function TransactionRow({
//   id,
//   desc,
//   type,
//   date,
//   status,
//   amount,
//   positive,
//   entity
// }) {
//   return (
//     <tr>
//       <td className="py-4 text-[#62748E]">{id}</td>
//       <td>
//         <span className="text-[14px]">{date}</span>
//       </td>
//       <td className="text-[14px]">{desc}</td>
//       <td className="text-[14px] text-[#62748E]">{entity}</td>


//       <td
//         className={` font-medium ${
//           positive ? "text-[#00A63E]" : ""
//         }`}
//       >
//         {amount}
//       </td>
//       <td>
//         <span
//           className={`text-xs px-3 py-1 rounded-full ${
//             status === "Completed"
//               ? "bg-[#DCFCE7] text-[#008236]"
//               : "bg-[#FEF3C6] text-[#BB4D00]"
//           }`}
//         >
//           {status}
//         </span>
//       </td>
//       <td className="text-right text-[20px]"><RxBorderDotted/></td>
//     </tr>
//   );
// }


"use client";

import { useState } from "react";
import { RxBorderDotted } from "react-icons/rx";
import { FiEye, FiDownload, FiEdit2, FiTrash2 } from "react-icons/fi";

export default function TransactionRow({
  id,
  desc,
  type,
  date,
  status,
  amount,
  positive,
  entity,
  onAction, // 🔑 callback from parent
}) {
  const [open, setOpen] = useState(false);

  return (
    <tr className="relative">
      <td className="py-4 text-[#62748E]">{id}</td>
      <td className="text-[14px]">{date}</td>
      <td className="text-[14px]">{desc}</td>
      <td className="text-[14px] text-[#62748E] hidden md:table-cell">{entity}</td>

      <td className={`font-medium hidden md:table-cell ${positive ? "text-[#00A63E]" : ""}`}>
        {amount}
      </td>

      <td className="hidden md:table-cell"> 
        <span
          className={`text-xs px-3 py-1 rounded-full ${
            status === "Completed"
              ? "bg-[#DCFCE7] text-[#008236]"
              : "bg-[#FEF3C6] text-[#BB4D00]"
          }`}
        >
          {status}
        </span>
      </td>

      {/* ACTIONS */}
      <td className="text-right relative hidden md:table-cell">
        <button
          onClick={() => setOpen(!open)}
          className="text-[20px] text-[#94A3B8]"
        >
          <RxBorderDotted />
        </button>

        {open && (
          <div className="absolute right-0 top-8 w-56 bg-white rounded-xl shadow-lg border border-[#E2E8F0] z-20">
            <p className="px-4 py-2 text-sm font-medium text-left">
              Actions
            </p>

            <button
              onClick={() => {
                setOpen(false);
                onAction("view", id);
              }}
              className="w-full px-4 py-2 flex items-center gap-3 hover:bg-[#F8FAFC]"
            >
              <FiEye /> View Details
            </button>

            <button
              onClick={() => {
                setOpen(false);
                onAction("download", id);
              }}
              className="w-full px-4 py-2 flex items-center gap-3 hover:bg-[#F8FAFC]"
            >
              <FiDownload /> Download Invoice
            </button>

            <div className="border-t border-t-[#0000001A] my-2" />

            <button
              onClick={() => {
                setOpen(false);
                onAction("edit", id);
              }}
              className="w-full px-4 py-2 flex items-center gap-3 hover:bg-[#F8FAFC]"
            >
              <FiEdit2 /> Edit Transaction
            </button>

            <button
              onClick={() => {
                setOpen(false);
                onAction("delete", id);
              }}
              className="w-full px-4 py-2 flex items-center gap-3 text-red-600 hover:bg-red-50"
            >
              <FiTrash2 /> Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

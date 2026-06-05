"use client";

import { useEffect, useState } from "react";
import { CiSearch, CiFilter } from "react-icons/ci";
import { RxBorderDotted } from "react-icons/rx";
import { GoArrowUpRight, GoArrowDownLeft } from "react-icons/go";
import { apiRequest } from "@/lib/apiClient";

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

// Derive transaction type and amount from doc name + sheet data
const buildTransactions = (docs, properties) => {
  const txns = [];

  // From Drive documents — receipts and invoices
  docs.forEach((doc, i) => {
    const isReceipt = doc.type === "receipt";
    const isInvoice = doc.type === "invoice";
    if (!isReceipt && !isInvoice) return;

    // Find matching property amount
    const prop = properties.find(p => p.name.toLowerCase() === doc.property?.toLowerCase());

    txns.push({
      id:       `DOC-${String(i + 1).padStart(4, "0")}`,
      desc:     doc.name.replace(/\.pdf$/i, "").replace(/_/g, " "),
      type:     isReceipt ? "Receipt" : "Invoice",
      date:     formatDate(doc.modifiedTime),
      status:   "Completed",
      amount:   isReceipt ? `₦${(prop?.received || 0).toLocaleString()}` : `₦${(prop?.receivable || 0).toLocaleString()}`,
      positive: isReceipt,
      property: doc.property,
      viewLink: doc.viewLink,
    });
  });

  // From Sheet — one entry per property showing amount received
  properties.forEach((prop, i) => {
    if (!prop.received) return;
    txns.push({
      id:       `SHT-${String(i + 1).padStart(4, "0")}`,
      desc:     `${prop.name} — Payment`,
      type:     "Payment",
      date:     prop.date || "—",
      status:   prop.balance === 0 ? "Completed" : "Pending",
      amount:   `₦${prop.received.toLocaleString()}`,
      positive: true,
      property: prop.name,
      viewLink: null,
    });
  });

  return txns.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");

  useEffect(() => {
    Promise.all([
      apiRequest("/investor/drive-documents"),
      apiRequest("/investor/sheet-overview"),
    ]).then(([docsRes, sheetRes]) => {
      const docs  = docsRes.success  ? [...(docsRes.documents || []), ...(docsRes.plotAllocations || [])] : [];
      const props = sheetRes.success ? (sheetRes.data?.properties || []) : [];
      setTransactions(buildTransactions(docs, props));
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  const filtered = transactions.filter(t =>
    !search.trim() ||
    t.desc.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    t.property?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Desktop */}
      <div className="bg-white hidden md:flex md:flex-col rounded-[37px] p-6 border-2 border-[#F1F5F9] lg:w-full w-[90%] md:w-[95%]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[24px] font-semibold">Transaction History</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <CiSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border-2 border-[#E2E8F0] bg-[#F8FAFC] w-[150px] md:w-74 placeholder:font-semibold rounded-lg text-sm focus:outline-none focus:border-[#DDA04E]"
                placeholder="Search transactions..."
              />
            </div>
            <button className="border-2 rounded-lg border-[#E2E8F0] hidden md:flex bg-[#F8FAFC] p-2">
              <CiFilter className="text-[#717182]" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-[#DDA04E] border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <p className="text-[#0F172A] font-semibold text-[16px]">No Transactions Yet</p>
            <p className="text-[#62748E] text-[14px] mt-1">Your transaction history will appear here once payments are recorded.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left bg-[#F8FAFC] border-b border-[#0000001A]">
              <tr>
                {["Transaction ID", "Description", "Date", "Status", "Amount", ""].map(h => (
                  <th key={h} className="py-3 text-[#62748E] text-xs font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-[#F8FAFC] transition">
                  <td className="py-4 text-[#62748E] text-[13px]">{t.id}</td>
                  <td className="py-4">
                    <p className="text-[14px] font-medium text-[#0F172A] truncate max-w-[200px]">{t.desc}</p>
                    <span className="text-xs text-[#90A1B9]">{t.type} • {t.property}</span>
                  </td>
                  <td className="py-4 text-gray-500 text-[13px]">{t.date}</td>
                  <td className="py-4">
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      t.status === "Completed"
                        ? "bg-[#DCFCE7] text-[#008236]"
                        : "bg-[#FEF3C6] text-[#BB4D00]"
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className={`py-4 font-semibold ${t.positive ? "text-[#00A63E]" : "text-[#E7000B]"}`}>
                    {t.positive ? "+" : "-"}{t.amount}
                  </td>
                  <td className="py-4 text-right text-[20px]">
                    {t.viewLink ? (
                      <a href={t.viewLink} target="_blank" rel="noreferrer" className="text-[#DDA04E] hover:text-[#BB8A3A]">
                        <RxBorderDotted />
                      </a>
                    ) : (
                      <RxBorderDotted className="text-gray-300" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile */}
      <div className="space-y-4 flex md:hidden flex-col w-full px-4">
        <div className="inline-block bg-white px-5 w-[80%] py-3 rounded-xl shadow-sm border border-[#F1F5F9]">
          <h3 className="text-[20px] font-semibold">Payment History</h3>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-[#DDA04E] border-t-transparent" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-white rounded-[22px] p-6 border border-[#F1F5F9] text-center">
            <p className="text-[#0F172A] font-semibold">No Transactions Yet</p>
            <p className="text-[#62748E] text-[13px] mt-1">Your payment history will appear here once payments are recorded.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map(item => (
              <div key={item.id} className="bg-white rounded-[22px] p-4 border border-[#F1F5F9] shadow-sm flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[13px] text-[#94A3B8]">{item.date}</p>
                  <p className="text-[16px] font-semibold text-[#0F172A] w-[60%] leading-snug">{item.desc}</p>
                  <p className="text-[13px] text-[#94A3B8]">{item.id}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.positive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}>
                    {item.positive ? <GoArrowUpRight /> : <GoArrowDownLeft />}
                  </div>
                  <p className="text-[16px] font-bold">{item.amount}</p>
                  <div className="flex items-center gap-2 text-[13px]">
                    <span className={`w-2 h-2 rounded-full ${item.status === "Completed" ? "bg-green-500" : "bg-orange-400"}`} />
                    <span className={`font-medium ${item.status === "Completed" ? "text-green-600" : "text-orange-500"}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

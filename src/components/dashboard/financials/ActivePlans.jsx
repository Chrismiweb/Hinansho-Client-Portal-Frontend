"use client";

import { useEffect, useState, useRef } from "react";
import { TbBuildingSkyscraper } from "react-icons/tb";
import { GoArrowUpRight } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { FiClock, FiCalendar, FiCopy, FiCheck } from "react-icons/fi";
import { CiCircleAlert } from "react-icons/ci";
import { apiRequest } from "@/lib/apiClient";
import { getAuthToken } from "@/lib/authStorage";
import { BASE_URL } from "@/lib/apiClient";

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "₦0.00";
  return `₦${Number(amount).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// ── Smart measurement per property ────────────────────────────────────────────
const getMeasurement = (name = "", sqm = 0) => {
  if (!sqm) return null;
  const n = name.toLowerCase();
  if (n.includes("pavilion") || n.includes("pavillion"))
    return { label: "Units Owned", value: `${sqm.toLocaleString()} unit${sqm !== 1 ? "s" : ""}` };
  if (n.includes("verda") || n.includes("farm"))
    return { label: "Hectares Owned", value: `${sqm.toLocaleString()} ha` };
  return { label: "SQM Owned", value: `${sqm.toLocaleString()} sqm` };
};

// ── Bank details per property ─────────────────────────────────────────────────
const getBankDetails = (propertyName = "") => {
  const name = propertyName.toLowerCase();
  if (name.includes("pavilion") || name.includes("pavillion"))
    return { accountName: "Hinansho Ventures Limited", accountNo: "0127087500", bank: "Wema Bank" };
  if (name.includes("hr3") || name === "hr3")
    return { accountName: "Hinansho Ventures Limited", accountNo: "1030061791", bank: "UBA" };
  return { accountName: "HINANSHO VENTURES - Hinansho Holdings", accountNo: "6958937321", bank: "Moniepoint MFB" };
};

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="ml-2 text-[#64748B] hover:text-[#DDA04E] transition">
      {copied ? <FiCheck size={14} className="text-green-500" /> : <FiCopy size={14} />}
    </button>
  );
}

function DetailsModal({ property, onClose }) {
  if (!property) return null;
  const isPaid      = property.balance === 0;
  const measurement = getMeasurement(property.name, property.sqm);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white w-full max-w-md rounded-[24px] overflow-hidden shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-5 flex border-b border-[#F1F5F9] bg-[#F8FAFC] justify-between items-start">
          <div className="flex gap-3 items-center">
            <div className="p-[10px] bg-white border border-[#E2E8F0] rounded-[10px]">
              <TbBuildingSkyscraper className="text-[#DDA04E] text-[25px]" />
            </div>
            <div>
              <p className="font-semibold text-[16px]">{property.name}</p>
              <p className="text-[12px] text-[#62748E]">Investment Details</p>
            </div>
          </div>
          <button onClick={onClose}><IoClose size={20} className="text-gray-400" /></button>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <p className="text-[13px] font-semibold text-[#90A1B9] uppercase tracking-wider mb-3">Financial Overview</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-[#F8FAFC] rounded-[16px] p-4">
                <p className="text-[12px] text-[#90A1B9]">Total Committed</p>
                <p className="font-semibold text-[18px]">{formatCurrency(property.receivable)}</p>
              </div>
              <div className="bg-[#F0FDF4] rounded-[16px] p-4">
                <p className="text-[12px] text-[#00A63E]">Paid to Date</p>
                <p className="font-semibold text-[18px] text-[#008236]">{formatCurrency(property.received)}</p>
              </div>
            </div>
            <div className={`rounded-xl p-4 ${isPaid ? "bg-[#F0FDF4]" : "bg-[#FFFBEB]"}`}>
              <p className={`text-[12px] ${isPaid ? "text-[#00A63E]" : "text-[#E17100]"}`}>Balance Outstanding</p>
              <p className={`font-semibold text-[18px] ${isPaid ? "text-[#008236]" : "text-[#BB4D00]"}`}>
                {isPaid ? "Fully Paid ✓" : formatCurrency(property.balance)}
              </p>
            </div>
          </div>
          <div className="h-[1px] bg-[#0000001A]" />
          <div>
            <p className="text-[13px] font-semibold text-[#90A1B9] uppercase tracking-wider mb-4">Plan Details</p>
            <div className="flex flex-col gap-4 text-sm">
              {property.date && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-[#62748E]"><FiCalendar /><span>Purchase Date</span></div>
                  <span className="font-medium">{property.date}</span>
                </div>
              )}
              {/* ✅ Smart measurement */}
              {measurement && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-[#62748E]"><FiClock /><span>{measurement.label}</span></div>
                  <span className="font-medium">{measurement.value}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-[#62748E]"><CiCircleAlert size={18} /><span>Status</span></div>
                <span className={`text-xs px-3 py-1 rounded-[8px] font-medium border-2 ${
                  isPaid ? "bg-[#F0FDF4] text-[#008236] border-[#B9F8CF]" : "bg-[#FFFBEB] text-[#E17100] border-[#FDE68A]"
                }`}>
                  {isPaid ? "Fully Paid" : "Active"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PayModal({ property, onClose }) {
  const [amount, setAmount]   = useState("");
  const [note, setNote]       = useState("");
  const [receipt, setReceipt] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState(null);
  const fileRef = useRef(null);

  if (!property) return null;
  const bank = getBankDetails(property.name);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReceipt(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!receipt) { setError("Please upload your payment receipt."); return; }
    if (!amount)  { setError("Please enter the amount paid."); return; }
    setError(null);
    setLoading(true);
    try {
      const token = getAuthToken();
      const form  = new FormData();
      form.append("receipt", receipt);
      form.append("propertyName", property.name);
      form.append("amount", amount);
      form.append("note", note);
      const res  = await fetch(`${BASE_URL}/investor/submit-payment`, {
        method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Submission failed");
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white w-full max-w-md rounded-[24px] overflow-hidden shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-5 flex border-b border-[#F1F5F9] bg-[#F8FAFC] justify-between items-start">
          <div className="flex gap-3 items-center">
            <div className="p-[10px] bg-white border border-[#E2E8F0] rounded-[10px]">
              <TbBuildingSkyscraper className="text-[#DDA04E] text-[25px]" />
            </div>
            <div>
              <p className="font-semibold text-[14px]">Hinansho Management</p>
              <p className="text-[12px] text-[#62748E]">{property.name}</p>
            </div>
          </div>
          <button onClick={onClose}><IoClose size={18} className="text-gray-400" /></button>
        </div>

        {success ? (
          <div className="px-6 py-10 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-[18px] font-bold text-[#0F172A] mb-2">Receipt Submitted!</h3>
            <p className="text-[14px] text-[#62748E] mb-6">Admin has been notified and will confirm shortly.</p>
            <button onClick={onClose} className="w-full py-3 bg-[#0F172A] text-white rounded-xl font-semibold">Close</button>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-5">
            <div>
              <p className="text-[13px] font-semibold text-[#90A1B9] uppercase tracking-wider mb-3">Financial Overview</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-[#F8FAFC] rounded-[16px] p-4">
                  <p className="text-[12px] text-[#90A1B9]">Total Committed</p>
                  <p className="font-semibold text-[18px]">{formatCurrency(property.receivable)}</p>
                </div>
                <div className="bg-[#F0FDF4] rounded-[16px] p-4">
                  <p className="text-[12px] text-[#00A63E]">Paid to Date</p>
                  <p className="font-semibold text-[18px] text-[#008236]">{formatCurrency(property.received)}</p>
                </div>
              </div>
              <div className="bg-[#FFFBEB] rounded-xl p-4">
                <p className="text-[12px] text-[#E17100]">Remaining Balance</p>
                <p className="font-semibold text-[18px] text-[#BB4D00]">{formatCurrency(property.balance)}</p>
              </div>
            </div>
            <div className="h-[1px] bg-[#0000001A]" />
            <div>
              <p className="text-[13px] font-semibold text-[#90A1B9] uppercase tracking-wider mb-3">Payment Account Details</p>
              <div className="bg-white border border-[#E2E8F0] rounded-[16px] overflow-hidden">
                <div className="flex items-center gap-3 p-4 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <div className="w-10 h-10 bg-white border border-[#E2E8F0] rounded-[10px] flex items-center justify-center flex-shrink-0">
                    <TbBuildingSkyscraper className="text-[#DDA04E] text-[18px]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[14px] text-[#0F172A]">Hinansho Management</p>
                    <p className="text-[12px] text-[#62748E]">Official Business Account</p>
                  </div>
                </div>
                <div className="divide-y divide-[#F1F5F9]">
                  {[
                    { label: "Bank", value: <p className="font-semibold text-[14px] text-[#0F172A]">{bank.bank}</p> },
                    { label: "Account Name", value: <p className="font-semibold text-[13px] text-[#0F172A] text-right max-w-[55%]">{bank.accountName}</p> },
                    { label: "Account No.", value: <div className="flex items-center"><p className="font-bold text-[15px] text-[#0F172A] tracking-wider">{bank.accountNo}</p><CopyButton text={bank.accountNo} /></div> },
                    { label: "Total Amount Due", value: <p className="font-bold text-[15px] text-[#BB4D00]">{formatCurrency(property.balance)}</p> },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center px-4 py-3">
                      <p className="text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider">{row.label}</p>
                      {row.value}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="h-[1px] bg-[#0000001A]" />
            <div>
              <p className="text-[13px] font-semibold text-[#90A1B9] uppercase tracking-wider mb-4">Submit Payment Receipt</p>
              <div className="mb-4">
                <label className="text-[13px] font-medium text-[#0F172A] mb-1.5 block">Amount Paid (₦)</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 500000"
                  className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#DDA04E] bg-[#F8FAFC]" />
              </div>
              <div className="mb-4">
                <label className="text-[13px] font-medium text-[#0F172A] mb-1.5 block">Note (optional)</label>
                <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Installment 3"
                  className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#DDA04E] bg-[#F8FAFC]" />
              </div>
              <div className="mb-4">
                <label className="text-[13px] font-medium text-[#0F172A] mb-1.5 block">Upload Receipt</label>
                <input ref={fileRef} type="file" accept="image/*,application/pdf" onChange={handleFile} className="hidden" id="receiptUpload" />
                {!preview ? (
                  <label htmlFor="receiptUpload" className="flex flex-col items-center justify-center w-full py-6 border-2 border-dashed border-[#E2E8F0] rounded-xl cursor-pointer hover:border-[#DDA04E] bg-[#F8FAFC] transition">
                    <p className="text-[13px] text-[#62748E]">Click to upload receipt</p>
                    <p className="text-[11px] text-[#94A3B8] mt-1">JPG, PNG or PDF</p>
                  </label>
                ) : (
                  <div className="relative">
                    <img src={preview} alt="Receipt" className="w-full rounded-xl border border-[#E2E8F0] max-h-40 object-cover" />
                    <button onClick={() => { setReceipt(null); setPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                      className="absolute top-2 right-2 w-6 h-6 bg-gray-900/70 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition">×</button>
                  </div>
                )}
              </div>
              {error && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">❌ {error}</p>}
              <button onClick={handleSubmit} disabled={loading}
                className="w-full py-3 bg-[#E17100] text-white rounded-xl font-semibold text-[15px] hover:bg-[#BB4D00] transition disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</> : <>Submit Payment Receipt <GoArrowUpRight /></>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PlanCard({ property, onPay, onDetails }) {
  const receivable  = property.receivable || 0;
  const received    = property.received   || 0;
  const balance     = property.balance    || 0;
  const progress    = receivable > 0 ? Math.round((received / receivable) * 100) : 100;
  const isPaid      = balance === 0;
  const measurement = getMeasurement(property.name, property.sqm);

  return (
    <div className="bg-white rounded-[37px] pt-[37px] pb-[40px] px-[20px] lg:px-[40px] border-2 border-[#F1F5F9]">
      <div className="flex w-full justify-between mb-6">
        <div className="flex items-center gap-[18px]">
          <div className="p-[13px] bg-[#F8FAFC] border-2 border-[#F1F5F9] rounded-[18px]">
            <TbBuildingSkyscraper className="text-[25px]" />
          </div>
          <div>
            <h4 className="font-semibold text-[20px]">{property.name}</h4>
            <p className="text-[14px] text-[#62748E]">{property.date ? `Purchased: ${property.date}` : "Investment Property"}</p>
          </div>
        </div>
        <div className={`text-xs rounded-[10px] px-[10px] flex items-center justify-center font-semibold border ${
          isPaid ? "bg-[#F0FDF4] text-[#008236] border-[#B9F8CF]" : "bg-[#FFFBEB] text-[#E17100] border-[#FDE68A]"
        }`}>
          {isPaid ? "Paid ✓" : "Active"}
        </div>
      </div>
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-[16px] text-[#62748E]">Progress</span>
          <span className="text-[16px] font-bold">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className={`h-2 rounded-full transition-all duration-700 ${isPaid ? "bg-[#00C950]" : "bg-[#0F172A]"}`} style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="flex justify-between mb-4">
        <span className="text-[#90A1B9] text-[14px]">Paid: {formatCurrency(received)}</span>
        <span className="text-[#90A1B9] text-[14px]">Total: {formatCurrency(receivable)}</span>
      </div>
      <div className="grid grid-cols-2 gap-4 bg-[#F8FAFC] p-4 rounded-xl mb-6">
        <div>
          <p className="text-[14px] text-[#90A1B9]">REMAINING</p>
          <p className={`font-bold text-[20px] ${balance > 0 ? "text-red-500" : "text-[#00A63E]"}`}>
            {balance > 0 ? formatCurrency(balance) : "Fully Paid"}
          </p>
        </div>
        {/* ✅ Smart measurement label */}
        <div>
          <p className="text-[14px] text-[#90A1B9]">{measurement?.label || "OWNED"}</p>
          <p className="font-bold text-[20px] text-[#DDA04E]">{measurement?.value || "—"}</p>
        </div>
      </div>
      <div className="flex gap-3 justify-between">
        <button onClick={() => !isPaid && onPay(property)} disabled={isPaid}
          className={`flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl text-[15px] font-medium transition ${
            isPaid ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-[#0F172A] text-white hover:bg-[#1E293B]"
          }`}>
          {isPaid ? "Fully Paid ✓" : <><span>Pay Installment</span><GoArrowUpRight /></>}
        </button>
        <button onClick={() => onDetails(property)} className="border border-[#E2E8F0] px-5 rounded-xl text-[15px] font-medium hover:bg-gray-50 transition">
          Details
        </button>
      </div>
    </div>
  );
}

export default function ActivePlans() {
  const [properties, setProperties]         = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [payProperty, setPayProperty]       = useState(null);
  const [detailProperty, setDetailProperty] = useState(null);

  useEffect(() => {
    apiRequest("/investor/sheet-overview")
      .then(res => {
        if (res.success) setProperties(res.data.properties || []);
        else throw new Error(res.message);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-[90%] md:w-[95%] lg:w-full">
      <h3 className="text-[23px] font-bold mb-[30px]">
        Investment Plans
        {!loading && properties.length > 0 && (
          <span className="ml-3 text-[14px] font-normal text-[#62748E]">
            {properties.length} {properties.length === 1 ? "property" : "properties"}
          </span>
        )}
      </h3>
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="bg-white rounded-[37px] p-10 border-2 border-[#F1F5F9] animate-pulse">
              <div className="flex gap-4 mb-6"><div className="w-12 h-12 bg-gray-100 rounded-2xl" /><div className="space-y-2 flex-1"><div className="h-5 bg-gray-100 rounded w-40" /><div className="h-4 bg-gray-50 rounded w-28" /></div></div>
              <div className="h-2 bg-gray-100 rounded-full mb-6" />
              <div className="grid grid-cols-2 gap-4 mb-6"><div className="h-16 bg-gray-50 rounded-xl" /><div className="h-16 bg-gray-50 rounded-xl" /></div>
              <div className="h-10 bg-gray-100 rounded-xl" />
            </div>
          ))}
        </div>
      )}
      {!loading && error && <p className="text-sm text-red-400 text-center py-8">Failed to load: {error}</p>}
      {!loading && !error && properties.length === 0 && (
        <div className="text-center py-12 bg-white rounded-[37px] border-2 border-[#F1F5F9]">
          <p className="text-gray-400 text-sm">No investment plans found.</p>
        </div>
      )}
      {!loading && !error && properties.length > 0 && (
        <div className={`grid grid-cols-1 gap-6 ${properties.length > 1 ? "lg:grid-cols-2" : ""}`}>
          {properties.map((property, idx) => (
            <PlanCard key={idx} property={property} onPay={p => setPayProperty(p)} onDetails={p => setDetailProperty(p)} />
          ))}
        </div>
      )}
      {payProperty    && <PayModal     property={payProperty}    onClose={() => setPayProperty(null)}    />}
      {detailProperty && <DetailsModal property={detailProperty} onClose={() => setDetailProperty(null)} />}
    </div>
  );
}

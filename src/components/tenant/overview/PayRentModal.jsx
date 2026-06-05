"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { TbBuildingSkyscraper } from "react-icons/tb";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaWifi } from "react-icons/fa";
import { useState, useRef } from "react";
import { PiFireSimple } from "react-icons/pi";
import { LiaDumbbellSolid } from "react-icons/lia";
import { apiUpload } from "@/lib/apiClient";

const UTILITIES = [
  { id: 1, name: "Wi-Fi Package", icon: FaWifi, price: "$30/mo", iconBg: "bg-[#F1F5F9]" },
  { id: 2, name: "Cooking Gas", icon: PiFireSimple, price: "$15/mo", iconBg: "bg-[#F1F5F9]" },
  { id: 3, name: "Gym Membership", icon: LiaDumbbellSolid, price: "$20/mo", iconBg: "bg-[#F1F5F9]" },
];

export default function PayRentModal({ open, onClose, onSuccess }) {
  if (!open) return null;

  const [selectedUtilities, setSelectedUtilities] = useState({});
  const [receipt, setReceipt] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [amountClaimed, setAmountClaimed] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileRef = useRef(null);

  const handleCheckboxChange = (id) => {
    setSelectedUtilities((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB.");
      return;
    }
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowed.includes(file.type)) {
      setError("Only JPG, PNG, or PDF files are allowed.");
      return;
    }

    setError("");
    setReceipt(file);
    if (file.type.startsWith("image/")) {
      setReceiptPreview(URL.createObjectURL(file));
    } else {
      setReceiptPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!receipt) {
      setError("Please upload your payment receipt.");
      return;
    }
    if (!amountClaimed || isNaN(Number(amountClaimed)) || Number(amountClaimed) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const form = new FormData();
      form.append("receipt", receipt);
      form.append("amountClaimed", amountClaimed);

      await apiUpload("/tenant/rent/upload", form);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 1800);
    } catch (err) {
      setError(err.message || "Failed to submit payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-[520px] rounded-[28px] bg-[#111827] text-white shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-6">
            <div>
              <h2 className="text-[20px] font-semibold">Pay Rent</h2>
              <p className="text-sm text-[#90A1B9]">
                Transfer funds to our account and upload the receipt.
              </p>
            </div>
            <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="mt-6 bg-white text-[#0F172A] rounded-b-[28px] px-6 py-6">
            {/* Bank details */}
            <div className="rounded-[18px] bg-[#F8FAFC] p-5 border border-[#E5EAF1]">
              <div className="flex gap-3 items-center mb-3">
                <div className="p-[10px] bg-white border-[#E2E8F0] rounded-[10px] border">
                  <TbBuildingSkyscraper className="text-[#DDA04E] text-[25px]" />
                </div>
                <div>
                  <p className="font-semibold text-[14px]">Hinansho Management</p>
                  <p className="text-[12px] text-[#62748E]">Official Business Account</p>
                </div>
              </div>

              <div className="flex flex-col gap-[12px] mt-[16px]">
                <div className="flex justify-between">
                  <p className="text-[#62748E] text-[12px]">Bank</p>
                  <p className="font-semibold text-[14px]">First Bank Of Nigeria</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#62748E] text-[12px]">Account No.</p>
                  <p className="font-semibold text-[14px]">319-399-0012</p>
                </div>
              </div>
            </div>

            {/* Amount claimed */}
            <div className="mt-4">
              <label className="text-[#314158] text-[14px] font-bold block mb-2">
                Amount Paid (₦)
              </label>
              <input
                type="number"
                min="1"
                value={amountClaimed}
                onChange={(e) => setAmountClaimed(e.target.value)}
                placeholder="e.g. 850000"
                className="w-full border border-[#E2E8F0] rounded-[12px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DDA04E]"
              />
            </div>

            {/* Upload Receipt */}
            <div className="flex flex-col gap-[8px] mt-[12px]">
              <p className="text-[#314158] text-[14px] font-bold">Upload Receipt</p>
              <label
                className="border-2 border-dashed border-[#E2E8F0] gap-[8px] rounded-[14px] p-6 flex flex-col items-center cursor-pointer hover:border-[#DDA04E] transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  hidden
                  onChange={handleFileChange}
                />
                {receiptPreview ? (
                  <img src={receiptPreview} alt="Receipt preview" className="w-full max-h-32 object-contain rounded-lg" />
                ) : (
                  <>
                    <div className="text-[#90A1B9] bg-[#F8FAFC] p-[10px] text-[30px] rounded-full flex justify-center items-center">
                      <MdOutlineFileUpload />
                    </div>
                    <p className="font-medium text-[14px]">
                      {receipt ? receipt.name : "Click to upload receipt"}
                    </p>
                    <p className="text-[12px] text-[#62748E]">JPG, PNG or PDF (Max 5MB)</p>
                  </>
                )}
              </label>
            </div>

            {/* Utilities */}
            <div>
              <h3 className="text-[14px] mt-[21px] font-semibold text-[#1F2937] mb-4">
                Add-on Utilities (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {UTILITIES.map((utility) => {
                  const Icon = utility.icon;
                  return (
                    <div
                      key={utility.id}
                      onClick={() => handleCheckboxChange(utility.id)}
                      className={`flex items-center gap-3 border-[2px] p-4 rounded-[14px] cursor-pointer transition-colors ${
                        selectedUtilities[utility.id]
                          ? "border-[#DDA04E] bg-amber-50"
                          : "border-[#E2E8F0]"
                      }`}
                    >
                      <div className={`p-3 ${utility.iconBg} rounded-full`}>
                        <Icon className="h-5 w-5 text-[#62748E]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{utility.name}</p>
                        <p className="text-xs text-gray-500">{utility.price}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={!!selectedUtilities[utility.id]}
                        onChange={() => handleCheckboxChange(utility.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="ml-auto accent-[#DDA04E]"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Error / Success */}
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            {success && (
              <p className="mt-4 text-sm text-green-600 font-medium">
                ✅ Payment submitted! Awaiting admin approval.
              </p>
            )}

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 rounded-[14px] border border-[#E2E8F0] py-3 text-sm font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || success}
                className="flex-1 rounded-[14px] bg-[#EAC07A] py-3 text-sm font-semibold text-[#111827] disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Payment"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

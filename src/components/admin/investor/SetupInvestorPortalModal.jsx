"use client";

import { useMemo, useState, useEffect } from "react";
import { IoClose, IoCheckmarkCircle } from "react-icons/io5";
import { MdOutlineFileUpload } from "react-icons/md";
import { BsBuildings } from "react-icons/bs";
import { getAuthToken } from "@/lib/authStorage";
import { createInvestor } from "@/lib/createInvestor";

function Spinner({ size = 18, color = "white" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="animate-spin" style={{ color }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ✅ Added onCreated prop — called when investor is fully set up (step 3)
export default function SetupInvestorPortalModal({ open, onClose, onCreated }) {
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState("");
  const [createdInvestor, setCreatedInvestor] = useState(null);
  const [step, setStep] = useState(1);
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [files, setFiles] = useState([]);
  const [documentType, setDocumentType] = useState("deed");
  const [amountPaid, setAmountPaid] = useState("");
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (!open) return;
    const fetchProperties = async () => {
      try {
        const token = getAuthToken();
        const res = await fetch(
          "https://hinansho-client-portal-backend.onrender.com/admin/fetch-properties",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (data.success) setProperties(data.properties);
      } catch (err) {
        console.error("Failed to fetch properties", err);
      }
    };
    fetchProperties();
  }, [open]);

  function toUsernameFromEmail(em) {
    const base = (em || "").split("@")[0] || "investor";
    return base.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 20);
  }

  const handleCreateInvestor = async () => {
    try {
      setError("");
      setLoading(true);
      setLoadingMsg("Creating investor account...");

      const token = getAuthToken();
      if (!token) throw new Error("Token is missing.");

      const result = await createInvestor({
        username: toUsernameFromEmail(email),
        email: email.trim(),
        fullName: fullName.trim(),
        phone: phone.trim(),
      });

      if (!result?.investor) throw new Error("Investor creation failed");

      setCreatedInvestor(result.investor);
      setStep(2);
    } catch (err) {
      setError(err?.message || "Failed to create investor");
    } finally {
      setLoading(false);
      setLoadingMsg("");
    }
  };

  const handleUploadDocs = async () => {
    try {
      setError("");
      setLoading(true);
      setLoadingMsg("Uploading documents...");

      const token = getAuthToken();
      if (!token) throw new Error("Token is missing");

      const investorId =
        createdInvestor?.id ||
        createdInvestor?._id ||
        createdInvestor?.investor?.id ||
        createdInvestor?.investor?._id;

      if (!investorId) throw new Error("Investor ID is missing");

      const currentPropertyId = properties[currentPropertyIndex]?._id;
      if (!currentPropertyId) throw new Error("Property ID is missing");

      const formData = new FormData();
      files.forEach((file) => formData.append("documents", file));
      formData.append("documentType", documentType);
      formData.append("propertyId", currentPropertyId);

      const uploadRes = await fetch(
        `https://hinansho-client-portal-backend.onrender.com/admin/investors/${investorId}/documents`,
        { method: "POST", headers: { token }, body: formData }
      );

      if (!uploadRes.ok) {
        const data = await uploadRes.json().catch(() => ({}));
        throw new Error(data?.message || `Upload failed (${uploadRes.status})`);
      }

      setLoadingMsg("Assigning property...");
      await assignProperty(investorId, currentPropertyId);

      if (currentPropertyIndex < properties.length - 1) {
        setCurrentPropertyIndex((i) => i + 1);
        setFiles([]);
        setDocumentType("deed");
        setAmountPaid("");
      } else {
        setStep(3);
        onCreated?.(); // ✅ notify parent to refetch investor list
      }
    } catch (err) {
      setError(err?.message || "Failed to upload documents");
    } finally {
      setLoading(false);
      setLoadingMsg("");
    }
  };

  const assignProperty = async (investorId, propId) => {
    const token = getAuthToken();
    const res = await fetch(
      "https://hinansho-client-portal-backend.onrender.com/admin/assign-property",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({
          propertyId: propId,
          investorId,
          amountPaid: Number(amountPaid) || 350000,
        }),
      }
    );
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.message || "Failed to assign property");
    }
  };

  const handleSkip = () => {
    setFiles([]);
    setDocumentType("deed");
    setAmountPaid("");
    if (currentPropertyIndex < properties.length - 1) {
      setCurrentPropertyIndex((i) => i + 1);
    } else {
      setStep(3);
      onCreated?.(); // ✅ also notify on skip-to-done
    }
  };

  const steps = useMemo(() => [
    { id: 1, label: "Details" },
    { id: 2, label: "Properties" },
    { id: 3, label: "Done" },
  ], []);

  const isStepComplete = (s) => s < step;
  const canGoNext = step === 1 ? !!(fullName.trim() && email.trim()) : true;

  const closeAndReset = () => {
    onClose?.();
    setTimeout(() => {
      setStep(1);
      setFullName("");
      setEmail("");
      setPhone("");
      setFiles([]);
      setDocumentType("deed");
      setAmountPaid("");
      setCreatedInvestor(null);
      setCurrentPropertyIndex(0);
      setError("");
    }, 300);
  };

  if (!open) return null;

  return (
    
  <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      {/* <div className="absolute inset-0" onClick={closeAndReset} /> */}

    {/* // <div className="fixed inset-0 z-[999]">
    //   <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4"> */}
{/* <div className="relative lg:w-[70%] max-w-[680px] h-[85vh] sm:h-[90vh] flex flex-col rounded-[16px] overflow-hidden shadow-2xl bg-white"> */}
          {/* Header */}
          <div className="sticky top-0 bg-[#0F172A] z-5000 px-5 sm:px-8 py-5">
        {/* <div className="sticky top-0 bg-white z-5000 border-b border-gray-200 p-6 flex justify-between items-center"> */}

            <button onClick={closeAndReset} className="absolute right-4 top-4 sm:right-6 sm:top-6 text-white/70 hover:text-white transition" aria-label="Close">
              <IoClose className="text-[22px]" />
            </button>
            <h2 className="text-white text-[18px] sm:text-[22px] font-semibold pr-8">Setup Investor Portal</h2>
            <p className="text-white/60 text-[12px] sm:text-[14px] mt-1 pr-8">
              Create a new investor account, assign properties, and upload legal documents.
            </p>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-8 pt-6 pb-4">

            {/* Stepper */}
            <div className="grid grid-cols-3 gap-2 sm:gap-6 mb-7">
              {steps.map((s) => {
                const active = s.id === step;
                const complete = isStepComplete(s.id);
                return (
                  <div key={s.id} className="flex flex-col items-center">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[13px] sm:text-[14px] font-semibold transition-all ${complete || active ? "bg-[#DDA04E] text-white" : "bg-[#EEF2F7] text-[#94A3B8]"}`}>
                      {complete ? <IoCheckmarkCircle className="text-[18px]" /> : s.id}
                    </div>
                    <p className={`mt-1.5 text-[11px] sm:text-[13px] text-center ${active || complete ? "text-[#0F172A] font-medium" : "text-[#94A3B8]"}`}>
                      {s.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-4">
                {error && <div className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[12px] p-3">{error}</div>}
                <div>
                  <label className="block text-[13px] sm:text-[14px] text-[#0F172A] font-medium mb-1.5">Full Name <span className="text-red-500">*</span></label>
                  <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Robert Fox" className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#DDA04E]/30" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] sm:text-[14px] text-[#0F172A] font-medium mb-1.5">Email Address <span className="text-red-500">*</span></label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="robert@example.com" className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#DDA04E]/30" />
                  </div>
                  <div>
                    <label className="block text-[13px] sm:text-[14px] text-[#0F172A] font-medium mb-1.5">Phone Number</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#DDA04E]/30" />
                  </div>
                </div>
                <div className="bg-[#EAF2FF] border border-[#D7E6FF] rounded-[12px] p-3 sm:p-4">
                  <p className="text-[#1D4ED8] font-semibold text-[12px] sm:text-[13px]">Note:</p>
                  <p className="text-[#1D4ED8] text-[12px] sm:text-[13px] mt-1">Login credentials will be automatically generated and sent to the provided email address.</p>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-4">
                {error && <div className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[12px] p-3">{error}</div>}

                <div className="flex items-center justify-between">
                  <p className="text-[12px] sm:text-[13px] text-[#64748B]">
                    Property <span className="font-semibold text-[#0F172A]">{currentPropertyIndex + 1}</span> of <span className="font-semibold text-[#0F172A]">{properties.length}</span>
                  </p>
                  <div className="flex gap-1">
                    {properties.map((_, i) => (
                      <div key={i} className={`h-1.5 rounded-full transition-all ${i < currentPropertyIndex ? "w-6 bg-[#DDA04E]" : i === currentPropertyIndex ? "w-6 bg-[#DDA04E]/50" : "w-4 bg-[#E2E8F0]"}`} />
                    ))}
                  </div>
                </div>

                <div className="border border-[#E2E8F0] rounded-[12px] p-3 sm:p-4 bg-[#F8FAFC]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[10px] bg-[#DDA04E]/10 flex items-center justify-center flex-shrink-0">
                      <BsBuildings className="text-[#DDA04E] text-[18px]" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#0F172A]">{properties[currentPropertyIndex]?.name || "Unnamed Property"}</p>
                      <p className="text-[12px] text-[#64748B]">{properties[currentPropertyIndex]?.location || "—"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">Amount Paid (₦)</label>
                  <input type="number" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} placeholder="e.g. 350000" className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#DDA04E]/30" />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">Document Type</label>
                  <select value={documentType} onChange={(e) => setDocumentType(e.target.value)} className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#DDA04E]/30">
                    <option value="deed">Deed</option>
                    <option value="contract">Contract</option>
                    <option value="invoice">Invoice</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">Upload Documents</label>
                  <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-[#E2E8F0] rounded-[12px] py-5 sm:py-6 px-4 cursor-pointer hover:border-[#DDA04E]/50 hover:bg-[#FFFBF5] transition bg-white">
                    <MdOutlineFileUpload className="text-[26px] sm:text-[28px] text-[#DDA04E] mb-1.5" />
                    <p className="text-[12px] sm:text-[13px] text-[#64748B] text-center">
                      {files.length > 0 ? `${files.length} file${files.length > 1 ? "s" : ""} selected` : "Click to browse or drag files here"}
                    </p>
                    <input type="file" multiple className="hidden" onChange={(e) => setFiles(Array.from(e.target.files))} />
                  </label>
                  {files.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {files.map((f, i) => (
                        <li key={i} className="flex items-center justify-between text-[12px] text-[#475569] bg-[#F1F5F9] rounded-[8px] px-3 py-2">
                          <span className="truncate max-w-[75%]">{f.name}</span>
                          <button onClick={() => setFiles(files.filter((_, fi) => fi !== i))} className="text-[#94A3B8] hover:text-red-500 transition ml-2 flex-shrink-0">
                            <IoClose />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {loading && (
                  <div className="flex items-center gap-2 text-[13px] text-[#DDA04E] font-medium bg-[#FFFBF5] border border-[#DDA04E]/30 rounded-[10px] px-4 py-3">
                    <Spinner size={16} color="#DDA04E" />
                    {loadingMsg || "Processing..."}
                  </div>
                )}
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <IoCheckmarkCircle className="text-green-500 text-[32px] sm:text-[36px]" />
                </div>
                <h3 className="text-[17px] sm:text-[18px] font-bold text-[#0F172A] mb-2">All Done!</h3>
                <p className="text-[13px] sm:text-[14px] text-[#64748B] max-w-[320px]">
                  All properties have been assigned and documents uploaded. Login credentials have been sent to the investor's email.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-[#F8FAFC] border-t border-[#E2E8F0] px-5 sm:px-8 py-4 flex items-center justify-between gap-3 flex-shrink-0">
            <div>
              {step > 1 && step < 3 && (
                <button onClick={() => { setStep((s) => Math.max(1, s - 1)); setError(""); }} disabled={loading} className="px-4 sm:px-6 py-2 rounded-[10px] bg-white border border-[#E2E8F0] text-[#0F172A] text-[13px] sm:text-[14px] shadow-sm hover:bg-[#F8FAFC] transition disabled:opacity-40">
                  Back
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {step === 2 && (
                <button onClick={handleSkip} disabled={loading} className="px-4 sm:px-6 py-2 rounded-[10px] bg-white border border-[#E2E8F0] text-[#0F172A] text-[13px] sm:text-[14px] shadow-sm hover:bg-[#F8FAFC] transition disabled:opacity-40">
                  Skip
                </button>
              )}

              {step < 3 ? (
                <button
                  onClick={step === 2 ? handleUploadDocs : handleCreateInvestor}
                  disabled={loading || !canGoNext || (step === 2 && files.length === 0)}
                  className="inline-flex cursor-pointer items-center gap-2 px-4 sm:px-6 py-2 rounded-[10px] bg-[#DDA04E] text-white text-[13px] sm:text-[14px] shadow-sm hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading && <Spinner size={15} color="white" />}
                  {step === 1 ? (loading ? "Creating..." : "Next Step") : (loading ? (loadingMsg || "Processing...") : "Assign & Upload")}
                </button>
              ) : (
                <button onClick={closeAndReset} className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 rounded-[10px] bg-[#DDA04E] text-white text-[13px] sm:text-[14px] shadow-sm hover:opacity-90 transition">
                  <IoCheckmarkCircle className="text-[17px]" />
                  Finish
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    // </div>
  );
}

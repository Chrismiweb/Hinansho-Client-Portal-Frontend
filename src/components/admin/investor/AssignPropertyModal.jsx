"use client";

import { useState, useEffect } from "react";
import { IoClose, IoCheckmarkCircle } from "react-icons/io5";
import { MdOutlineFileUpload } from "react-icons/md";
import { BsBuildings } from "react-icons/bs";
import { apiRequest, apiUpload } from "@/lib/apiClient";

function Spinner({ size = 18, color = "white" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="animate-spin" style={{ color }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function AssignPropertyModal({ open, onClose, investorId, onAssigned }) {
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const [properties, setProperties] = useState([]);
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);
  const [files, setFiles] = useState([]);
  const [documentType, setDocumentType] = useState("deed");
  const [amountPaid, setAmountPaid] = useState("");

  useEffect(() => {
    if (!open) return;
    setDone(false);
    setCurrentPropertyIndex(0);
    setFiles([]);
    setDocumentType("deed");
    setAmountPaid("");
    setError("");

    const fetchProperties = async () => {
      try {
        const data = await apiRequest("/admin/fetch-properties");
        if (data.success) setProperties(data.properties);
      } catch (err) {
        console.error("Failed to fetch properties", err);
      }
    };
    fetchProperties();
  }, [open]);

  const handleUploadDocs = async () => {
    try {
      setError("");
      setLoading(true);
      setLoadingMsg("Uploading documents...");

      const token = getAuthToken();
      if (!token) throw new Error("Token is missing");
      if (!investorId) throw new Error("Investor ID is missing");

      const currentPropertyId = properties[currentPropertyIndex]?._id;
      if (!currentPropertyId) throw new Error("Property ID is missing");

      // Upload documents
      const formData = new FormData();
      files.forEach((file) => formData.append("documents", file));
      formData.append("documentType", documentType);
      formData.append("propertyId", currentPropertyId);

      const uploadRes = await fetch(
        // `https://hinansho-client-portal-backend.onrender.com/admin/investors/${investorId}/documents`,
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/investors/${investorId}/documents`,
        { method: "POST", headers: { token }, body: formData }
      );

      if (!uploadRes.ok) {
        const data = await uploadRes.json().catch(() => ({}));
        throw new Error(data?.message || `Upload failed (${uploadRes.status})`);
      }

      // Assign property
      setLoadingMsg("Assigning property...");
      const assignRes = await fetch(
        "https://hinansho-client-portal-backend.onrender.com/admin/assign-property",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", token },
          body: JSON.stringify({
            propertyId: currentPropertyId,
            investorId,
            amountPaid: Number(amountPaid) || 350000,
          }),
        }
      );

      if (!assignRes.ok) {
        const data = await assignRes.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to assign property");
      }

      // Move to next or finish
      if (currentPropertyIndex < properties.length - 1) {
        setCurrentPropertyIndex((i) => i + 1);
        setFiles([]);
        setDocumentType("deed");
        setAmountPaid("");
      } else {
        setDone(true);
        onAssigned?.();
      }
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
      setLoadingMsg("");
    }
  };

  const handleSkip = () => {
    setFiles([]);
    setDocumentType("deed");
    setAmountPaid("");
    setError("");
    if (currentPropertyIndex < properties.length - 1) {
      setCurrentPropertyIndex((i) => i + 1);
    } else {
      setDone(true);
      onAssigned?.();
    }
  };

  const closeAndReset = () => {
    onClose?.();
    setTimeout(() => {
      setDone(false);
      setCurrentPropertyIndex(0);
      setFiles([]);
      setDocumentType("deed");
      setAmountPaid("");
      setError("");
    }, 300);
  };

  const handleBack = () => {
    setFiles([]);
    setDocumentType("deed");
    setAmountPaid("");
    setError("");
    setCurrentPropertyIndex((i) => Math.max(0, i - 1));
  };

  if (!open) return null;

  return (

        <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

          {/* Header */}
          <div className="relative bg-[#0F172A] px-5 sm:px-8 py-5 flex-shrink-0">
            <button onClick={closeAndReset} className="absolute right-4 top-4 sm:right-6 sm:top-6 text-white/70 hover:text-white transition">
              <IoClose className="text-[22px]" />
            </button>
            <h2 className="text-white text-[17px] sm:text-[20px] font-semibold pr-8">Assign Property</h2>
            <p className="text-white/60 text-[12px] sm:text-[13px] mt-1 pr-8">
              Assign a property and upload legal documents for this investor.
            </p>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-8 pt-6 pb-4">
            {done ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <IoCheckmarkCircle className="text-green-500 text-[34px]" />
                </div>
                <h3 className="text-[17px] font-bold text-[#0F172A] mb-2">All Done!</h3>
                <p className="text-[13px] text-[#64748B] max-w-[280px]">
                  Properties have been assigned and documents uploaded successfully.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {error && (
                  <div className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[12px] p-3">{error}</div>
                )}

                {/* Progress */}
                <div className="flex items-center justify-between">
                  <p className="text-[12px] sm:text-[13px] text-[#64748B]">
                    Property <span className="font-semibold text-[#0F172A]">{currentPropertyIndex + 1}</span> of{" "}
                    <span className="font-semibold text-[#0F172A]">{properties.length}</span>
                  </p>
                  <div className="flex gap-1">
                    {properties.map((_, i) => (
                      <div key={i} className={`h-1.5 rounded-full transition-all ${
                        i < currentPropertyIndex ? "w-6 bg-[#DDA04E]"
                        : i === currentPropertyIndex ? "w-6 bg-[#DDA04E]/50"
                        : "w-4 bg-[#E2E8F0]"
                      }`} />
                    ))}
                  </div>
                </div>

                {/* Property card */}
                <div className="border border-[#E2E8F0] rounded-[12px] p-3 sm:p-4 bg-[#F8FAFC]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[10px] bg-[#DDA04E]/10 flex items-center justify-center flex-shrink-0">
                      <BsBuildings className="text-[#DDA04E] text-[18px]" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#0F172A]">
                        {properties[currentPropertyIndex]?.name || "Unnamed Property"}
                      </p>
                      <p className="text-[12px] text-[#64748B]">
                        {properties[currentPropertyIndex]?.location || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Amount Paid */}
                <div>
                  <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">Amount Paid (₦)</label>
                  <input
                    type="number"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    placeholder="e.g. 350000"
                    className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#DDA04E]/30"
                  />
                </div>

                {/* Document Type */}
                <div>
                  <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">Document Type</label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#DDA04E]/30"
                  >
                    <option value="deed">Deed</option>
                    <option value="contract">Contract</option>
                    <option value="invoice">Invoice</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* File Upload */}
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
                          {/* <button onClick={() => setFiles(files.filter((_, fi) => fi !== i))} className="text-[#94A3B8] hover:text-red-500 transition ml-2 flex-shrink-0">
                            <IoClose />
                          </button> */}
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
          </div>

          {/* Footer */}
        <div className="flex-shrink-0 bg-[#F8FAFC] border-t border-[#E2E8F0] px-5 sm:px-8 py-3 flex items-center justify-between gap-2 sm:gap-3">

          {/* Left — Back (only show when not on first property and not done) */}
          <div>
            {!done && currentPropertyIndex > 0 && (
              <button
                onClick={handleBack}
                disabled={loading}
                className="px-4 sm:px-5 py-2 rounded-[10px] bg-white border border-[#E2E8F0] text-[#0F172A] text-[12px] sm:text-[13px] shadow-sm hover:bg-[#F8FAFC] transition disabled:opacity-40"
              >
                Back
              </button>
            )}
          </div>

          {/* Right — Skip + primary action */}
          <div className="flex items-center gap-2">
            {!done ? (
              <>
                <button
                  onClick={handleSkip}
                  disabled={loading}
                  className="px-4 sm:px-5 py-2 rounded-[10px] bg-white border border-[#E2E8F0] text-[#0F172A] text-[12px] sm:text-[13px] shadow-sm hover:bg-[#F8FAFC] transition disabled:opacity-40"
                >
                  Skip
                </button>
                <button
                  onClick={handleUploadDocs}
                  disabled={loading || files.length === 0}
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 rounded-[10px] bg-[#DDA04E] text-white text-[12px] sm:text-[13px] shadow-sm hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading && <Spinner size={13} color="white" />}
                  {loading ? loadingMsg || "Processing..." : "Assign & Upload"}
                </button>
              </>
            ) : (
              <button
                onClick={closeAndReset}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 rounded-[10px] bg-[#DDA04E] text-white text-[12px] sm:text-[13px] shadow-sm hover:opacity-90 transition"
              >
                <IoCheckmarkCircle className="text-[15px]" />
                Done
              </button>
            )}
          </div>
        </div>
        </div>
        </div>

  
  );
}













// "use client";

// import { useState, useEffect } from "react";
// import { IoClose, IoCheckmarkCircle } from "react-icons/io5";
// import { MdOutlineFileUpload } from "react-icons/md";
// import { BsBuildings } from "react-icons/bs";
// import { apiRequest, apiUpload } from "@/lib/apiClient";

// function Spinner({ size = 18, color = "white" }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="animate-spin" style={{ color }}>
//       <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
//       <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
//     </svg>
//   );
// }

// export default function AssignPropertyModal({ open, onClose, investorId, onAssigned }) {
//   const [loading, setLoading] = useState(false);
//   const [loadingMsg, setLoadingMsg] = useState("");
//   const [error, setError] = useState("");
//   const [done, setDone] = useState(false);

//   const [properties, setProperties] = useState([]);
//   const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);
//   const [files, setFiles] = useState([]);
//   const [documentType, setDocumentType] = useState("deed");
//   const [amountPaid, setAmountPaid] = useState("");

//   useEffect(() => {
//     if (!open) return;
//     setDone(false);
//     setCurrentPropertyIndex(0);
//     setFiles([]);
//     setDocumentType("deed");
//     setAmountPaid("");
//     setError("");

//     const fetchProperties = async () => {
//       try {
//         const token = getAuthToken();
//         const res = await fetch(
//           "https://hinansho-client-portal-backend.onrender.com/admin/fetch-properties",
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         const data = await res.json();
//         if (data.success) setProperties(data.properties);
//       } catch (err) {
//         console.error("Failed to fetch properties", err);
//       }
//     };
//     fetchProperties();
//   }, [open]);

//   // lock background scroll
//   useEffect(() => {
//     document.body.style.overflow = open ? "hidden" : "";
//     return () => { document.body.style.overflow = ""; };
//   }, [open]);

//   const handleUploadDocs = async () => {
//     try {
//       setError("");
//       setLoading(true);
//       setLoadingMsg("Uploading documents...");

//       const token = getAuthToken();
//       if (!token) throw new Error("Token is missing");
//       if (!investorId) throw new Error("Investor ID is missing");

//       const currentPropertyId = properties[currentPropertyIndex]?._id;
//       if (!currentPropertyId) throw new Error("Property ID is missing");

//       const formData = new FormData();
//       files.forEach((file) => formData.append("documents", file));
//       formData.append("documentType", documentType);
//       formData.append("propertyId", currentPropertyId);

//       const uploadRes = await fetch(
//         `https://hinansho-client-portal-backend.onrender.com/admin/investors/${investorId}/documents`,
//         { method: "POST", headers: { token }, body: formData }
//       );

//       if (!uploadRes.ok) {
//         const data = await uploadRes.json().catch(() => ({}));
//         throw new Error(data?.message || `Upload failed (${uploadRes.status})`);
//       }

//       setLoadingMsg("Assigning property...");
//       const assignRes = await fetch(
//         "https://hinansho-client-portal-backend.onrender.com/admin/assign-property",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json", token },
//           body: JSON.stringify({
//             propertyId: currentPropertyId,
//             investorId,
//             amountPaid: Number(amountPaid) || 350000,
//           }),
//         }
//       );

//       if (!assignRes.ok) {
//         const data = await assignRes.json().catch(() => ({}));
//         throw new Error(data?.message || "Failed to assign property");
//       }

//       if (currentPropertyIndex < properties.length - 1) {
//         setCurrentPropertyIndex((i) => i + 1);
//         setFiles([]);
//         setDocumentType("deed");
//         setAmountPaid("");
//       } else {
//         setDone(true);
//         onAssigned?.();
//       }
//     } catch (err) {
//       setError(err?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//       setLoadingMsg("");
//     }
//   };

//   const handleSkip = () => {
//     setFiles([]);
//     setDocumentType("deed");
//     setAmountPaid("");
//     setError("");
//     if (currentPropertyIndex < properties.length - 1) {
//       setCurrentPropertyIndex((i) => i + 1);
//     } else {
//       setDone(true);
//       onAssigned?.();
//     }
//   };

//   // ✅ Go back one property — clears current inputs and decrements index
//   const handleBack = () => {
//     setFiles([]);
//     setDocumentType("deed");
//     setAmountPaid("");
//     setError("");
//     setCurrentPropertyIndex((i) => Math.max(0, i - 1));
//   };

//   const closeAndReset = () => {
//     onClose?.();
//     setTimeout(() => {
//       setDone(false);
//       setCurrentPropertyIndex(0);
//       setFiles([]);
//       setDocumentType("deed");
//       setAmountPaid("");
//       setError("");
//     }, 300);
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-[1200] bg-black/60 flex items-center justify-center p-4 sm:p-6">
//       {/* Backdrop */}
//       <div className="absolute inset-0" onClick={closeAndReset} />

//       {/* Modal shell — NO overflow here */}
//       <div className="relative z-10  max-w-[620px] max-h-[88vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-white">

//         {/* ── HEADER — fixed, never scrolls ── */}
//         <div className="flex-shrink-0 relative bg-[#0F172A] px-5 sm:px-8 py-5">
//           <button onClick={closeAndReset} className="absolute right-4 top-4 sm:right-6 sm:top-5 text-white/70 hover:text-white transition">
//             <IoClose className="text-[22px]" />
//           </button>
//           <h2 className="text-white text-[17px] sm:text-[20px] font-semibold pr-10">Assign Property</h2>
//           <p className="text-white/60 text-[12px] sm:text-[13px] mt-1 pr-10">
//             Assign a property and upload legal documents for this investor.
//           </p>
//         </div>

//         {/* ── BODY — only this scrolls ── */}
//         <div className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-8 pt-6 pb-3">
//           {done ? (
//             <div className="flex flex-col items-center justify-center py-10 text-center">
//               <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
//                 <IoCheckmarkCircle className="text-green-500 text-[34px]" />
//               </div>
//               <h3 className="text-[17px] font-bold text-[#0F172A] mb-2">All Done!</h3>
//               <p className="text-[13px] text-[#64748B] max-w-[280px]">
//                 Properties have been assigned and documents uploaded successfully.
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {error && (
//                 <div className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-[10px] p-3">{error}</div>
//               )}

//               {/* Progress */}
//               <div className="flex items-center justify-between">
//                 <p className="text-[11px] sm:text-[12px] text-[#64748B]">
//                   Property <span className="font-semibold text-[#0F172A]">{currentPropertyIndex + 1}</span> of{" "}
//                   <span className="font-semibold text-[#0F172A]">{properties.length}</span>
//                 </p>
//                 <div className="flex gap-1">
//                   {properties.map((_, i) => (
//                     <div key={i} className={`h-1.5 rounded-full transition-all ${
//                       i < currentPropertyIndex ? "w-6 bg-[#DDA04E]"
//                       : i === currentPropertyIndex ? "w-6 bg-[#DDA04E]/50"
//                       : "w-4 bg-[#E2E8F0]"
//                     }`} />
//                   ))}
//                 </div>
//               </div>

//               {/* Property card */}
//               <div className="border border-[#E2E8F0] rounded-[12px] p-3 bg-[#F8FAFC]">
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 rounded-[8px] bg-[#DDA04E]/10 flex items-center justify-center flex-shrink-0">
//                     <BsBuildings className="text-[#DDA04E] text-[16px]" />
//                   </div>
//                   <div>
//                     <p className="text-[13px] font-semibold text-[#0F172A]">
//                       {properties[currentPropertyIndex]?.name || "Unnamed Property"}
//                     </p>
//                     <p className="text-[11px] text-[#64748B]">
//                       {properties[currentPropertyIndex]?.location || "—"}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Amount Paid */}
//               <div>
//                 <label className="block text-[12px] font-medium text-[#0F172A] mb-1.5">Amount Paid (₦)</label>
//                 <input
//                   type="number"
//                   value={amountPaid}
//                   onChange={(e) => setAmountPaid(e.target.value)}
//                   placeholder="e.g. 350000"
//                   className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] px-4 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-[#DDA04E]/30"
//                 />
//               </div>

//               {/* Document Type */}
//               <div>
//                 <label className="block text-[12px] font-medium text-[#0F172A] mb-1.5">Document Type</label>
//                 <select
//                   value={documentType}
//                   onChange={(e) => setDocumentType(e.target.value)}
//                   className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] px-4 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-[#DDA04E]/30"
//                 >
//                   <option value="deed">Deed</option>
//                   <option value="contract">Contract</option>
//                   <option value="invoice">Invoice</option>
//                   <option value="other">Other</option>
//                 </select>
//               </div>

//               {/* File Upload */}
//               <div>
//                 <label className="block text-[12px] font-medium text-[#0F172A] mb-1.5">Upload Documents</label>
//                 <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-[#E2E8F0] rounded-[12px] py-5 px-4 cursor-pointer hover:border-[#DDA04E]/50 hover:bg-[#FFFBF5] transition bg-white">
//                   <MdOutlineFileUpload className="text-[24px] text-[#DDA04E] mb-1" />
//                   <p className="text-[11px] sm:text-[12px] text-[#64748B] text-center">
//                     {files.length > 0 ? `${files.length} file${files.length > 1 ? "s" : ""} selected` : "Click to browse or drag files here"}
//                   </p>
//                   <input type="file" multiple className="hidden" onChange={(e) => setFiles(Array.from(e.target.files))} />
//                 </label>
//                 {files.length > 0 && (
//                   <ul className="mt-2 space-y-1">
//                     {files.map((f, i) => (
//                       <li key={i} className="flex items-center justify-between text-[11px] text-[#475569] bg-[#F1F5F9] rounded-[8px] px-3 py-1.5">
//                         <span className="truncate max-w-[75%]">{f.name}</span>
//                         <button
//                           onClick={() => setFiles(files.filter((_, fi) => fi !== i))}
//                           className="text-[#94A3B8] hover:text-red-500 transition ml-2 flex-shrink-0"
//                         >
//                           <IoClose />
//                         </button>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>

//               {loading && (
//                 <div className="flex items-center gap-2 text-[12px] text-[#DDA04E] font-medium bg-[#FFFBF5] border border-[#DDA04E]/30 rounded-[10px] px-4 py-2.5">
//                   <Spinner size={14} color="#DDA04E" />
//                   {loadingMsg || "Processing..."}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* ── FOOTER — fixed, never scrolls ── */}
//         <div className="flex-shrink-0 bg-[#F8FAFC] border-t border-[#E2E8F0] px-5 sm:px-8 py-3 flex items-center justify-between gap-2 sm:gap-3">

//           {/* Left — Back (only show when not on first property and not done) */}
//           <div>
//             {!done && currentPropertyIndex > 0 && (
//               <button
//                 onClick={handleBack}
//                 disabled={loading}
//                 className="px-4 sm:px-5 py-2 rounded-[10px] bg-white border border-[#E2E8F0] text-[#0F172A] text-[12px] sm:text-[13px] shadow-sm hover:bg-[#F8FAFC] transition disabled:opacity-40"
//               >
//                 Back
//               </button>
//             )}
//           </div>

//           {/* Right — Skip + primary action */}
//           <div className="flex items-center gap-2">
//             {!done ? (
//               <>
//                 <button
//                   onClick={handleSkip}
//                   disabled={loading}
//                   className="px-4 sm:px-5 py-2 rounded-[10px] bg-white border border-[#E2E8F0] text-[#0F172A] text-[12px] sm:text-[13px] shadow-sm hover:bg-[#F8FAFC] transition disabled:opacity-40"
//                 >
//                   Skip
//                 </button>
//                 <button
//                   onClick={handleUploadDocs}
//                   disabled={loading || files.length === 0}
//                   className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 rounded-[10px] bg-[#DDA04E] text-white text-[12px] sm:text-[13px] shadow-sm hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
//                 >
//                   {loading && <Spinner size={13} color="white" />}
//                   {loading ? loadingMsg || "Processing..." : "Assign & Upload"}
//                 </button>
//               </>
//             ) : (
//               <button
//                 onClick={closeAndReset}
//                 className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 rounded-[10px] bg-[#DDA04E] text-white text-[12px] sm:text-[13px] shadow-sm hover:opacity-90 transition"
//               >
//                 <IoCheckmarkCircle className="text-[15px]" />
//                 Done
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


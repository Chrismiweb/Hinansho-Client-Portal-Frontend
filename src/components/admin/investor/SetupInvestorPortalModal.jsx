// // components/investors/SetupInvestorPortalModal.jsx
// "use client";

// import { useMemo, useState, useEffect  } from "react";
// import { IoClose, IoCheckmarkCircle } from "react-icons/io5";
// import { MdOutlineFileUpload } from "react-icons/md";
// import { BsBuildings } from "react-icons/bs";
// import { getAuthToken } from "@/lib/authStorage";
// import { createInvestor } from "@/lib/createInvestor";
// import { uploadInvestorDocuments } from "@/lib/uploadInvestorDocuments";

// export default function SetupInvestorPortalModal({ open, onClose }) {

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     const [createdInvestor, setCreatedInvestor] = useState(null); // keep result for step 2/3
//     const [step, setStep] = useState(1);
//     const [amountPaid, setAmountPaid] = useState(0);

//     // Step 1 fields
//     const [fullName, setFullName] = useState("");
//     const [email, setEmail] = useState("");
//     const [phone, setPhone] = useState("");

//     // Step 2 fields
//     const [selectedPropertyIds, setSelectedPropertyIds] = useState([]);

//     // Step 3 fields
//     const [files, setFiles] = useState([]);

//     const [documentType, setDocumentType] = useState("deed");
//     const [propertyId, setPropertyId] = useState("")
//     const [properties, setProperties] = useState([]);

//         useEffect(() => {
//           const fetchProperties = async () => {
//             try {
//               const token = getAuthToken();

//               const res = await fetch(
//                 "https://hinansho-client-portal-backend.onrender.com/admin/fetch-properties",
//                 {
//                   headers: {
//                     Authorization: `Bearer ${token}`,
//                   },
//                 }
//               );

//               const data = await res.json();

//               if (data.success) {
//                 setProperties(data.properties);
//               }
//             } catch (err) {
//               console.error("Failed to fetch properties", err);
//             }
//           };

//           fetchProperties();
//         }, []);

//     function toUsernameFromEmail(email) {
//     const base = (email || "").split("@")[0] || "investor";
//     return base.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 20);
//     }


//     // TO ONBOARD NEW INVESTOR
//     const handleCreateInvestor = async () => {
//         try {
//           setError("");
//           setLoading(true);

//           const token = getAuthToken(); // ✅ read from localStorage
//           if (!token) throw new Error("Token is missing.");

//           const username = toUsernameFromEmail(email);

//           const payload = {
//             username,
//             email: email.trim(),
//             fullName: fullName.trim(),
//             phone: phone.trim(),
//           };

//           // ✅ call service (if your service expects token separately, see note below)
//           const result = await createInvestor(payload);

//           setCreatedInvestor(result.investor);
//           setStep(2);
//         } catch (err) {

//               const msg = err?.message || "Failed to create investor";
//                 const lower = msg.toLowerCase();

//                 const token = getAuthToken();

//                 // If investor might already exist → fetch real one from backend
//                 if (
//                   lower.includes("email") &&
//                   (lower.includes("taken") || lower.includes("exists") || lower.includes("already"))
//                 ) {
//                   try {
//                     const res = await fetch(
//                       `https://hinansho-client-portal-backend.onrender.com/admin/investors/by-email?email=${email}`,
//                       {
//                         headers: {
//                           Authorization: `Bearer ${token}`,
//                         },
//                       }
//                     );

//                     const data = await res.json();

//                     if (data?.investor?._id) {
//                       setCreatedInvestor(data.investor);
//                       setStep(2);
//                       setError(
//                         "Investor already exists. Continuing with existing account."
//                       );
//                       return;
//                     }
//                   } catch (fetchErr) {
//                     setError("Investor exists but failed to retrieve ID.");
//                     return;
//                   }
//                 }
//               setError(msg);
//         } finally {
//           setLoading(false);
//         }
//       };
//       // const investorId = createdInvestor?._id || createdInvestor?.id;
      
//       // TO UPLOAD DOCUMENTS FOR INVESTOR
//       // const handleUploadDocs = async () => {
//       //   try {
//       //     const investorId = createdInvestor?.investor?.id || createdInvestor?.investor?._id;

//       //     const token = getAuthToken();

//       //       const formData = new FormData();

//       //       files.forEach(file => {
//       //         formData.append("documents", file);
//       //       });

//       //       formData.append("documentType", documentType);
//       //       formData.append("propertyId", propertyId);

//       //       await fetch(
//       //         `https://hinansho-client-portal-backend.onrender.com/admin/investors/${investorId}/documents`,
//       //         {
//       //           method: "POST",
//       //           headers: {
//       //             // token: token, // ✅ IMPORTANT
//       //             Authorization: `Bearer ${token}`,
//       //           },
//       //           body: formData,
//       //         }
//       //       );
//       //   } catch (err) {
//       //     setError(err?.message || "Failed to upload documents");
//       //   } finally {
//       //     setLoading(false);
//       //   }
//       // };
//       const handleUploadDocs = async () => {
//     try {
//         const investorId = createdInvestor?.investor?.id || createdInvestor?.investor?._id;
//         const token = getAuthToken();

//         // Make sure the token exists
//         if (!token) throw new Error("Token is missing");

//         const formData = new FormData();
//         files.forEach(file => formData.append("documents", file));

//         // Append other necessary fields
//         formData.append("documentType", documentType);
//         formData.append("propertyId", propertyId);

//         const res = await fetch(
//             `https://hinansho-client-portal-backend.onrender.com/admin/investors/${investorId}/documents`,
//             {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//                 body: formData,  // Send the formData as the body
//             }
//         );

//         if (!res.ok) {
//             const data = await res.json();
//             throw new Error(data?.message || "Failed to upload documents");
//         }

//         // Optional: Handle response if needed
//         const data = await res.json();
//         console.log("Documents uploaded successfully:", data);
//     } catch (err) {
//         setError(err?.message || "Failed to upload documents");
//     } finally {
//         setLoading(false);
//     }
// };
//         console.log("createdInvestor:", createdInvestor);
//         console.log("Selected Files:", files);


        
//       // TO ASSIGN UNITS TO INVESTOR
// const handleAssignUnits = async () => {
//   try {
//     setError("");  // Clear any existing error
//     setLoading(true);  // Show loading state

//     const token = getAuthToken();
//     if (!token) throw new Error("Token missing");  // Ensure token is present

//     const investorId = createdInvestor?.id;
//     if (!investorId) throw new Error("Investor ID missing");  // Ensure investor ID is available

//     // Filter selected properties to only include "land" properties
//     const landProperties = selectedPropertyIds.filter((propertyId) => {
//       const property = properties.find(p => p._id === propertyId);  // Find the property by ID
//       return property && property.property_type === "land";  // Only include properties with property_type "land"
//     });

//     if (landProperties.length === 0) {
//       throw new Error("No land properties selected");  // Ensure at least one land property is selected
//     }

//     // Loop through selected land properties and assign them to the investor
//     await Promise.all(
//       landProperties.map(async (propertyId) => {
//         const res = await fetch(
//           "https://hinansho-client-portal-backend.onrender.com/admin/assign-property",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({
//               propertyId,
//               investorId,
//               amountPaid: 350000,  // You can replace this value based on your logic
//             }),
//           }
//         );
        
//         const data = await res.json();  // Parse the response
//         console.log("Assign response:", data);

//         if (!res.ok) {
//           throw new Error(data?.message || "Failed to assign property");  // Throw error if response is not OK
//         }
//       })
//     );

//     setStep(3);  // Move to the next step if successful
//   } catch (err) {
//     setError(err.message || "Failed to assign property");  // Set error if any exception occurs
//   } finally {
//     setLoading(false);  // Hide loading state
//   }
// };

//   const selectedCount = selectedPropertyIds.length;

//   const steps = useMemo(
//     () => [
//       { id: 1, label: "Details" },
//       { id: 2, label: "Properties" },
//       { id: 3, label: "Documents" },
//     ],
//     []
//   );

//   const isStepComplete = (s) => s < step;

//   const toggleProperty = (id) => {
//     setSelectedPropertyIds((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   const handlePickFiles = (e) => {
//     const list = Array.from(e.target.files || []);
//     if (!list.length) return;
//     setFiles((prev) => [...prev, ...list]);
//   };

//   const canGoNext =
//     step === 1 ? fullName.trim() && email.trim() : step === 2 ? selectedCount > 0 : true;

//   const next = () => {
//     if (!canGoNext) return;
//     setStep((s) => Math.min(3, s + 1));
//   };

//   const back = () => setStep((s) => Math.max(1, s - 1));

//   const closeAndReset = () => {
//     onClose?.();
//     setStep(1);
//     // (optional) keep data or reset it
//   };

//   if (!open) return null;


// console.log("selectedPropertyIds:", selectedPropertyIds);
// console.log("canGoNext:", canGoNext);

//   return (
//     <div className="fixed inset-0 z-[999]">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/45"
//         onClick={closeAndReset}
//       />

//       {/* Modal */}
//       <div className="absolute inset-0 flex items-center justify-center p-4">
//         <div className="w-full max-w-[740px] rounded-[16px] overflow-hidden shadow-2xl bg-white">
//           {/* Header (dark) */}
//           <div className="relative bg-[#0F172A] px-8 py-6">
//             <button
//               onClick={closeAndReset}
//               className="absolute right-6 top-6 text-white/70 hover:text-white transition"
//               aria-label="Close"
//             >
//               <IoClose className="text-[22px]" />
//             </button>

//             <h2 className="text-white text-[22px] font-semibold">
//               Setup Investor Portal
//             </h2>
//             <p className="text-white/65 text-[14px] mt-1">
//               Create a new investor account, assign properties, and upload legal documents.
//             </p>
//           </div>

//           {/* Body */}
//           <div className="px-8 pt-8 pb-6">
//             {/* Stepper */}
//             <div className="grid grid-cols-3 gap-6">
//               {steps.map((s) => {
//                 const active = s.id === step;
//                 const complete = isStepComplete(s.id);

//                 return (
//                   <div key={s.id} className="flex flex-col items-center">
//                     <div
//                       className={[
//                         "w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-semibold",
//                         complete
//                           ? "bg-[#DDA04E] text-white"
//                           : active
//                           ? "bg-[#DDA04E] text-white"
//                           : "bg-[#EEF2F7] text-[#94A3B8]",
//                       ].join(" ")}
//                     >
//                       {complete ? <IoCheckmarkCircle className="text-[20px]" /> : s.id}
//                     </div>

//                     <p
//                       className={[
//                         "mt-2 text-[13px]",
//                         active || complete ? "text-[#0F172A]" : "text-[#94A3B8]",
//                       ].join(" ")}
//                     >
//                       {s.label}
//                     </p>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Content */}
//             <div className="mt-7">
//               {step === 1 && (
//                 <div>
//                     {error ? (
//                     <div className="mt-4 text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[12px] p-3">
//                         {error}
//                     </div>
//                     ) : null}
//                   <label className="block text-[14px] text-[#0F172A] font-medium">
//                     Full Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     value={fullName}
//                     onChange={(e) => setFullName(e.target.value)}
//                     placeholder="e.g. Robert Fox"
//                     className="mt-2 w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#DDA04E]/30"
//                   />

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
//                     <div>
//                       <label className="block text-[14px] text-[#0F172A] font-medium">
//                         Email Address <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         placeholder="robert@example.com"
//                         className="mt-2 w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#DDA04E]/30"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-[14px] text-[#0F172A] font-medium">
//                         Phone Number
//                       </label>
//                       <input
//                         value={phone}
//                         onChange={(e) => setPhone(e.target.value)}
//                         placeholder="+1 (555) 000-0000"
//                         className="mt-2 w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#DDA04E]/30"
//                       />
//                     </div>
//                   </div>

//                   {/* Note box */}
//                   <div className="mt-5 bg-[#EAF2FF] border border-[#D7E6FF] rounded-[12px] p-4">
//                     <p className="text-[#1D4ED8] font-semibold text-[13px]">Note:</p>
//                     <p className="text-[#1D4ED8] text-[13px] mt-1">
//                       Login credentials will be automatically generated and sent to the provided email address.
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {step === 2 && (
//                 <div>
//                   <div className="flex items-center justify-between">
//                     <p className="text-[14px] text-[#0F172A] font-medium">
//                       Assign Properties
//                     </p>

//                     <div className="text-[12px] text-[#94A3B8]">
//                       {selectedCount} selected
//                     </div>
//                   </div>

//                   <div className="mt-4 space-y-4">
//                     {/* {properties.map((p) => {
//                       const checked = selectedPropertyIds.includes(p._id);

//                       return (
//                         <button
//                           type="button"
//                           key={p._id}
//                           onClick={() => toggleProperty(p.id)}
//                           className={[
//                             "w-full flex items-center justify-between rounded-[12px] border px-4 py-4 text-left transition",
//                             checked
//                               ? "border-[#DDA04E] bg-[#FFF8ED]"
//                               : "border-[#E8EEF6] bg-white hover:bg-[#F8FAFC]",
//                           ].join(" ")}
//                         >
//                           <div className="flex items-center gap-3">
//                             <div
//                               className={[
//                                 "w-5 h-5 rounded-[6px] border flex items-center justify-center",
//                                 checked
//                                   ? "bg-[#DDA04E] border-[#DDA04E]"
//                                   : "bg-white border-[#CBD5E1]",
//                               ].join(" ")}
//                             >
//                               {checked ? (
//                                 <IoCheckmarkCircle className="text-white text-[16px]" />
//                               ) : null}
//                             </div>

//                             <div>
//                               <p className="text-[15px] font-semibold text-[#0F172A]">
//                                 {p.name}
//                               </p>
//                               <p className="text-[13px] text-[#64748B] mt-[2px]">
//                                 {p.location}
//                               </p>
//                             </div>
//                           </div>

//                           <div className="text-[#DDA04E]">
//                             <BsBuildings className="text-[18px]" />
//                           </div>
//                         </button>
//                       );
//                     })} */}
//                     {properties.map((property) => (
//                         <div key={property._id}>
//                           <input
//                             type="checkbox"
//                             // value={property._id}
//                             checked={selectedPropertyIds.includes(property._id)}
//                             onChange={(e) => {
//                               if (e.target.checked) {
//                                 setSelectedPropertyIds(prev => [...prev, property._id]);
//                               } else {
//                                 setSelectedPropertyIds(prev =>
//                                   prev.filter(id => id !== property._id)
//                                 );
//                               }
//                             }}
//                           />
//                           {property.name}
//                         </div>
//                       ))}
//                   </div>
//                 </div>
//               )}

//               {step === 3 && (
//                 <div>
//                   <div className="rounded-[14px] border border-[#E8EEF6] bg-white p-10">
//                     <div className="flex flex-col items-center justify-center text-center">
//                       <div className="w-10 h-10 rounded-full bg-[#EEF2F7] flex items-center justify-center">
//                         <MdOutlineFileUpload className="text-[#64748B] text-[18px]" />
//                       </div>

//                       <p className="mt-4 text-[14px] font-medium text-[#0F172A]">
//                         Click to upload documents
//                       </p>
//                       <p className="text-[13px] text-[#64748B] mt-1">
//                         Legal agreements, deeds, contracts, etc.
//                       </p>

//                       <label className="mt-5 inline-flex cursor-pointer">
//                         <input
//                           type="file"
//                           multiple
//                           className="hidden"
//                           onChange={handlePickFiles}
//                         />
//                         <span className="text-[13px] text-[#1D4ED8] hover:underline">
//                           Choose files
//                         </span>
//                       </label>

//                       {files.length > 0 && (
//                         <div className="mt-6 w-full max-w-[520px] text-left">
//                           <p className="text-[12px] text-[#64748B] mb-2">
//                             Selected files:
//                           </p>
//                           <div className="space-y-2">
//                             {files.map((f, idx) => (
//                               <div
//                                 key={`${f.name}-${idx}`}
//                                 className="flex items-center justify-between rounded-[10px] border border-[#E8EEF6] px-3 py-2"
//                               >
//                                 <p className="text-[13px] text-[#0F172A] truncate">
//                                   {f.name}
//                                 </p>
//                                 <p className="text-[12px] text-[#64748B]">
//                                   {(f.size / 1024 / 1024).toFixed(1)} MB
//                                 </p>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="bg-[#F8FAFC] px-8 py-5 flex items-center justify-end gap-3">
//             {step > 1 ? (
//               <button
//                 onClick={back}
//                 className="px-6 py-2 rounded-[10px] bg-white border border-[#E2E8F0] text-[#0F172A] text-[14px] shadow-sm hover:bg-[#F8FAFC] transition"
//               >
//                 Back
//               </button>
//             ) : null}

//             {step < 3 ? (
//               <button
//                 // onClick={step === 1 ? handleCreateInvestor : next}
//                 onClick={
//                     step === 1
//                       ? handleCreateInvestor
//                       : step === 2
//                       ? handleAssignUnits
//                       : next
//                   }
//                 // disabled={step === 1 ? (!canGoNext || loading) : !canGoNext}
//                 disabled={!canGoNext || loading}
//                 className={[
//                   "px-6 py-2 rounded-[10px] text-[14px] shadow-sm transition",
//                   canGoNext
//                     ? "bg-[#0F172A] text-white hover:opacity-95"
//                     : "bg-[#0F172A]/40 text-white cursor-not-allowed",
//                 ].join(" ")}
//               >
//                 {/* {step === 1 ? (loading ? "Creating..." : "Next Step") : "Next Step"} */}
//                 {step === 1
//                   ? loading ? "Creating..." : "Next Step"
//                   : step === 2
//                   ? loading ? "Assigning..." : "Assign & Continue"
//                   : "Next Step"}
//               </button>
//             ) : (
//               <button
//                 onClick={handleUploadDocs}
//                 className="px-6 py-2 rounded-[10px] bg-[#DDA04E] text-white text-[14px] shadow-sm hover:opacity-95 transition flex items-center gap-2"
//               >
//                 <IoCheckmarkCircle className="text-[18px]" />
                
//                 {loading ? "Uploading..." : "Create and Send Login"}
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useMemo, useState, useEffect } from "react";
import { IoClose, IoCheckmarkCircle } from "react-icons/io5";
import { MdOutlineFileUpload } from "react-icons/md";
import { BsBuildings } from "react-icons/bs";
import { getAuthToken } from "@/lib/authStorage";
import { createInvestor } from "@/lib/createInvestor";

export default function SetupInvestorPortalModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdInvestor, setCreatedInvestor] = useState(null); // keep result for step 2/3
  const [step, setStep] = useState(1);
  const [amountPaid, setAmountPaid] = useState(0);
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);

  // Step 1 fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Step 2 fields
  const [selectedPropertyIds, setSelectedPropertyIds] = useState([]);

  // Step 3 fields
  const [files, setFiles] = useState([]);
  const [documentType, setDocumentType] = useState("deed");
  const [propertyId, setPropertyId] = useState("");
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = getAuthToken();
        const res = await fetch(
          "https://hinansho-client-portal-backend.onrender.com/admin/fetch-properties",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (data.success) {
          setProperties(data.properties);
        }
      } catch (err) {
        console.error("Failed to fetch properties", err);
      }
    };

    fetchProperties();
  }, []);

  function toUsernameFromEmail(email) {
    const base = (email || "").split("@")[0] || "investor";
    return base.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 20);
  }

  // TO ONBOARD NEW INVESTOR
  const handleCreateInvestor = async () => {
    try {
      setError("");
      setLoading(true);

      const token = getAuthToken(); // ✅ read from localStorage
      if (!token) throw new Error("Token is missing.");

      const username = toUsernameFromEmail(email);
      const payload = {
        username,
        email: email.trim(),
        fullName: fullName.trim(),
        phone: phone.trim(),
      };

      const result = await createInvestor(payload);

      if (result?.investor) {
        setCreatedInvestor(result.investor);
        setStep(2); // Proceed to Step 2 after successful creation
      } else {
        throw new Error("Investor creation failed");
      }
    } catch (err) {
      setError(err?.message || "Failed to create investor");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocs = async () => {
     console.log("Current property object:", properties[currentPropertyIndex]); // 👈 add this
     console.log("All properties:", properties); // 👈 and this
    try {
      const investorId = createdInvestor?.id || createdInvestor?._id;
      const token = getAuthToken();

      if (!token) throw new Error("Token is missing");

      if (files.length === 0) {
        throw new Error("No files selected for upload");
      }

      // const currentPropertyId = properties[currentPropertyIndex]?.propertyId;
      const currentPropertyId = properties[currentPropertyIndex]?._id;
      if (!currentPropertyId) throw new Error("Property ID is missing");

      const formData = new FormData();
      files.forEach((file) => formData.append("documents", file));
      formData.append("documentType", documentType);
      formData.append("propertyId", currentPropertyId);

      const res = await fetch(
        `https://hinansho-client-portal-backend.onrender.com/admin/investors/${investorId}/documents`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "Failed to upload documents");
      }

      // Proceed with assigning property after document upload
      await assignProperty(investorId, currentPropertyId);

      // if (currentPropertyIndex < properties.length - 1) {
      //     setCurrentPropertyIndex(currentPropertyIndex + 1);
      //     setFiles([]); // ← add this
      //   } else {
      //     setStep(3);
      //   }
      if (currentPropertyIndex < properties.length - 1) {
          setCurrentPropertyIndex(currentPropertyIndex + 1);
          setFiles([]);         // ✅ already there
          setDocumentType("deed"); // ✅ add this too
        } else {
          setStep(3);
        }
    } catch (err) {
      setError(err?.message || "Failed to upload documents");
    } finally {
      setLoading(false);
    }
  };

  const assignProperty = async (investorId, propertyId) => {
      const token = getAuthToken();

      const res = await fetch(
        "https://hinansho-client-portal-backend.onrender.com/admin/assign-property",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            propertyId,
            investorId,
            amountPaid: 350000, // You can replace this value based on your logic
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "Failed to assign property");
      }
      console.log("Property assigned successfully");
  };

  // const handleSkip = () => {
  //   // Skip this property and move to the next
  //   if (currentPropertyIndex < properties.length - 1) {
  //     setCurrentPropertyIndex(currentPropertyIndex + 1);
  //   } else {
  //     setStep(3); // End Step 2 after last property
  //   }
  // };
  const handleSkip = () => {
      setFiles([]); // always clear files when moving to next property
      setDocumentType("deed"); // reset doc type too
      if (currentPropertyIndex < properties.length - 1) {
        setCurrentPropertyIndex(currentPropertyIndex + 1);
      } else {
        setStep(3);
      }
    };

  const selectedCount = selectedPropertyIds.length;

  const steps = useMemo(
    () => [
      { id: 1, label: "Details" },
      { id: 2, label: "Properties" },
      { id: 3, label: "Documents" },
    ],
    []
  );

  const isStepComplete = (s) => s < step;

  const canGoNext = step === 1 ? fullName.trim() && email.trim() : step === 2 ? files.length > 0 : true;

const next = () => {
  if (!canGoNext) return; // guard all steps
  if (step === 1) {
    handleCreateInvestor();
  } else {
    setStep((s) => Math.min(3, s + 1));
  }
};

  const back = () => setStep((s) => Math.max(1, s - 1));

  const closeAndReset = () => {
    onClose?.();
    setStep(1);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999]">
      <div className="absolute inset-0 bg-black/45" onClick={closeAndReset} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[740px] rounded-[16px] overflow-hidden shadow-2xl bg-white">
          <div className="relative bg-[#0F172A] px-8 py-6">
            <button onClick={closeAndReset} className="absolute right-6 top-6 text-white/70 hover:text-white transition" aria-label="Close">
              <IoClose className="text-[22px]" />
            </button>
            <h2 className="text-white text-[22px] font-semibold">Setup Investor Portal</h2>
            <p className="text-white/65 text-[14px] mt-1">Create a new investor account, assign properties, and upload legal documents.</p>
          </div>

          <div className="px-8 pt-8 pb-6">
            <div className="grid grid-cols-3 gap-6">
              {steps.map((s) => {
                const active = s.id === step;
                const complete = isStepComplete(s.id);
                return (
                  <div key={s.id} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-semibold ${
                        complete ? "bg-[#DDA04E] text-white" : active ? "bg-[#DDA04E] text-white" : "bg-[#EEF2F7] text-[#94A3B8]"
                      }`}
                    >
                      {complete ? <IoCheckmarkCircle className="text-[20px]" /> : s.id}
                    </div>
                    <p className={`mt-2 text-[13px] ${active || complete ? "text-[#0F172A]" : "text-[#94A3B8]"}`}>{s.label}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-7">
              {step === 1 && (
                <div>
                  {error && <div className="mt-4 text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[12px] p-3">{error}</div>}
                  <label className="block text-[14px] text-[#0F172A] font-medium">Full Name <span className="text-red-500">*</span></label>
                  <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Robert Fox" className="mt-2 w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#DDA04E]/30" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                    <div>
                      <label className="block text-[14px] text-[#0F172A] font-medium">Email Address <span className="text-red-500">*</span></label>
                      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="robert@example.com" className="mt-2 w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#DDA04E]/30" />
                    </div>
                    <div>
                      <label className="block text-[14px] text-[#0F172A] font-medium">Phone Number</label>
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="mt-2 w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#DDA04E]/30" />
                    </div>
                  </div>
                  <div className="mt-5 bg-[#EAF2FF] border border-[#D7E6FF] rounded-[12px] p-4">
                    <p className="text-[#1D4ED8] font-semibold text-[13px]">Note:</p>
                    <p className="text-[#1D4ED8] text-[13px] mt-1">Login credentials will be automatically generated and sent to the provided email address.</p>
                  </div>
                </div>
              )}

              {/* {step === 2 && (
                <div>
                  <h3>{properties[currentPropertyIndex]?.name}</h3>
                  <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files))} />
                  <button onClick={handleUploadDocs} disabled={!files.length}>
                    {loading ? "Uploading..." : "Upload Document"}
                  </button>
                  <button onClick={handleSkip}>Skip</button>
                </div>
              )} */}

              {step === 2 && (
                  <div>
                    {error && (
                      <div className="mb-4 text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[12px] p-3">
                        {error}
                      </div>
                    )}

                    {/* Progress indicator */}
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[13px] text-[#64748B]">
                        Property <span className="font-semibold text-[#0F172A]">{currentPropertyIndex + 1}</span> of{" "}
                        <span className="font-semibold text-[#0F172A]">{properties.length}</span>
                      </p>
                      <div className="flex gap-1">
                        {properties.map((_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 w-6 rounded-full transition-all ${
                              i < currentPropertyIndex
                                ? "bg-[#DDA04E]"
                                : i === currentPropertyIndex
                                ? "bg-[#DDA04E] opacity-60"
                                : "bg-[#E2E8F0]"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Property card */}
                    <div className="border border-[#E2E8F0] rounded-[12px] p-4 bg-[#F8FAFC] mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-[10px] bg-[#DDA04E]/10 flex items-center justify-center">
                          <BsBuildings className="text-[#DDA04E] text-[18px]" />
                        </div>
                        <div>
                          <p className="text-[14px] font-semibold text-[#0F172A]">
                            {properties[currentPropertyIndex]?.name || "Unnamed Property"}
                          </p>
                          <p className="text-[12px] text-[#64748B]">
                            {properties[currentPropertyIndex]?.address || properties[currentPropertyIndex]?.propertyId}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Document type selector */}
                    <div className="mb-4">
                      <label className="block text-[13px] font-medium text-[#0F172A] mb-2">Document Type</label>
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

                    {/* File upload */}
                    <label className="block text-[13px] font-medium text-[#0F172A] mb-2">Upload Documents</label>
                    <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-[#E2E8F0] rounded-[12px] py-6 px-4 cursor-pointer hover:border-[#DDA04E]/50 hover:bg-[#FFFBF5] transition bg-white">
                      <MdOutlineFileUpload className="text-[28px] text-[#DDA04E] mb-2" />
                      <p className="text-[13px] text-[#64748B]">
                        {files.length > 0
                          ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
                          : "Click to browse or drag files here"}
                      </p>
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => setFiles(Array.from(e.target.files))}
                      />
                    </label>

                    {/* Selected files list */}
                    {files.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {files.map((f, i) => (
                          <li key={i} className="flex items-center justify-between text-[12px] text-[#475569] bg-[#F1F5F9] rounded-[8px] px-3 py-2">
                            <span className="truncate max-w-[80%]">{f.name}</span>
                            <button
                              onClick={() => setFiles(files.filter((_, fi) => fi !== i))}
                              className="text-[#94A3B8] hover:text-red-500 transition ml-2"
                            >
                              <IoClose />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

              {step === 3 && <div>All properties have been assigned!</div>}
            </div>
          </div>

          {/* <div className="bg-[#F8FAFC] px-8 py-5 flex items-center justify-end gap-3">
            {step > 1 ? (
              <button onClick={back} className="px-6 py-2 rounded-[10px] bg-white border border-[#E2E8F0] text-[#0F172A] text-[14px] shadow-sm hover:bg-[#F8FAFC] transition">Back</button>
            ) : null}

        

            {step < 3 ? (
              <button onClick={next} disabled={loading || (step === 2 && !files.length)} className="px-6 py-2 rounded-[10px] text-[14px] shadow-sm transition">
                {step === 1 ? (loading ? "Creating..." : "Next Step") : "Next Step"}
              </button>
            ) : (
              <button onClick={handleUploadDocs} className="px-6 py-2 rounded-[10px] bg-[#DDA04E] text-white text-[14px] shadow-sm hover:opacity-95 transition flex items-center gap-2">
                <IoCheckmarkCircle className="text-[18px]" />
                {loading ? "Uploading..." : "Create and Send Login"}
              </button>
            )}
          </div> */}
          <div className="bg-[#F8FAFC] px-8 py-5 flex items-center justify-end gap-3">
              {step > 1 && (
                <button
                  onClick={back}
                  className="px-6 py-2 rounded-[10px] bg-white border border-[#E2E8F0] text-[#0F172A] text-[14px] shadow-sm hover:bg-[#F8FAFC] transition"
                >
                  Back
                </button>
              )}

              {step === 2 && (
                <button
                  onClick={handleSkip}
                  className="px-6 py-2 rounded-[10px] bg-white border border-[#E2E8F0] text-[#0F172A] text-[14px] shadow-sm hover:bg-[#F8FAFC] transition"
                >
                  Skip
                </button>
              )}

              {step < 3 ? (
                <button
                  onClick={step === 2 ? handleUploadDocs : next}
                  disabled={loading || (step === 2 && !files.length)}
                  className="px-6 py-2 rounded-[10px] bg-[#DDA04E] text-white text-[14px] shadow-sm hover:opacity-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {step === 1
                    ? loading ? "Creating..." : "Next Step"
                    : loading ? "Uploading..." : "Assign & Upload"}
                </button>
              ) : (
                <button
                  onClick={closeAndReset}
                  className="px-6 py-2 rounded-[10px] bg-[#DDA04E] text-white text-[14px] shadow-sm hover:opacity-95 transition flex items-center gap-2"
                >
                  <IoCheckmarkCircle className="text-[18px]" />
                  Finish
                </button>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
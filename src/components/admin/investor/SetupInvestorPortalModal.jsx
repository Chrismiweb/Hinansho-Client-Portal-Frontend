// components/investors/SetupInvestorPortalModal.jsx
"use client";

import { useMemo, useState } from "react";
import { IoClose, IoCheckmarkCircle } from "react-icons/io5";
import { MdOutlineFileUpload } from "react-icons/md";
import { BsBuildings } from "react-icons/bs";
import { getAuthToken } from "@/lib/authStorage";
import { createInvestor } from "@/lib/createInvestor";
import { uploadInvestorDocuments } from "@/lib/uploadInvestorDocuments";

// import { createInvestor } from "@/lib/investorService";

const PROPERTIES = [
  {
    id: "pavilion",
    name: "The Pavilion Hostel",
    location: "University District, Zone A",
  },
  {
    id: "green-valley",
    name: "Green Valley Estate",
    location: "North Hills",
  },
  {
    id: "sunrise",
    name: "Sunrise Apartments",
    location: "Downtown Edge",
  },
];

export default function SetupInvestorPortalModal({ open, onClose }) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [createdInvestor, setCreatedInvestor] = useState(null); // keep result for step 2/3
    const [step, setStep] = useState(1);

    // Step 1 fields
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    // Step 2 fields
    const [selectedPropertyIds, setSelectedPropertyIds] = useState(["green-valley"]);

    // Step 3 fields
    const [files, setFiles] = useState([]);

    const [documentType, setDocumentType] = useState("deed");
    const [propertyId, setPropertyId] = useState("")

    function toUsernameFromEmail(email) {
    const base = (email || "").split("@")[0] || "investor";
    return base.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 20);
    }

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

          // ✅ call service (if your service expects token separately, see note below)
          const result = await createInvestor(payload);

          setCreatedInvestor(result);
          setStep(2);
        } catch (err) {
          // setError(err?.message || "Failed to create investor");
            // const msg = err?.message || "Failed to create investor";

            // // If user retries and email already exists, guide them to continue
            // if (msg.toLowerCase().includes("email") && msg.toLowerCase().includes("taken")) {
            //   setError("This email already exists. It may have been created on your first attempt. Please search/select the investor and continue.");
            //   // optionally: move to step 2 if you can fetch investor by email
            //   return;
            // }

            // setError(msg);
              const msg = err?.message || "Failed to create investor";

              const lower = msg.toLowerCase();

              // ✅ Case 1: Timeout (request likely succeeded but client didn't receive response)
              if (lower.includes("timeout") || lower.includes("taking longer")) {
                setCreatedInvestor({
                  fullName: fullName.trim(),
                  email: email.trim(),
                  phone: phone.trim(),
                  username: toUsernameFromEmail(email),
                  // you can add temp flag
                  _temp: true,
                });
                setStep(2);
                setError(
                  "This is taking longer than usual. The investor may have been created already. Please continue to assign properties."
                );
                return;
              }

              // ✅ Case 2: Email already exists (investor already created)
              if (lower.includes("email") && (lower.includes("taken") || lower.includes("exists") || lower.includes("already"))) {
                setCreatedInvestor({
                  fullName: fullName.trim(),
                  email: email.trim(),
                  phone: phone.trim(),
                  username: toUsernameFromEmail(email),
                  _existing: true,
                });
                setStep(2);
                setError(
                  "This email already exists. The investor was likely created already. Please continue to assign properties."
                );
                return;
              }

              setError(msg);
        } finally {
          setLoading(false);
        }
      };

      const handleUploadDocs = async () => {
        try {
          setError("");
          setLoading(true);

          const investorId = createdInvestor?._id || createdInvestor?.id;
          if (!investorId) throw new Error("Investor ID is missing.");

          await uploadInvestorDocuments({
            investorId,
            files,
            documentType,
            propertyId,
          });

          // success: close or show toast
          closeAndReset();
        } catch (err) {
          setError(err?.message || "Failed to upload documents");
        } finally {
          setLoading(false);
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

  const toggleProperty = (id) => {
    setSelectedPropertyIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handlePickFiles = (e) => {
    const list = Array.from(e.target.files || []);
    if (!list.length) return;
    setFiles((prev) => [...prev, ...list]);
  };

  const canGoNext =
    step === 1 ? fullName.trim() && email.trim() : step === 2 ? selectedCount > 0 : true;

  const next = () => {
    if (!canGoNext) return;
    setStep((s) => Math.min(3, s + 1));
  };

  const back = () => setStep((s) => Math.max(1, s - 1));

  const closeAndReset = () => {
    onClose?.();
    setStep(1);
    // (optional) keep data or reset it
  };

  if (!open) return null;




  return (
    <div className="fixed inset-0 z-[999]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/45"
        onClick={closeAndReset}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[740px] rounded-[16px] overflow-hidden shadow-2xl bg-white">
          {/* Header (dark) */}
          <div className="relative bg-[#0F172A] px-8 py-6">
            <button
              onClick={closeAndReset}
              className="absolute right-6 top-6 text-white/70 hover:text-white transition"
              aria-label="Close"
            >
              <IoClose className="text-[22px]" />
            </button>

            <h2 className="text-white text-[22px] font-semibold">
              Setup Investor Portal
            </h2>
            <p className="text-white/65 text-[14px] mt-1">
              Create a new investor account, assign properties, and upload legal documents.
            </p>
          </div>

          {/* Body */}
          <div className="px-8 pt-8 pb-6">
            {/* Stepper */}
            <div className="grid grid-cols-3 gap-6">
              {steps.map((s) => {
                const active = s.id === step;
                const complete = isStepComplete(s.id);

                return (
                  <div key={s.id} className="flex flex-col items-center">
                    <div
                      className={[
                        "w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-semibold",
                        complete
                          ? "bg-[#DDA04E] text-white"
                          : active
                          ? "bg-[#DDA04E] text-white"
                          : "bg-[#EEF2F7] text-[#94A3B8]",
                      ].join(" ")}
                    >
                      {complete ? <IoCheckmarkCircle className="text-[20px]" /> : s.id}
                    </div>

                    <p
                      className={[
                        "mt-2 text-[13px]",
                        active || complete ? "text-[#0F172A]" : "text-[#94A3B8]",
                      ].join(" ")}
                    >
                      {s.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Content */}
            <div className="mt-7">
              {step === 1 && (
                <div>
                    {error ? (
                    <div className="mt-4 text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[12px] p-3">
                        {error}
                    </div>
                    ) : null}
                  <label className="block text-[14px] text-[#0F172A] font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Robert Fox"
                    className="mt-2 w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#DDA04E]/30"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                    <div>
                      <label className="block text-[14px] text-[#0F172A] font-medium">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="robert@example.com"
                        className="mt-2 w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#DDA04E]/30"
                      />
                    </div>

                    <div>
                      <label className="block text-[14px] text-[#0F172A] font-medium">
                        Phone Number
                      </label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="mt-2 w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#DDA04E]/30"
                      />
                    </div>
                  </div>

                  {/* Note box */}
                  <div className="mt-5 bg-[#EAF2FF] border border-[#D7E6FF] rounded-[12px] p-4">
                    <p className="text-[#1D4ED8] font-semibold text-[13px]">Note:</p>
                    <p className="text-[#1D4ED8] text-[13px] mt-1">
                      Login credentials will be automatically generated and sent to the provided email address.
                    </p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] text-[#0F172A] font-medium">
                      Assign Properties
                    </p>

                    <div className="text-[12px] text-[#94A3B8]">
                      {selectedCount} selected
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    {PROPERTIES.map((p) => {
                      const checked = selectedPropertyIds.includes(p.id);

                      return (
                        <button
                          type="button"
                          key={p.id}
                          onClick={() => toggleProperty(p.id)}
                          className={[
                            "w-full flex items-center justify-between rounded-[12px] border px-4 py-4 text-left transition",
                            checked
                              ? "border-[#DDA04E] bg-[#FFF8ED]"
                              : "border-[#E8EEF6] bg-white hover:bg-[#F8FAFC]",
                          ].join(" ")}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={[
                                "w-5 h-5 rounded-[6px] border flex items-center justify-center",
                                checked
                                  ? "bg-[#DDA04E] border-[#DDA04E]"
                                  : "bg-white border-[#CBD5E1]",
                              ].join(" ")}
                            >
                              {checked ? (
                                <IoCheckmarkCircle className="text-white text-[16px]" />
                              ) : null}
                            </div>

                            <div>
                              <p className="text-[15px] font-semibold text-[#0F172A]">
                                {p.name}
                              </p>
                              <p className="text-[13px] text-[#64748B] mt-[2px]">
                                {p.location}
                              </p>
                            </div>
                          </div>

                          <div className="text-[#DDA04E]">
                            <BsBuildings className="text-[18px]" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <div className="rounded-[14px] border border-[#E8EEF6] bg-white p-10">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-10 h-10 rounded-full bg-[#EEF2F7] flex items-center justify-center">
                        <MdOutlineFileUpload className="text-[#64748B] text-[18px]" />
                      </div>

                      <p className="mt-4 text-[14px] font-medium text-[#0F172A]">
                        Click to upload documents
                      </p>
                      <p className="text-[13px] text-[#64748B] mt-1">
                        Legal agreements, deeds, contracts, etc.
                      </p>

                      <label className="mt-5 inline-flex cursor-pointer">
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handlePickFiles}
                        />
                        <span className="text-[13px] text-[#1D4ED8] hover:underline">
                          Choose files
                        </span>
                      </label>

                      {files.length > 0 && (
                        <div className="mt-6 w-full max-w-[520px] text-left">
                          <p className="text-[12px] text-[#64748B] mb-2">
                            Selected files:
                          </p>
                          <div className="space-y-2">
                            {files.map((f, idx) => (
                              <div
                                key={`${f.name}-${idx}`}
                                className="flex items-center justify-between rounded-[10px] border border-[#E8EEF6] px-3 py-2"
                              >
                                <p className="text-[13px] text-[#0F172A] truncate">
                                  {f.name}
                                </p>
                                <p className="text-[12px] text-[#64748B]">
                                  {(f.size / 1024 / 1024).toFixed(1)} MB
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-[#F8FAFC] px-8 py-5 flex items-center justify-end gap-3">
            {step > 1 ? (
              <button
                onClick={back}
                className="px-6 py-2 rounded-[10px] bg-white border border-[#E2E8F0] text-[#0F172A] text-[14px] shadow-sm hover:bg-[#F8FAFC] transition"
              >
                Back
              </button>
            ) : null}

            {step < 3 ? (
              <button
                onClick={step === 1 ? handleCreateInvestor : next}
                disabled={step === 1 ? (!canGoNext || loading) : !canGoNext}
                className={[
                  "px-6 py-2 rounded-[10px] text-[14px] shadow-sm transition",
                  canGoNext
                    ? "bg-[#0F172A] text-white hover:opacity-95"
                    : "bg-[#0F172A]/40 text-white cursor-not-allowed",
                ].join(" ")}
              >
                {step === 1 ? (loading ? "Creating..." : "Next Step") : "Next Step"}
              </button>
            ) : (
              <button
                onClick={handleUploadDocs}
                className="px-6 py-2 rounded-[10px] bg-[#DDA04E] text-white text-[14px] shadow-sm hover:opacity-95 transition flex items-center gap-2"
              >
                <IoCheckmarkCircle className="text-[18px]" />
                
                {loading ? "Uploading..." : "Create and Send Login"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

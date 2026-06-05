"use client";

import { useState } from "react";
import { getAuthToken } from "@/lib/authStorage";
import { IoClose } from "react-icons/io5";
import { MdOutlineFileUpload } from "react-icons/md";
import AssignPropertyModal from "./AssignPropertyModal";

function formatMoney(n) {
  if (!n && n !== 0) return "—";
  return Number(n).toLocaleString(undefined, {
    style: "currency", currency: "NGN", maximumFractionDigits: 0,
  });
}

// ─── View Documents Modal ───────────────────────────────────────────────────
function ViewDocumentsModal({ open, onClose, docs, propertyName }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[1100]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[480px] max-h-[80vh] flex flex-col rounded-[16px] bg-white shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
            <div>
              <p className="text-[15px] font-semibold text-[#0F172A]">Documents</p>
              <p className="text-[12px] text-[#94A3B8]">{propertyName}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <IoClose className="text-[20px]" />
            </button>
          </div>
          <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
            {docs.length === 0 ? (
              <div className="text-center py-8 text-[13px] text-[#94A3B8]">
                No documents for this property.
              </div>
            ) : (
              docs.map((doc) => (
                <div key={doc._id} className="flex items-center justify-between gap-3 rounded-[12px] border border-[#E2E8F0] p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-[8px] bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-[14px]">📄</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-[#0F172A] truncate">{doc.originalName}</p>
                      <p className="text-[11px] text-[#94A3B8] capitalize">{doc.documentType}</p>
                    </div>
                  </div>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] text-[#DDA04E] font-medium hover:underline flex-shrink-0"
                  >
                    View
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Add Document Modal ─────────────────────────────────────────────────────
function AddDocumentModal({ open, onClose, investorId, propertyId, propertyName, onUploaded }) {
  const [files, setFiles] = useState([]);
  const [documentType, setDocumentType] = useState("deed");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    try {
      setError("");
      setLoading(true);
      const token = getAuthToken();
      if (!token) throw new Error("Token missing");
      if (!files.length) throw new Error("Please select at least one file");

      const formData = new FormData();
      files.forEach((f) => formData.append("documents", f));
      formData.append("documentType", documentType);
      formData.append("propertyId", propertyId);

      const res = await fetch(
        // `https://hinansho-client-portal-backend.onrender.com/admin/investors/${investorId}/documents`,
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/investors/${investorId}/documents`,
        {
          method: "POST",
          headers: { token: token },
          body: formData,
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Upload failed");
      }

      setFiles([]);
      onUploaded?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[1500]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[380px] rounded-[16px] bg-white shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <p className="text-[15px] font-semibold text-[#0F172A]">Add Document</p>
              <p className="text-[12px] text-[#94A3B8]">{propertyName}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <IoClose className="text-[20px]" />
            </button>
          </div>
          <div className="px-5 py-4 space-y-4">
            {error && (
              <div className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-[10px] p-3">{error}</div>
            )}
            <div>
              <label className="block text-[12px] font-medium text-[#0F172A] mb-1.5">Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] px-3 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-[#DDA04E]/30"
              >
                <option value="deed">Deed</option>
                <option value="contract">Contract</option>
                <option value="invoice">Invoice</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#0F172A] mb-1.5">Files</label>
              <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-[#E2E8F0] rounded-[12px] py-5 cursor-pointer hover:border-[#DDA04E]/50 hover:bg-[#FFFBF5] transition bg-white">
                <MdOutlineFileUpload className="text-[26px] text-[#DDA04E] mb-1" />
                <p className="text-[12px] text-[#64748B]">
                  {files.length > 0 ? `${files.length} file(s) selected` : "Click to browse files"}
                </p>
                <input type="file" multiple className="hidden" onChange={(e) => setFiles(Array.from(e.target.files))} />
              </label>
              {files.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {files.map((f, i) => (
                    <li key={i} className="flex items-center justify-between text-[12px] text-[#475569] bg-[#F1F5F9] rounded-[8px] px-3 py-2">
                      <span className="truncate max-w-[80%]">{f.name}</span>
                      <button onClick={() => setFiles(files.filter((_, fi) => fi !== i))} className="text-[#94A3B8] hover:text-red-500 ml-2">
                        <IoClose />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-[10px] bg-white border border-[#E2E8F0] text-[#0F172A] text-[13px] font-medium hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleUpload} disabled={loading || !files.length} className="flex-1 px-4 py-2.5 rounded-[10px] bg-[#DDA04E] text-white text-[13px] font-medium hover:opacity-90 transition disabled:opacity-40">
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function InvestorProperties({ portfolio, documents, investorId, allProperties, onAssign }) {
  const [viewDocs, setViewDocs] = useState(null);
  const [addDoc, setAddDoc] = useState(null);
  const [assignOpen, setAssignOpen] = useState(false); // ✅ declared here

  // ── Empty state — BEFORE the .map() ────────────────────────────────────
  if (!portfolio || portfolio.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="w-14 h-14 rounded-[16px] bg-[#DDA04E]/10 flex items-center justify-center mb-4">
            <span className="text-[28px]">🏢</span>
          </div>
          <p className="text-[14px] font-semibold text-[#0F172A] mb-1">No Properties Assigned</p>
          <p className="text-[13px] text-[#94A3B8] mb-5 max-w-[220px]">
            This investor has no properties assigned yet.
          </p>
          <button
            onClick={() => setAssignOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#DDA04E] text-white text-[13px] font-medium hover:opacity-90 transition"
          >
            + Assign Property
          </button>
        </div>

        <AssignPropertyModal
          open={assignOpen}
          onClose={() => setAssignOpen(false)}
          investorId={investorId}
          onAssigned={() => {
            setAssignOpen(false);
            onAssign?.();
          }}
        />
      </>
    );
  }

  // ── Build property cards — AFTER the early return ───────────────────────
  const propertyCards = portfolio.map((item, i) => {
    const matchedDoc = documents?.find((d) => d.ownership === item.ownershipId);
    const docByIndex = documents?.[i];
    const sourceDoc = matchedDoc || docByIndex;
    const propertyFromList = allProperties?.[i];

    const propertyId = sourceDoc?.property?._id || propertyFromList?._id || null;
    const propertyName = sourceDoc?.property?.name || propertyFromList?.name || `Property ${i + 1}`;
    const finalDocs = documents?.filter((d) => d.property?._id === propertyId) || [];

    return {
      key: item.ownershipId || `property-${i}`,
      propertyId,
      propertyName,
      docs: finalDocs,
      amountPaid: item.amountPaid,
      assignedDate: item.assignedDate,
      ownershipId: item.ownershipId,
    };
  });

  return (
    <>
      <div className="space-y-3">
        {propertyCards.map((item) => (
          <div key={item.key} className="rounded-[14px] border border-[#E2E8F0] p-4 space-y-3">
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-[#DDA04E]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[16px]">🏢</span>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#0F172A]">{item.propertyName}</p>
                  <p className="text-[11px] text-[#94A3B8]">ID: {item.ownershipId?.slice(-8) || "—"}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[13px] font-bold text-[#0F172A]">{formatMoney(item.amountPaid)}</p>
                <p className="text-[11px] text-[#94A3B8]">Amount Paid</p>
              </div>
            </div>

            {/* Assigned date */}
            <p className="text-[12px] text-[#64748B]">
              Assigned:{" "}
              <span className="font-medium text-[#0F172A]">
                {item.assignedDate
                  ? new Date(item.assignedDate).toLocaleDateString("en-US", {
                      year: "numeric", month: "short", day: "numeric",
                    })
                  : "—"}
              </span>
            </p>

            {/* Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setViewDocs({ propertyId: item.propertyId, propertyName: item.propertyName, docs: item.docs })}
                className="flex-1 py-2 rounded-[10px] border border-[#E2E8F0] text-[#0F172A] text-[12px] font-medium hover:bg-gray-50 transition"
              >
                📄 View Documents
              </button>
              <button
                onClick={() => {
                  if (!item.propertyId) {
                    alert("Property ID not available for this entry.");
                    return;
                  }
                  setAddDoc({ propertyId: item.propertyId, propertyName: item.propertyName });
                }}
                disabled={!item.propertyId}
                className="flex-1 py-2 rounded-[10px] bg-[#DDA04E] text-white text-[12px] font-medium hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                + Add Document
              </button>
            </div>
          </div>
        ))}
      </div>

      <AssignPropertyModal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        investorId={investorId}
        onAssigned={() => {
          setAssignOpen(false);
          onAssign?.();
        }}
      />

      <ViewDocumentsModal
        open={!!viewDocs}
        onClose={() => setViewDocs(null)}
        docs={viewDocs?.docs || []}
        propertyName={viewDocs?.propertyName}
      />

      {addDoc && (
        <AddDocumentModal
          open={!!addDoc}
          onClose={() => setAddDoc(null)}
          investorId={investorId}
          propertyId={addDoc.propertyId}
          propertyName={addDoc.propertyName}
          onUploaded={() => console.log("Uploaded!")}
        />
      )}
    </>
  );
}

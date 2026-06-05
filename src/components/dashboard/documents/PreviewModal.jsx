"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FiDownload, FiExternalLink } from "react-icons/fi";

const TYPE_LABELS = {
  plot_allocation: "Plot Allocation",
  receipt:         "Receipt",
  invoice:         "Invoice",
  contract:        "Contract",
  document:        "Document",
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatSize = (bytes) => {
  if (!bytes) return '—';
  const kb = parseInt(bytes) / 1024;
  return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
};

export default function PreviewModal({ doc, onClose }) {
  if (!doc) return null;

  const isImage = doc.mimeType?.startsWith("image/");
  const isPdf   = doc.mimeType === "application/pdf";

  // Use Google Drive viewer for PDFs
  const viewerUrl = isPdf
    ? `https://drive.google.com/file/d/${doc.id}/preview`
    : doc.viewLink;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl w-full md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-auto p-6 relative">

        {/* Close */}
        <button onClick={onClose} className="absolute right-4 top-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
          <XMarkIcon className="w-5 h-5 text-gray-700" />
        </button>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Preview area */}
          <div className="flex-1">
            <h3 className="text-[16px] font-semibold mb-4 pr-10 text-[#0F172A]">{doc.name}</h3>

            <div className="bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center min-h-[300px]">
              {isImage && (
                <img
                  src={`https://drive.google.com/thumbnail?id=${doc.id}&sz=w800`}
                  alt={doc.name}
                  className="max-h-[60vh] object-contain w-full"
                />
              )}
              {isPdf && (
                <iframe
                  src={viewerUrl}
                  className="w-full h-[60vh]"
                  title={doc.name}
                  allow="autoplay"
                />
              )}
              {!isImage && !isPdf && (
                <div className="p-8 text-center">
                  <p className="font-medium text-[#64748B]">Preview not available for this file type.</p>
                  <a href={doc.viewLink} target="_blank" rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-sm text-[#DDA04E] font-medium hover:underline">
                    <FiExternalLink size={14} /> Open in Google Drive
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-56 flex-shrink-0">
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-4">

              <div>
                <p className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">Document Type</p>
                <p className="font-semibold text-[14px] text-[#0F172A]">{TYPE_LABELS[doc.type] || doc.type}</p>
              </div>

              <div>
                <p className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">Property</p>
                <p className="font-semibold text-[14px] text-[#DDA04E]">{doc.property || '—'}</p>
              </div>

              <div>
                <p className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">Last Modified</p>
                <p className="font-medium text-[14px] text-[#0F172A]">{formatDate(doc.modifiedTime)}</p>
              </div>

              <div>
                <p className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">File Size</p>
                <p className="font-medium text-[14px] text-[#0F172A]">{formatSize(doc.size)}</p>
              </div>

              <div className="pt-2 space-y-2">
                {doc.viewLink && (
                  <a href={doc.viewLink} target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 border-2 border-[#0F172A] text-[#0F172A] rounded-xl text-[13px] font-semibold hover:bg-[#0F172A] hover:text-white transition">
                    <FiExternalLink size={14} /> Open in Drive
                  </a>
                )}
                {doc.downloadLink && (
                  <a href={doc.downloadLink} target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#0F172A] text-white rounded-xl text-[13px] font-semibold hover:bg-[#1E293B] transition">
                    <FiDownload size={14} /> Download
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

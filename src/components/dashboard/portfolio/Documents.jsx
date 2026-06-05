"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/apiClient";
import { FiDownload, FiExternalLink } from "react-icons/fi";
import { IoDocumentTextOutline } from "react-icons/io5";

const formatSize = (bytes) => {
  if (!bytes) return "—";
  const kb = parseInt(bytes) / 1024;
  return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
};

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const TYPE_STYLES = {
  plot_allocation: { bg: "bg-[#DCFCE7]", color: "text-[#00A63E]",  label: "Plot Allocation" },
  receipt:         { bg: "bg-[#EFF6FF]", color: "text-blue-600",    label: "Receipt"         },
  invoice:         { bg: "bg-[#FFFBEB]", color: "text-[#E17100]",   label: "Invoice"         },
  document:        { bg: "bg-[#F1F5F9]", color: "text-[#64748B]",   label: "Document"        },
};

export default function Documents({ propertyName }) {
  const [docs, setDocs]       = useState([]);
  const [images, setImages]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    Promise.all([
      apiRequest("/investor/drive-documents"),
      apiRequest(`/investor/drive-property-images?property=${encodeURIComponent(propertyName)}`),
    ]).then(([docsRes, imgRes]) => {
      if (docsRes.success) {
        // Filter to only this property's documents
        const allFiles = [...(docsRes.plotAllocations || []), ...(docsRes.documents || [])];
        setDocs(allFiles.filter(f => f.property?.toLowerCase() === propertyName?.toLowerCase()));
      }
      if (imgRes.success) setImages(imgRes.images || []);
    })
    .catch(err => setError(err.message))
    .finally(() => setLoading(false));
  }, [propertyName]);

  if (loading) return (
    <div className="mt-6 flex justify-center py-10">
      <div className="h-7 w-7 animate-spin rounded-full border-4 border-[#DDA04E] border-t-transparent" />
    </div>
  );

  if (error) return <p className="mt-6 text-sm text-red-500 text-center">{error}</p>;

  return (
    <div className="mt-6 space-y-6">
      {/* Plot allocation images */}
      {images.length > 0 && (
        <div>
          <h4 className="text-[15px] font-semibold text-[#0F172A] mb-3">Plot Allocation Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map(img => (
              <a key={img.id} href={img.viewLink} target="_blank" rel="noreferrer"
                className="block rounded-xl overflow-hidden border-2 border-[#E2E8F0] hover:border-[#DDA04E] transition">
                <img src={img.thumbnailUrl} alt={img.name} className="w-full h-32 object-cover" />
                <p className="text-[11px] text-[#64748B] px-2 py-1 truncate">{img.name}</p>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Documents list */}
      <div>
        <h4 className="text-[15px] font-semibold text-[#0F172A] mb-3">
          Documents {docs.length > 0 && <span className="text-[#64748B] font-normal">({docs.length})</span>}
        </h4>
        {docs.length === 0 ? (
          <div className="text-center py-10 text-[#94A3B8]">
            <IoDocumentTextOutline className="text-4xl mx-auto mb-2" />
            <p className="text-sm">No documents found for this property</p>
          </div>
        ) : (
          <div className="space-y-3">
            {docs.map(doc => {
              const style = TYPE_STYLES[doc.type] || TYPE_STYLES.document;
              return (
                <div key={doc.id} className="flex items-center gap-4 p-4 rounded-xl border border-[#F1F5F9] hover:border-[#DDA04E] transition">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${style.bg}`}>
                    <IoDocumentTextOutline className={`text-[18px] ${style.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#0F172A] truncate">{doc.name}</p>
                    <div className="flex gap-2 mt-0.5">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${style.bg} ${style.color}`}>{style.label}</span>
                      {doc.size && <span className="text-[11px] text-[#94A3B8]">{formatSize(doc.size)}</span>}
                      {doc.modifiedTime && <span className="text-[11px] text-[#94A3B8]">{formatDate(doc.modifiedTime)}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {doc.viewLink && (
                      <a href={doc.viewLink} target="_blank" rel="noreferrer"
                        className="p-2 rounded-lg bg-[#F1F5F9] hover:bg-[#0F172A] hover:text-white text-[#64748B] transition">
                        <FiExternalLink size={14} />
                      </a>
                    )}
                    {doc.downloadLink && (
                      <a href={doc.downloadLink} target="_blank" rel="noreferrer"
                        className="p-2 rounded-lg bg-[#F1F5F9] hover:bg-[#DDA04E] hover:text-white text-[#64748B] transition">
                        <FiDownload size={14} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

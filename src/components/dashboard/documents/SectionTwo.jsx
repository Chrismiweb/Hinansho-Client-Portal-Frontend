"use client";

import { useState } from "react";
import { FiSearch, FiDownload, FiExternalLink } from "react-icons/fi";
import { IoDocumentTextOutline } from "react-icons/io5";

const TABS = [
  { key: "all",      label: "All"      },
  { key: "deed",     label: "Deed"     },
  { key: "survey",   label: "Survey"   },
  { key: "receipts", label: "Receipts" },
  { key: "others",   label: "Others"   },
];

const TYPE_STYLES = {
  plot_allocation: { bg: "bg-[#DCFCE7]", color: "text-[#00A63E]",  label: "Plot Allocation" },
  receipt:         { bg: "bg-[#EFF6FF]", color: "text-blue-600",    label: "Receipt"         },
  invoice:         { bg: "bg-[#FFFBEB]", color: "text-[#E17100]",   label: "Invoice"         },
  deed:            { bg: "bg-[#F5F3FF]", color: "text-purple-600",  label: "Deed"            },
  survey:          { bg: "bg-[#CFFAFE]", color: "text-[#155E75]",   label: "Survey"          },
  contract:        { bg: "bg-[#F5F3FF]", color: "text-purple-600",  label: "Contract"        },
  document:        { bg: "bg-[#F1F5F9]", color: "text-[#64748B]",   label: "Document"        },
};

// ── Classify doc into new tab categories ─────────────────────────────────────
const classifyDoc = (doc) => {
  const name = (doc.name || '').toLowerCase();
  const type = (doc.type || '').toLowerCase();
  if (name.includes('deed') || type === 'deed')               return 'deed';
  if (name.includes('survey') || type === 'survey')           return 'survey';
  if (name.includes('receipt') || type === 'receipt')         return 'receipts';
  if (name.includes('invoice') || type === 'invoice')         return 'receipts';
  if (name.includes('plot allocation') || type === 'plot_allocation') return 'others';
  return 'others';
};

const isImage = (mimeType = '') => mimeType.startsWith('image/');

const formatSize = (bytes) => {
  if (!bytes) return '';
  const kb = parseInt(bytes) / 1024;
  return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

function DocumentItem({ doc, onPreview }) {
  const style = TYPE_STYLES[doc.type] || TYPE_STYLES.document;
  const img   = isImage(doc.mimeType);

  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-[#F1F5F9] hover:border-[#DDA04E] hover:bg-[#FFFBEB08] transition group">
      {/* Icon / Thumbnail */}
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${style.bg}`}>
        {img
          ? <img src={`https://drive.google.com/thumbnail?id=${doc.id}&sz=w80`} alt="" className="w-full h-full object-cover rounded-xl" onError={e => e.target.style.display = 'none'} />
          : <IoDocumentTextOutline className={`text-[20px] ${style.color}`} />
        }
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-[#0F172A] truncate">{doc.name}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${style.bg} ${style.color}`}>
            {style.label}
          </span>
          <span className="text-[11px] text-[#DDA04E] font-medium bg-[#FFFBEB] px-2 py-0.5 rounded-full">
            {doc.property}
          </span>
          {doc.size && <span className="text-[11px] text-[#94A3B8]">{formatSize(doc.size)}</span>}
          {doc.modifiedTime && <span className="text-[11px] text-[#94A3B8]">{formatDate(doc.modifiedTime)}</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-shrink-0">
        {doc.viewLink && (
          <button
            onClick={() => onPreview(doc)}
            className="p-2 rounded-lg bg-[#F1F5F9] hover:bg-[#0F172A] hover:text-white text-[#64748B] transition text-[13px] font-medium hidden sm:flex items-center gap-1"
          >
            Preview
          </button>
        )}
        {doc.viewLink && (
          <a href={doc.viewLink} target="_blank" rel="noreferrer"
            className="p-2 rounded-lg bg-[#F1F5F9] hover:bg-[#0F172A] hover:text-white text-[#64748B] transition">
            <FiExternalLink size={15} />
          </a>
        )}
        {doc.downloadLink && (
          <a href={doc.downloadLink} target="_blank" rel="noreferrer"
            className="p-2 rounded-lg bg-[#F1F5F9] hover:bg-[#DDA04E] hover:text-white text-[#64748B] transition">
            <FiDownload size={15} />
          </a>
        )}
      </div>
    </div>
  );
}

export default function SectionTwo({ grouped = {}, plotAllocations = [], documents = [], onPreview = () => {} }) {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch]       = useState("");

  // Combine all docs and classify them
  const allDocs = [...plotAllocations, ...documents];

  const getFiles = () => {
    if (activeTab === "all") return allDocs;
    return allDocs.filter(f => classifyDoc(f) === activeTab);
  };

  const getCount = (key) => {
    if (key === "all") return allDocs.length;
    return allDocs.filter(f => classifyDoc(f) === key).length;
  };

  const filtered = getFiles().filter(f =>
    !search.trim() ||
    (f.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (f.property || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] w-full">

      {/* Tabs + Search */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {TABS.map(tab => {
            const count = getCount(tab.key);
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm rounded-full transition ${
                  activeTab === tab.key
                    ? "bg-[#0F172A] text-white shadow font-medium"
                    : "bg-[#F8FAFC] text-[#62748E] hover:bg-[#E2E8F0]"
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.key ? "bg-white/20" : "bg-white border border-[#E2E8F0]"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-full border border-[#E2E8F0] rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#DDA04E]"
          />
        </div>
      </div>

      {/* Document list */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map(doc => (
            <DocumentItem key={doc.id} doc={doc} onPreview={onPreview} />
          ))
        ) : (
          <div className="text-center py-12">
            <IoDocumentTextOutline className="text-5xl text-gray-200 mx-auto mb-3" />
            <p className="text-[#64748B] font-medium">No documents found</p>
            <p className="text-[#94A3B8] text-sm mt-1">
              {search ? "Try a different search term" : "No documents in this category yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

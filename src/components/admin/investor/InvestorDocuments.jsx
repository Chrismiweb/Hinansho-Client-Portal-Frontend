// components/investors/InvestorDocuments.jsx

export default function InvestorDocuments({ documents }) {
  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-[36px] mb-2">📄</div>
        <p className="text-[14px] text-[#94A3B8]">No documents uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc, i) => (
        <div
          key={doc._id || i}
          className="rounded-[14px] border border-[#E2E8F0] p-4 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-blue-50 flex items-center justify-center flex-shrink-0">
              <span className="text-[16px]">📄</span>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#0F172A]">
                {doc.documentType || doc.name || "Document"}
              </p>
              <p className="text-[12px] text-[#94A3B8]">
                {doc.uploadedAt
                  ? new Date(doc.uploadedAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "short", day: "numeric",
                    })
                  : "—"}
              </p>
            </div>
          </div>
          {doc.url && (
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-[#DDA04E] font-medium hover:underline flex-shrink-0"
            >
              View
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

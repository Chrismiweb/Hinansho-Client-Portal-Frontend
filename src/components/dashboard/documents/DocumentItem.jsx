import {
  DocumentTextIcon,
  EyeIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

function formatSize(bytes) {
  if (!bytes) return "-";
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

export default function DocumentItem({ doc, onPreview = () => {} }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#F8FAFC] transition">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
          <DocumentTextIcon className="w-5 h-5 text-red-500" />
        </div>

        <div>
          <p className="font-medium">{doc.originalName}</p>
          <p className="text-sm text-gray-500">
            {new Date(doc.uploadedAt).toLocaleDateString()} • {doc.property?.name || "-"} • {formatSize(doc.size)}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-3">
        <button onClick={onPreview} className="text-sm text-gray-500 flex items-center gap-1">
          <EyeIcon className="w-4 h-4" />
          Preview
        </button>

        <a href={doc.fileUrl} download target="_blank" rel="noreferrer" className="bg-[#0F172A] text-white px-4 py-2 rounded-full text-sm flex items-center gap-1">
          <ArrowDownTrayIcon className="w-4 h-4" />
          Download
        </a>
      </div>
    </div>
  );
}

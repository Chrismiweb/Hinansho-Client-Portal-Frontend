import {
  DocumentTextIcon,
  EyeIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

export default function DocumentItem({ doc }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#F8FAFC] transition">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
          <DocumentTextIcon className="w-5 h-5 text-red-500" />
        </div>

        <div>
          <p className="font-medium">{doc.title}</p>
          <p className="text-sm text-gray-500">
            {doc.date} • {doc.property} • {doc.size}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="text-sm text-gray-500 flex items-center gap-1">
          <EyeIcon className="w-4 h-4" />
          Preview
        </button>

        <button className="bg-[#0F172A] text-white px-4 py-2 rounded-full text-sm flex items-center gap-1">
          <ArrowDownTrayIcon className="w-4 h-4" />
          Download
        </button>
      </div>
    </div>
  );
}

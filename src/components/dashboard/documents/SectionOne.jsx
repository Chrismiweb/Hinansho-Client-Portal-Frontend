import { DocumentTextIcon, EyeIcon } from "@heroicons/react/24/outline";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const now  = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 60000); // minutes
  if (diff < 1)   return "Just now";
  if (diff < 60)  return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

export default function SectionOne({ totalDocuments = 0, propertiesCount = 0, recentDoc = null }) {
  return (
    <div className="w-full px-[20px] md:px-0">
      <div className="flex lg:flex-row flex-col w-full items-center lg:items-start gap-4">

        {/* Total Documents */}
        <div className="bg-[#0F172A] text-white w-full lg:w-[30%] min-h-[30vh] rounded-[32px] p-6">
          <DocumentTextIcon className="w-6 h-6 text-[#DDA04E] mb-3" />
          <p className="text-[16px] text-[#90A1B9]">Total Documents</p>
          <h2 className="text-[41px] font-bold mt-2">{totalDocuments}</h2>
          <p className="text-[14px] text-[#90A1B9] mt-1">Across {propertiesCount} properties</p>
        </div>

        {/* Recently Added */}
        <div className="bg-white gap-[7px] flex flex-col rounded-[32px] w-full lg:w-[30%] min-h-[30vh] p-6 border border-[#F1F5F9]">
          <EyeIcon className="w-6 h-6 text-[#DDA04E] mb-3" />
          <p className="text-[16px] text-[#90A1B9]">Recently Added</p>
          {recentDoc ? (
            <>
              <h3 className="font-semibold mt-2 truncate text-[18px] text-[#0F172A]">
                {recentDoc.name}
              </h3>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-[12px] bg-[#FFFBEB] text-[#DDA04E] font-medium px-2.5 py-0.5 rounded-full">
                  {recentDoc.property}
                </span>
                <p className="text-[13px] text-[#90A1B9]">{formatDate(recentDoc.modifiedTime)}</p>
              </div>
            </>
          ) : (
            <>
              <h3 className="font-semibold mt-2 text-[18px] text-[#94A3B8]">No documents yet</h3>
              <p className="text-[13px] text-[#90A1B9] mt-2">—</p>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
// DocumentsPage.jsx — updated SectionOne call:
// 
// const recentDoc = allDocs.length > 0
//   ? allDocs.sort((a, b) => new Date(b.modifiedTime) - new Date(a.modifiedTime))[0]
//   : null;
//
// <SectionOne
//   totalDocuments={allDocs.length}
//   propertiesCount={properties}
//   recentDoc={recentDoc}
// />

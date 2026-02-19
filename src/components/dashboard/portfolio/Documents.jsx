import { FiDownload } from "react-icons/fi";
import { CgFileDocument } from "react-icons/cg";
export default function Documents() {
  const documents = [
    {
      name: "Lease Agreement.pdf",
      date: "2024-01-01",
      size: "2.4 MB",
    },
    {
      name: "Monthly Statement - May.xlsx",
      date: "2024-06-01",
      size: "1.1 MB",
    },
    {
      name: "Property Photos.zip",
      date: "2024-02-15",
      size: "15 MB",
    },
    {
      name: "Property Photos.zip",
      date: "2024-02-15",
      size: "15 MB",
    },
  ];

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {documents.map((doc, index) => (
          <div
            key={index}
            className="bg-white border border-[#0000001A] rounded-2xl py-[19px] px-[20px] flex flex-col items-center text-center"
          >
            {/* Icon */}
            <div className=" flex items-center p-[12px] bg-[#DBEAFE] justify-center rounded-[5px] bg-blue-50 mb-6">
                <CgFileDocument className="text-[#155DFC] text-[30px]" />
            </div>

            {/* File Info */}
            <p className=" text-[16px]">
              {doc.name}
            </p>

            <p className="text-sm text-[#62748E] mt-1">
              {doc.date} • {doc.size}
            </p>

            {/* Download */}
            <button
              className="mt-6 text-[#90A1B9] hover:text-gray-700 transition"
              aria-label="Download document"
            >
              <FiDownload size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

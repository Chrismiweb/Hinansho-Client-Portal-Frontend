"use client";

import { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { CgFileDocument } from "react-icons/cg";
import { getAuthToken } from "@/lib/authStorage";

function formatSize(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const token = getAuthToken();
        if (!token) throw new Error("No token found");

        const res = await fetch(
          "https://hinansho-client-portal-backend.onrender.com/investor/documents",
          { headers: { token } }
        );

        if (!res.ok) throw new Error(`Failed to fetch documents (${res.status})`);

        const data = await res.json();

        // handle both { documents: [] } and plain []
        const docs = Array.isArray(data) ? data : Array.isArray(data?.documents) ? data.documents : [];
        setDocuments(docs);
        console.log("Fetched documents:", docs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  if (loading) {
    return (
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-[#0000001A] rounded-2xl py-[19px] px-[20px] flex flex-col items-center text-center animate-pulse">
            <div className="w-[54px] h-[54px] rounded-[5px] bg-gray-200 mb-6" />
            <div className="h-3.5 w-36 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-24 bg-gray-100 rounded" />
            <div className="mt-6 h-4 w-4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 text-center py-10 text-[13px] text-red-500">
        {error}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center py-14 text-center">
        <div className="w-14 h-14 rounded-[12px] bg-blue-50 flex items-center justify-center mb-4">
          <CgFileDocument className="text-[#155DFC] text-[30px]" />
        </div>
        <p className="text-[14px] font-semibold text-[#0F172A]">No Documents Yet</p>
        <p className="text-[13px] text-[#62748E] mt-1">Your documents will appear here once uploaded.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {documents.map((doc, index) => (
          <div
            key={doc._id || index}
            className="bg-white border border-[#0000001A] rounded-2xl py-[19px] px-[20px] flex flex-col items-center text-center"
          >
            {/* Icon */}
            <div className="flex items-center p-[12px] bg-[#DBEAFE] justify-center rounded-[5px] mb-6">
              <CgFileDocument className="text-[#155DFC] text-[30px]" />
            </div>

            {/* File Info */}
            <p className="text-[16px] font-medium text-[#0F172A] break-all">
              {doc.originalName || doc.name || "Untitled Document"}
            </p>

            <p className="text-sm text-[#62748E] mt-1 capitalize">
              {doc.documentType || "document"} • {formatDate(doc.uploadedAt || doc.createdAt)} • {formatSize(doc.size)}
            </p>

            {/* Download */}
            {doc.fileUrl ? (
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 text-[#90A1B9] hover:text-gray-700 transition"
                aria-label="Download document"
              >
                <FiDownload size={18} />
              </a>
            ) : (
              <button disabled className="mt-6 text-[#C8D3E0] cursor-not-allowed" aria-label="No file available">
                <FiDownload size={18} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

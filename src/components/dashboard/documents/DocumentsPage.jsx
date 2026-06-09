"use client";
import React, { useEffect, useState } from 'react';
import SectionOne from './SectionOne';
import SectionTwo from './SectionTwo';
import PreviewModal from './PreviewModal';
import { apiRequest } from "@/lib/apiClient";

function DocumentsPage() {
  const [data, setData]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);

  useEffect(() => {
    apiRequest("/investor/drive-documents")
      .then(res => {
        if (res.success) setData(res);
        else throw new Error(res.message);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const allDocs      = data ? [...(data.plotAllocations || []), ...(data.documents || [])] : [];
  const properties   = new Set(allDocs.map(d => d.property)).size;

  // ✅ Most recently modified document
  const recentDoc = allDocs.length > 0
    ? [...allDocs].sort((a, b) => new Date(b.modifiedTime) - new Date(a.modifiedTime))[0]
    : null;

  return (
    <div className="flex flex-col gap-5 items-center justify-center lg:items-start lg:justify-start w-full">

      {loading && (
        <div className="flex flex-col items-center justify-center w-full py-20">
          <div className="w-10 h-10 border-4 border-[#DDA04E] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm text-[#62748E]">Loading your documents from Google Drive...</p>
        </div>
      )}

      {!loading && error && (
        <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-600 font-medium">❌ Failed to load documents</p>
          <p className="text-red-400 text-sm mt-1">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <SectionOne
            totalDocuments={allDocs.length}
            propertiesCount={properties}
            recentDoc={recentDoc}
          />
          <SectionTwo
            grouped={data?.grouped || {}}
            plotAllocations={data?.plotAllocations || []}
            documents={data?.documents || []}
            onPreview={(doc) => setPreviewDoc(doc)}
          />
          {previewDoc && (
            <PreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
          )}
        </>
      )}
    </div>
  );
}

export default DocumentsPage;

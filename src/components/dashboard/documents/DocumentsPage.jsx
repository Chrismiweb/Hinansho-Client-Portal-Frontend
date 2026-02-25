"use client";
import React, { useEffect, useState } from 'react'
import SectionOne from './SectionOne'
import SectionTwo from './SectionTwo'
import PreviewModal from './PreviewModal'

function DocumentsPage() {
  const [docsResponse, setDocsResponse] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [previewDoc, setPreviewDoc] = useState(null);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) {
          console.log('DocumentsPage: no token in localStorage');
          return;
        }

        const res = await fetch('/api/documents', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            token: `${token}`,
          },
        });

        const data = await res.json();
        console.log('Documents API response:', { status: res.status, ok: res.ok, data });
        setDocsResponse({ status: res.status, ok: res.ok, data });
        if (data && data.documents) {
          setDocuments(data.documents);
        }
      } catch (err) {
        console.error('DocumentsPage: fetch error', err);
      }
    }

    fetchDocuments();
  }, []);

  return (
    <div className="flex flex-col gap-5 items-center justify-center lg:items-start lg:justify-start w-full ">
      <SectionOne
        totalDocuments={documents.length}
        propertiesCount={new Set(documents.map((d) => d.property?.name)).size}
        newThisMonth={documents.filter(d => {
          try { return new Date(d.uploadedAt) > new Date(new Date().getFullYear(), new Date().getMonth(), 1); } catch { return false }
        }).length}
      />

      <SectionTwo documents={documents} onPreview={(doc)=>setPreviewDoc(doc)} />

      {previewDoc && (
        <PreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
      )}
    </div>
  )
}

export default DocumentsPage
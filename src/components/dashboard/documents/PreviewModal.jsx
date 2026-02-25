"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function PreviewModal({ doc, onClose }) {
  if (!doc) return null;

  const isImage = doc.mimeType?.startsWith("image/");
  const isPdf = doc.mimeType === "application/pdf";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-[90%] md:w-3/4 lg:w-2/3 max-h-[90%] overflow-auto p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 p-2 rounded-full bg-gray-100">
          <XMarkIcon className="w-5 h-5 text-gray-700" />
        </button>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4">{doc.originalName}</h3>

            <div className="bg-gray-50 rounded-md p-4 flex items-center justify-center">
              {isImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={doc.fileUrl} alt={doc.originalName} className="max-h-[60vh] object-contain" />
              )}

              {isPdf && (
                <iframe src={doc.fileUrl} className="w-full h-[60vh]" title={doc.originalName} />
              )}

              {!isImage && !isPdf && (
                <div className="p-6 text-center">
                  <p className="font-medium">Preview not available for this file type.</p>
                  <a className="mt-3 inline-block text-sm text-blue-600" href={doc.fileUrl} target="_blank" rel="noreferrer">Open / Download</a>
                </div>
              )}
            </div>
          </div>

          <aside className="w-full md:w-64 lg:w-56">
            <div className="bg-white border rounded-md p-4">
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium mb-3">{doc.documentType || doc.mimeType}</p>

              <p className="text-sm text-gray-500">Uploaded</p>
              <p className="font-medium mb-3">{new Date(doc.uploadedAt).toLocaleString()}</p>

              <p className="text-sm text-gray-500">Property</p>
              <p className="font-medium mb-3">{doc.property?.name || '-'}</p>

              <a href={doc.fileUrl} download target="_blank" rel="noreferrer" className="block mt-4 bg-[#0F172A] text-white text-center py-2 rounded-md">Download</a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

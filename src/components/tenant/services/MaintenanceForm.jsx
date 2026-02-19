
"use client";

import { useState } from "react";
import { FiUpload } from "react-icons/fi";

export default function MaintenanceForm() {
  const [category, setCategory] = useState("");
  const [urgency, setUrgency] = useState("Medium (Needs attention soon)");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    // Handle form submission logic
    console.log("Form Submitted:", { category, urgency, description, file });
  };

  return (
    <div className="max-w-[700px] mx-auto p-6 bg-white rounded-[16px] shadow-xl border border-[#0000001A] mb-[40px]">
      <h2 className="text-[20px] font-semibold mb-[4px]">Maintenance Details</h2>
      <p className="text-[16px] text-[#717182] mb-6">
        Please describe the issue in detail and attach photos if possible.
      </p>

      {/* Issue Category */}
      <div className="mb-4">
        <label className="block text-[16px] font-medium text-gray-700">Issue Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-2 block w-full p-2 bg-[#F3F3F5]  rounded-[8px]"
        >
          <option value="">Select a category</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Electrical">Electrical</option>
          <option value="HVAC">HVAC</option>
        </select>
      </div>

      {/* Urgency */}
      <div className="mb-4">
        <label className="block text-[16px] font-medium text-gray-700">Urgency</label>
        <select
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
          className="mt-2 block w-full p-2 bg-[#F3F3F5]  rounded-[8px]"
        >
          <option value="Medium (Needs attention soon)">Medium (Needs attention soon)</option>
          <option value="High (Immediate attention)">High (Immediate attention)</option>
          <option value="Low (Can wait)">Low (Can wait)</option>
        </select>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-[16px] font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-2 block w-full p-2 bg-[#F3F3F5]  rounded-[8px]"
          placeholder="Please describe what happened..."
            rows={5}
        />
      </div>

      {/* Photos / Videos */}
      <div className="mb-4">
        <label className="block text-[16px] font-medium text-gray-700">Photos / Videos</label>
        <label className="mt-1 block w-full py-[25px] border-2 border-[#E2E8F0] rounded-md text-center cursor-pointer hover:bg-gray-50 transition">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          {file ? (
            <p className="text-sm text-gray-700">File: {file.name}</p>
          ) : (
            <div>
                <div className="bg-[#F1F5F9] rounded-full p-[12px] inline-block">
                    <FiUpload className="text-[20px] text-[#62748E] " />

                </div>
                <p className="text-[16px] mt-[12px] text-[#314158]">Click to upload or drag and drop</p>
            </div>
          )}
          <p className="text-xs text-[#62748E] mt-[12px]">SVG, PNG, JPG, or PDF (Max 10MB)</p>
        </label>
      </div>

      {/* Warning */}
      <div className="text-[14px] text-[#894B00] bg-[#FEFCE8] border border-[#FFF085] p-2 rounded-lg mb-6">
        <p>
          For life-threatening emergencies (fire, gas leak), please call emergency services immediately.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => console.log("Cancel clicked")}
          className="cursor-pointer font-medium py-2 px-4 border rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-[#0F172B] cursor-pointer text-white font-medium py-2 px-4 rounded-md"
        >
          Submit Request
        </button>
      </div>
    </div>
  );
}

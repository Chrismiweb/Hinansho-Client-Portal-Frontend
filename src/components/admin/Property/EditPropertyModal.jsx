"use client";

import { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { MdOutlineFileUpload } from "react-icons/md";
import { getAuthToken } from "@/lib/authStorage";

export default function EditPropertyModal({ isOpen, onClose, property, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("land");
  const [status, setStatus] = useState("active");
  const [totalUnits, setTotalUnits] = useState("");
  const [expectedRoi, setExpectedRoi] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const fileInputRef = useRef(null);

  // Populate fields when property changes
  useEffect(() => {
    if (property) {
      const raw = property.raw || property;
      setName(raw.name || "");
      setLocation(raw.location || "");
      setPropertyType(raw.property_type || "land");
      setStatus(raw.status || "active");
      setTotalUnits(raw.totalUnits || "");
      setExpectedRoi(raw.expected_roi || "");
      setDescription(raw.description || "");
      setImagePreview(raw.images?.[0] || property.image || "");
      setImageFile(null);
      setError("");
      setSuccess(false);
    }
  }, [property]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    try {
      setError("");
      setLoading(true);

      const token = getAuthToken();
      if (!token) throw new Error("Token is missing.");

      const propertyId = property?.raw?._id || property?.id || property?._id;
      if (!propertyId) throw new Error("Property ID is missing.");

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("location", location.trim());
      formData.append("property_type", propertyType);
      formData.append("status", status);
      formData.append("totalUnits", totalUnits);
      formData.append("expected_roi", expectedRoi);
      formData.append("description", description.trim());
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch(
        `https://hinansho-client-portal-backend.onrender.com/admin/update-property/${propertyId}`,
        {
          method: "PUT",
          headers: {
            token: token,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Failed to update property (${res.status})`);
      }

      setSuccess(true);
      onUpdated?.(); // notify parent to refetch
      setTimeout(() => {
        onClose?.();
        setSuccess(false);
      }, 1200);
    } catch (err) {
      setError(err?.message || "Failed to update property");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className=" w-[85%] lg:w-[70%] rounded-[20px] overflow-hidden shadow-2xl bg-white max-h-[90vh] flex flex-col">

          {/* Header */}
          <div className="relative bg-[#0F172A] px-8 py-6 flex-shrink-0">
            <button
              onClick={onClose}
              className="absolute right-6 top-6 text-white/60 hover:text-white transition"
              aria-label="Close"
            >
              <IoClose className="text-[22px]" />
            </button>
            <h2 className="text-white text-[20px] font-semibold">Edit Property</h2>
            <p className="text-white/55 text-[13px] mt-1">
              Update the details of your existing real estate asset.
            </p>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1 px-8 py-6 space-y-5">

            {/* Error / Success */}
            {error && (
              <div className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[12px] p-3">
                {error}
              </div>
            )}
            {success && (
              <div className="text-[13px] text-green-700 bg-green-50 border border-green-200 rounded-[12px] p-3">
                Property updated successfully!
              </div>
            )}

            {/* Image upload */}
            <div>
              <label className="block text-[13px] font-medium text-[#0F172A] mb-2">
                Property Image
              </label>
              <div
                className="relative w-full h-[500px] rounded-[14px] overflow-hidden bg-[#F1F5F9] cursor-pointer group border-2 border-dashed border-[#E2E8F0] hover:border-[#DDA04E]/60 transition"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Property"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-[#94A3B8]">
                    <MdOutlineFileUpload className="text-[32px] mb-1" />
                    <p className="text-[13px]">Click to upload image</p>
                  </div>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                  <MdOutlineFileUpload className="text-white text-[28px]" />
                  <span className="text-white text-[13px] font-medium">Change image</span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Property Name */}
            <div>
              <label className="block text-[13px] font-medium text-[#0F172A] mb-2">
                Property Name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-[#94A3B8]">🏢</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. The Pavilion Hostel"
                  className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] pl-9 pr-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#DDA04E]/30"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-[13px] font-medium text-[#0F172A] mb-2">
                Location
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-[#94A3B8]">📍</span>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. University District, Zone A"
                  className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] pl-9 pr-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#DDA04E]/30"
                />
              </div>
            </div>

            {/* Property Type + Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-[#0F172A] mb-2">
                  Property Type
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-[#94A3B8]">🏠</span>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] pl-9 pr-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#DDA04E]/30 appearance-none"
                  >
                    <option value="land">Land</option>
                    <option value="hostel">Hostel</option>
                    <option value="apartment">Apartment</option>
                    <option value="construction">Construction</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#0F172A] mb-2">
                  Status
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-[#94A3B8]">📋</span>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] pl-9 pr-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#DDA04E]/30 appearance-none"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="under management">Under Management</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Total Units + Expected ROI */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-[#0F172A] mb-2">
                  Total Units
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-[#94A3B8]">👥</span>
                  <input
                    type="number"
                    value={totalUnits}
                    onChange={(e) => setTotalUnits(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] pl-9 pr-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#DDA04E]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#0F172A] mb-2">
                  Expected ROI (%)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-[#94A3B8]">$</span>
                  <input
                    type="number"
                    value={expectedRoi}
                    onChange={(e) => setExpectedRoi(e.target.value)}
                    placeholder="e.g. 12.5"
                    className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] pl-9 pr-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#DDA04E]/30"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[13px] font-medium text-[#0F172A] mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter property description..."
                rows={4}
                className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#DDA04E]/30 resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="bg-[#F8FAFC] px-8 py-5 flex items-center justify-end gap-3 flex-shrink-0 border-t border-[#E2E8F0]">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-[10px] bg-white border border-[#E2E8F0] text-[#0F172A] text-[14px] font-medium shadow-sm hover:bg-[#F1F5F9] transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 rounded-[10px] bg-[#DDA04E] text-white text-[14px] font-medium shadow-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

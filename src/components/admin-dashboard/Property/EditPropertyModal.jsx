"use client";

import React, { useState, useEffect } from "react";
import { X, Camera } from "lucide-react";
import Image from "next/image";

function EditPropertyModal({ isOpen, onClose, property }) {
  const [formData, setFormData] = useState({
    propertyName: "",
    location: "",
    propertyType: "Hostel",
    status: "Active",
    totalUnits: "",
    expectedROI: "",
    description: "",
    image: null,
    imagePreview: null,
  });

  useEffect(() => {
    if (!property) return
    setFormData({
      propertyName: property.name || "",
      location: property.location || "",
      propertyType: property.type || "Hostel",
      status: property.status || "Active",
      totalUnits: property.units?.match(/\d+/)?.[0] || "",
      expectedROI: property.roi?.replace("%", "") || "",
      description: property.description || "",
      image: null,
      imagePreview: property.image || null,
    })
  }, [property])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b z-5000 border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Property</h2>
            <p className="text-gray-600 text-sm mt-1">
              Update the details of your existing real estate asset.
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-4">
              Property Image
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="imageUpload"
              />
              <label
                htmlFor="imageUpload"
                className="flex items-center justify-center relative w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition duration-200 bg-gray-50 group"
              >
                {formData.imagePreview ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={formData.imagePreview}
                      alt="Property preview"
                      width={400}
                      height={300}
                      className="max-w-full max-h-48 object-contain"
                    />
                    <div className="absolute inset-0 bg-black/30 rounded-lg opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-gray-900 font-semibold">Change image</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Property Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Property Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="propertyName"
                value={formData.propertyName}
                onChange={handleInputChange}
                placeholder="e.g. The Pavilion Hostel"
                className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition duration-200"
              />
              <span className="absolute left-3 top-3 text-gray-400">🏠</span>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Location
            </label>
            <div className="relative">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g. University District, Zone A"
                className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition duration-200"
              />
              <span className="absolute left-3 top-3 text-gray-400">📍</span>
            </div>
          </div>

          {/* Property Type and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Property Type
              </label>
              <div className="relative">
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition duration-200 appearance-none cursor-pointer"
                >
                  <option value="Hostel">Hostel</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Land">Land</option>
                  <option value="Construction">Construction</option>
                </select>
                <span className="absolute left-3 top-3 text-gray-400">🏢</span>
                <span className="absolute right-3 top-3 text-gray-400 pointer-events-none">
                  ▼
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Status
              </label>
              <div className="relative">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition duration-200 appearance-none cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Under Management">Under Management</option>
                </select>
                <span className="absolute left-3 top-3 text-gray-400">📋</span>
                <span className="absolute right-3 top-3 text-gray-400 pointer-events-none">
                  ▼
                </span>
              </div>
            </div>
          </div>

          {/* Total Units and Expected ROI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Total Units
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="totalUnits"
                  value={formData.totalUnits}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition duration-200"
                />
                <span className="absolute left-3 top-3 text-gray-400">🚪</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Expected ROI (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  name="expectedROI"
                  value={formData.expectedROI}
                  onChange={handleInputChange}
                  placeholder="0.0"
                  className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition duration-200"
                />
                <span className="absolute left-3 top-3 text-gray-400">💰</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter property description..."
              rows="4"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition duration-200 resize-none"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 text-gray-900 font-semibold bg-white border border-gray-300 rounded-[28px] hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 text-white font-semibold bg-[#DDA04E] hover:bg-orange-300 rounded-[28px] transition duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPropertyModal;

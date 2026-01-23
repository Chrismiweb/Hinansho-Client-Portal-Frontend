'use client'

import React, { useState } from 'react'
import { X, Upload, User } from 'lucide-react'

function AddTenantModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    property: '',
    unitNumber: '',
    status: 'Active',
    leaseStatus: 'Active',
    profilePhoto: null,
    photoPreview: null,
  })

  const properties = [
    { id: 1, name: 'Select property' },
    { id: 2, name: 'The Pavilion Hostel' },
    { id: 3, name: 'Green Valley Estate' },
    { id: 4, name: 'Sunrise Apartments' },
    { id: 5, name: 'Skyline Apartments' },
    { id: 6, name: 'Grandview Estates' },
  ]

  const statusOptions = ['Active', 'Expiring Soon', 'Past Tenant']
  const leaseStatusOptions = ['Active', 'Inactive', 'Pending']

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profilePhoto: file,
          photoPreview: reader.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle form submission here
    onClose()
  }

  const handleCancel = () => {
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      property: '',
      unitNumber: '',
      status: 'Active',
      leaseStatus: 'Active',
      profilePhoto: null,
      photoPreview: null,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-5000 border-b border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Tenant</h2>
            <p className="text-gray-600 text-sm mt-1">
              Register a new tenant and assign them to a property.
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
          {/* Profile Photo Upload */}
          <div className="flex flex-col items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="photoUpload"
            />
            <label
              htmlFor="photoUpload"
              className="flex flex-col items-center justify-center cursor-pointer group"
            >
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-100 to-blue-50 flex items-center justify-center mb-3 border-2 border-dashed border-blue-300 group-hover:border-blue-500 group-hover:bg-blue-100 transition duration-200">
                {formData.photoPreview ? (
                  <img
                    src={formData.photoPreview}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-blue-400" />
                )}
              </div>
              <p className="text-gray-600 text-sm font-semibold group-hover:text-blue-600 transition duration-200">
                Upload profile photo
              </p>
            </label>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="e.g. Sarah Williams"
                className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition duration-200"
              />
              <span className="absolute left-3 top-3 text-gray-400">👤</span>
            </div>
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="sarah@example.com"
                  className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition duration-200"
                />
                <span className="absolute left-3 top-3 text-gray-400">✉️</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition duration-200"
                />
                <span className="absolute left-3 top-3 text-gray-400">📞</span>
              </div>
            </div>
          </div>

          {/* Property and Unit Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Property
              </label>
              <div className="relative">
                <select
                  name="property"
                  value={formData.property}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition duration-200 appearance-none cursor-pointer"
                >
                  {properties.map((prop) => (
                    <option key={prop.id} value={prop.name}>
                      {prop.name}
                    </option>
                  ))}
                </select>
                <span className="absolute left-3 top-3 text-gray-400">🏢</span>
                <span className="absolute right-3 top-3 text-gray-400 pointer-events-none">▼</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Unit Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="unitNumber"
                  value={formData.unitNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. 304"
                  className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition duration-200"
                />
                <span className="absolute left-3 top-3 text-gray-400">🚪</span>
              </div>
            </div>
          </div>

          {/* Status and Lease Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <span className="absolute left-3 top-3 text-gray-400">📊</span>
                <span className="absolute right-3 top-3 text-gray-400 pointer-events-none">▼</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Lease Status
              </label>
              <div className="relative">
                <select
                  name="leaseStatus"
                  value={formData.leaseStatus}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition duration-200 appearance-none cursor-pointer"
                >
                  {leaseStatusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <span className="absolute left-3 top-3 text-gray-400">📋</span>
                <span className="absolute right-3 top-3 text-gray-400 pointer-events-none">▼</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 text-gray-900 font-semibold bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 text-white font-semibold bg-[#DDA04E] hover:bg-orange-300 rounded-[28px] transition duration-200"
            >
              Add Tenant
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTenantModal

'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'

function AddUnitModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    unitNumber: '',
    bedrooms: '1',
    bathrooms: '1',
    sizeSquareFt: '',
    monthlyRent: '',
    initialStatus: 'Vacant',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    onClose()
  }

  const handleCancel = () => {
    setFormData({
      unitNumber: '',
      bedrooms: '1',
      bathrooms: '1',
      sizeSquareFt: '',
      monthlyRent: '',
      initialStatus: 'Vacant',
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-5000 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Unit</h2>
            <p className="text-gray-600 text-sm mt-1">
              Enter the details for the new unit.
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
          {/* Unit Number */}
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
                placeholder="e.g. 101, 2B, PH"
                className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition duration-200"
              />
              <span className="absolute left-3 top-3 text-gray-400">#</span>
            </div>
          </div>

          {/* Bedrooms and Bathrooms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Bedrooms
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="bedrooms"
                  min="0"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition duration-200"
                />
                <span className="absolute left-3 top-3 text-gray-400">🛏️</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Bathrooms
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="bathrooms"
                  min="0"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition duration-200"
                />
                <span className="absolute left-3 top-3 text-gray-400">🚿</span>
              </div>
            </div>
          </div>

          {/* Size and Monthly Rent */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Size (Sq Ft)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="sizeSquareFt"
                  value={formData.sizeSquareFt}
                  onChange={handleInputChange}
                  placeholder="750"
                  className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition duration-200"
                />
                <span className="absolute left-3 top-3 text-gray-400">📐</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Monthly Rent
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="monthlyRent"
                  value={formData.monthlyRent}
                  onChange={handleInputChange}
                  placeholder="1200"
                  className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition duration-200"
                />
                <span className="absolute left-3 top-3 text-gray-400">$</span>
              </div>
            </div>
          </div>

          {/* Initial Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Initial Status
            </label>
            <div className="relative">
              <select
                name="initialStatus"
                value={formData.initialStatus}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition duration-200 appearance-none cursor-pointer"
              >
                <option value="Vacant">Vacant</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
              <span className="absolute left-3 top-3 text-gray-400">📋</span>
              <span className="absolute right-3 top-3 text-gray-400 pointer-events-none">▼</span>
            </div>
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
              Create Unit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddUnitModal

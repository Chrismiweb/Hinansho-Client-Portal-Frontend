'use client'

import React, { useState, useRef } from 'react'
import { getAuthToken } from '@/lib/authStorage'
import { BASE_URL } from '@/lib/apiClient'

const INITIAL_FORM = {
  propertyName: '',
  location: '',
  propertyType: 'Apartment',
  status: 'Active',
  totalUnits: '',
  amount: '',
  description: '',
  images: [],        // array of File objects
  imagePreviews: [], // array of base64 preview URLs
}

const MAX_IMAGES = 5

// ── Icons ─────────────────────────────────────────────────────────────────────
function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-gray-400" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  )
}
function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-gray-400" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  )
}
function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-gray-400" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  )
}
function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-gray-400" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  )
}
function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-gray-400" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  )
}
function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-gray-400" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
}
function DollarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-gray-400" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
function ChevronDown() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-gray-400 pointer-events-none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────
function AddPropertyModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // ── Handle new image files selected ────────────────────────────────────────
  const handleImageUpload = (e) => {
    const newFiles = Array.from(e.target.files || [])
    if (!newFiles.length) return

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const totalAfter = formData.images.length + newFiles.length

    if (totalAfter > MAX_IMAGES) {
      setError(`You can upload a maximum of ${MAX_IMAGES} images.`)
      return
    }

    for (const file of newFiles) {
      if (!allowed.includes(file.type)) {
        setError(`"${file.name}" is not allowed. Only JPG, PNG, GIF or WebP.`)
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setError(`"${file.name}" exceeds the 10MB size limit.`)
        return
      }
    }

    setError(null)

    // Read all files as base64 previews
    newFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, file],
          imagePreviews: [...prev.imagePreviews, reader.result],
        }))
      }
      reader.readAsDataURL(file)
    })

    // Reset the input so picking the same file again triggers onChange
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ── Remove a single image by index ─────────────────────────────────────────
  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
    }))
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!formData.propertyName.trim()) return setError('Property name is required.')
    if (!formData.location.trim()) return setError('Location is required.')
    if (formData.images.length === 0) return setError('Please upload at least one property image.')

    const token = getAuthToken()
    if (!token) return setError('You are not logged in. Please sign in again.')

    setLoading(true)
    try {
      const payload = new FormData()
      payload.append('name', formData.propertyName.trim())
      payload.append('property_type', formData.propertyType.toLowerCase())
      payload.append('location', formData.location.trim())
      payload.append('status', formData.status.toLowerCase())
      payload.append('totalUnits', formData.totalUnits || '0')
      payload.append('expected_roi', '0')
      payload.append('amount', String(formData.amount || '0').replace(/,/g, ''))
      payload.append('description', formData.description.trim())

      // Append all images under the same field name "images"
      formData.images.forEach((file) => {
        payload.append('images', file)
      })

      const res = await fetch(`${BASE_URL}/admin/add-properties`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message || `Failed to add property (${res.status})`)

      setFormData(INITIAL_FORM)
      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create property. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData(INITIAL_FORM)
    setError(null)
    onClose()
  }

  if (!isOpen) return null

  const inputClass = "w-full pl-9 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#DDA04E] focus:bg-white transition"
  const selectClass = "w-full pl-9 pr-8 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#DDA04E] focus:bg-white transition appearance-none cursor-pointer"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5"

  const canAddMore = formData.images.length < MAX_IMAGES

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 pt-5 pb-4 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h2 className="text-[17px] font-bold text-gray-900">Add New Property</h2>
            <p className="text-gray-400 text-[13px] mt-0.5">
              Enter the details of the new real estate asset to add to your portfolio.
            </p>
          </div>
          <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 transition mt-0.5 p-1">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* ── Image Upload ─────────────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelClass.replace('mb-1.5', '')}>
                Property Images
              </label>
              <span className="text-[11px] text-gray-400">
                {formData.images.length}/{MAX_IMAGES} uploaded
              </span>
            </div>

            {/* Hidden file input — allows multiple */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="propertyImageUpload"
            />

            {/* Upload zone — shown when no images yet */}
            {formData.imagePreviews.length === 0 && (
              <label
                htmlFor="propertyImageUpload"
                className="flex flex-col items-center justify-center w-full py-8 border-2 border-dashed border-[#E2E8F0] rounded-xl cursor-pointer hover:border-[#DDA04E] hover:bg-orange-50/40 transition bg-[#F8FAFC]"
              >
                <div className="w-10 h-10 rounded-full bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center mb-3">
                  <UploadIcon />
                </div>
                <p className="text-[13px] font-medium text-gray-700">Click to upload images</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  JPG, PNG, GIF or WebP — up to {MAX_IMAGES} images, 10MB each
                </p>
              </label>
            )}

            {/* Image previews grid */}
            {formData.imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {formData.imagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#E2E8F0] flex-shrink-0 group"
                  >
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-5 h-5 bg-gray-900/70 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                    {/* Index badge */}
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 text-[9px] bg-[#DDA04E] text-white px-1.5 py-0.5 rounded-full font-semibold">
                        Main
                      </span>
                    )}
                  </div>
                ))}

                {/* Add more button — shown until max reached */}
                {canAddMore && (
                  <label
                    htmlFor="propertyImageUpload"
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-[#E2E8F0] flex flex-col items-center justify-center cursor-pointer hover:border-[#DDA04E] hover:bg-orange-50/30 transition flex-shrink-0 bg-[#F8FAFC]"
                  >
                    <span className="text-2xl text-gray-400 leading-none">+</span>
                    <span className="text-[9px] text-gray-400 mt-0.5">Add more</span>
                  </label>
                )}
              </div>
            )}

            {formData.images.length > 0 && (
              <p className="text-[11px] text-gray-400 mt-2">
                💡 First image is used as the main display image. Hover to remove.
              </p>
            )}
          </div>

          {/* Property Name */}
          <div>
            <label className={labelClass}>Property Name</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2"><HomeIcon /></span>
              <input
                type="text"
                name="propertyName"
                value={formData.propertyName}
                onChange={handleInputChange}
                placeholder="e.g. The Pavilion Hostel"
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className={labelClass}>Location</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2"><LocationIcon /></span>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g. University District, Zone A"
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Property Type + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Property Type</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2"><BuildingIcon /></span>
                <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} className={selectClass}>
                  <option value="Apartment">Apartment</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Land">Land</option>
                  <option value="Farm">Farm</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2"><ChevronDown /></span>
              </div>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2"><CalendarIcon /></span>
                <select name="status" value={formData.status} onChange={handleInputChange} className={selectClass}>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Under Construction">Under Construction</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2"><ChevronDown /></span>
              </div>
            </div>
          </div>

          {/* Total Units + Amount */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Total Units</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2"><UsersIcon /></span>
                <input type="number" name="totalUnits" value={formData.totalUnits} onChange={handleInputChange} placeholder="0" min="0" className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Amount (₦)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2"><DollarIcon /></span>
                <input
                  type="text"
                  inputMode="numeric"
                  name="amount"
                  value={formData.amount}
                  onChange={(e) => {
                    // Only allow digits and single decimal point
                    const val = e.target.value.replace(/[^0-9.]/g, '')
                    setFormData(prev => ({ ...prev, amount: val }))
                  }}
                  placeholder="0"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter property description..."
              rows={3}
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#DDA04E] focus:bg-white transition resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1 pb-1">
            <button type="button" onClick={handleCancel} disabled={loading}
              className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-[#E2E8F0] rounded-lg hover:bg-gray-50 transition disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#DDA04E] hover:bg-[#C68E3D] rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Adding...' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddPropertyModal

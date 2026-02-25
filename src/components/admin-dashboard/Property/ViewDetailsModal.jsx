'use client'

import React from 'react'
import { X } from 'lucide-react'

function ViewDetailsModal({ isOpen, onClose, property, onEditClick }) {
  if (!isOpen || !property) return null

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header with Image */}
        <div className="relative">
          <img
            src={property.image}
            alt={property.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-900 rounded-full p-2 transition duration-200"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-2xl font-bold">{property.name}</h2>
            <p className="text-white/80 flex items-center gap-1 mt-1">
              📍 {property.location}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider">
                Type
              </p>
              <p className="text-gray-900 font-bold text-sm mt-2">{property.type}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider">
                Units
              </p>
              <p className="text-gray-900 font-bold text-sm mt-2">
                {property.units?.match(/\d+/)?.[0] || '0'}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider">
                ROI
              </p>
              <p className="text-orange-600 font-bold text-sm mt-2">{property.roi}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider">
                Occupancy
              </p>
              <p className="text-gray-900 font-bold text-sm mt-2">{property.occupancy}</p>
            </div>
          </div>

          {/* Project Progress */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-900">Project Progress</h3>
              <span className="text-sm font-semibold text-gray-600">100% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-gray-900 h-3 rounded-full transition-all duration-300" style={{ width: '100%' }}></div>
            </div>
          </div>

          {/* Property Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Property Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              No description available for this property. Please edit the property details to add a description about the amenities, location benefits, and investment potential.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end w-full gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 w-fit text-gray-700 font-semibold bg-gray-100 hover:bg-gray-200 rounded-[28px] transition duration-200"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose()
                onEditClick()
              }}
              className="flex-1 px-4 py-3 w-fit text-white font-semibold bg-[#DDA04E] hover:bg-orange-300 rounded-[28px] transition duration-200"
            >
              Edit Property
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewDetailsModal

'use client'

import React, { useState } from 'react'
import { X, Plus, Search, MoreVertical } from 'lucide-react'
import AddUnitModal from './AddUnitModal'

function ManageUnitsModal({ isOpen, onClose, property }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false)

  const units = [
    { id: 101, status: 'Occupied', tenant: 'John Doe', rent: '$1,546', details: '2bd 1ba + 802 sqft' },
    { id: 102, status: 'Occupied', tenant: 'John Doe', rent: '$1,677', details: '1bd 1ba + 1232 sqft' },
    { id: 103, status: 'Vacant', tenant: 'Unassigned', rent: '$1,647', details: '1bd 1ba + 1154 sqft' },
    { id: 104, status: 'Occupied', tenant: 'John Doe', rent: '$1,352', details: '1bd 1ba + 985 sqft' },
    { id: 105, status: 'Occupied', tenant: 'John Doe', rent: '$1,684', details: '1bd 1ba + 800 sqft' },
    { id: 106, status: 'Vacant', tenant: 'Unassigned', rent: '$1,308', details: '2bd 1ba + 867 sqft' },
    { id: 107, status: 'Occupied', tenant: 'John Doe', rent: '$1,588', details: '1bd 1ba + 1173 sqft' },
    { id: 108, status: 'Vacant', tenant: 'Unassigned', rent: '$1,564', details: '1bd 1ba + 1134 sqft' },
    { id: 109, status: 'Occupied', tenant: 'John Doe', rent: '$1,354', details: '1bd 1ba + 1199 sqft' },
    { id: 110, status: 'Vacant', tenant: 'Unassigned', rent: '$1,586', details: '2bd 1ba + 1180 sqft' },
    { id: 111, status: 'Occupied', tenant: 'John Doe', rent: '$1,471', details: '1bd 1ba + 979 sqft' },
    { id: 112, status: 'Vacant', tenant: 'Unassigned', rent: '$1,312', details: '1bd 1ba + 1130 sqft' },
    { id: 113, status: 'Occupied', tenant: 'John Doe', rent: '$1,630', details: '1bd 1ba + 1092 sqft' },
    { id: 114, status: 'Occupied', tenant: 'John Doe', rent: '$1,231', details: '1bd 1ba + 943 sqft' },
    { id: 115, status: 'Occupied', tenant: 'John Doe', rent: '$1,627', details: '1bd 1ba + 939 sqft' },
    { id: 116, status: 'Vacant', tenant: 'Unassigned', rent: '$1,394', details: '2bd 1ba + 1229 sqft' },
    { id: 117, status: 'Occupied', tenant: 'John Doe', rent: '$1,494', details: '1bd 1ba + 889 sqft' },
    { id: 118, status: 'Vacant', tenant: 'Unassigned', rent: '$1,697', details: '1bd 1ba + 913 sqft' },
    { id: 119, status: 'Occupied', tenant: 'John Doe', rent: '$1,512', details: '1bd 1ba + 1098 sqft' },
    { id: 120, status: 'Vacant', tenant: 'Unassigned', rent: '$1,289', details: '1bd 1ba + 848 sqft' },
  ]

  const filteredUnits = units.filter((unit) =>
    unit.id.toString().includes(searchTerm) ||
    unit.tenant.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    return status === 'Occupied'
      ? 'text-green-600 bg-green-50'
      : 'text-orange-600 bg-orange-50'
  }

  if (!isOpen || !property) return null

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-4000 border-b border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manage Units</h2>
            <p className="text-gray-600 text-sm mt-1">
              {property.name} • {property.location}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Search and Add Button */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by unit number or tenant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition duration-200"
              />
            </div>
            <button
              onClick={() => setIsAddUnitModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-[28px] bg-[#DDA04E] hover:bg-orange-300 text-white font-semibold transition duration-200"
            >
              <Plus className="w-5 h-5" />
              Add Unit
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="text-left py-4 px-4 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-4 px-4 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                    Tenant
                  </th>
                  <th className="text-left py-4 px-4 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                    Rent
                  </th>
                  <th className="text-left py-4 px-4 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                    Details
                  </th>
                  <th className="text-left py-4 px-4 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUnits.map((unit) => (
                  <tr
                    key={unit.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition duration-200"
                  >
                    <td className="py-4 px-4">
                      <span className="text-gray-900 font-semibold">{unit.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          unit.status
                        )}`}
                      >
                        {unit.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {unit.status === 'Occupied' ? (
                          <>
                            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                              <span className="text-blue-600 text-xs font-semibold">
                                {unit.tenant.charAt(0)}
                              </span>
                            </div>
                            <span className="text-gray-900 font-medium text-sm">
                              {unit.tenant}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-500 text-sm">{unit.tenant}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900 font-semibold">{unit.rent}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600 text-sm">{unit.details}</span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="p-2 hover:bg-gray-200 rounded-lg transition duration-200 text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Info */}
          <div className="flex justify-between items-center text-sm text-gray-600 pt-4 border-t border-gray-200">
            <span>Showing {filteredUnits.length} units</span>
            <span>Total Capacity: 50 Units</span>
          </div>
        </div>
      </div>

      <AddUnitModal isOpen={isAddUnitModalOpen} onClose={() => setIsAddUnitModalOpen(false)} />
    </div>
  )
}

export default ManageUnitsModal

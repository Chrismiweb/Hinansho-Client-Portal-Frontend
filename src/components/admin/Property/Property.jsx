'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Search, Filter, Edit, MoreVertical, Trash2 } from 'lucide-react'
import AddPropertyModal from '../Overview/AddPropertyModal'
import EditPropertyModal from './EditPropertyModal'
import ViewDetailsModal from './ViewDetailsModal'
import ManageUnitsModal from './ManageUnitsModal'
import { fetchProperties } from '@/lib/fetchProperties'
// import { fetchProperties, deleteProperty } from '../../../lib/api/properties'

function Property() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false)
  const [isManageUnitsModalOpen, setIsManageUnitsModalOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [activeDropdown, setActiveDropdown] = useState(null)

  const [properties, setProperties] = useState([])
  const [loadingProperties, setLoadingProperties] = useState(false)
  const [propertiesError, setPropertiesError] = useState(null)

  const stats = [
    { label: 'Total Properties', value: '3', icon: '🏢' },
    { label: 'Total Units', value: '0', icon: '🚪' },
    { label: 'Total Plots', value: '200', icon: '👥' },
    { label: 'Portfolio Value', value: '$12.5M', icon: '📈' },
  ]

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500'
      case 'completed':
        return 'bg-blue-500'
      case 'under management':
        return 'bg-orange-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getROIColor = (roi) => {
    const value = parseFloat(roi)
    if (value > 15) return 'text-green-600'
    if (value > 10) return 'text-orange-600'
    return 'text-gray-600'
  }

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      (property.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (property.location || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || property.status === statusFilter
    return matchesSearch && matchesStatus
  })


// ✅ Define load outside useEffect
const load = async () => {
  try {
    setLoadingProperties(true);
    setPropertiesError(null);
    const data = await fetchProperties();
    const list = (data || []).map((p) => ({
      id: p._id || p.id,
      name: p.name,
      location: p.location,
      image: p.images?.[0] || '',
      status: p.status || 'Active',
      type: p.name,
      roi: p.expected_roi ? `${p.expected_roi}%` : '0%',
      occupancy: p.occupancy || '0%',
      units: p.totalUnits ? `${p.totalUnits} Units` : '0 Units',
      managed: p.managed || 'Managed by Hinansho',
      raw: p,
    }));
    setProperties(list);
  } catch (err) {
    setPropertiesError(err.message || 'Failed to load properties');
  } finally {
    setLoadingProperties(false);
  }
};

// ✅ useEffect just calls it
useEffect(() => {
  load();
}, []);

  const handleDelete = async (id) => {
    const ok = confirm('Delete this property? This action cannot be undone.')
    if (!ok) return
    try {
      const token = typeof window !== 'undefined' && (localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken'))
      if (!token) {
        alert('No auth token found; please sign in.')
        return
      }
      await deleteProperty(id, token)
      setProperties((prev) => prev.filter((p) => String(p.id) !== String(id)))
    } catch (err) {
      console.error(err)
      alert(err.message || 'Failed to delete property')
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#DDA04E] hover:bg-orange-300 text-white rounded-full font-semibold transition duration-200"
        >
          <Plus className="w-5 h-5" />
          Add Property
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300"
          >
            <p className="text-gray-600 text-sm font-semibold mb-2">
              {stat.label}
            </p>
            <div className="flex items-end gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white rounded-2xl p-6 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition duration-200"
          />
        </div>
        
        <div className="flex items-center gap-3 md:ml-auto">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition duration-200">
            <Filter className="w-5 h-5" />
            Filter
          </button>

          <span className="text-gray-600 text-sm font-semibold">Status:</span>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer text-gray-700 font-semibold transition duration-200 pr-8"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Under Management">Under Management</option>
            </select>
            <span className="absolute right-3 top-2.5 pointer-events-none text-gray-400">▼</span>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300"
          >
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden bg-gray-200">
              <img
                src={property.image}
                alt={property.name}
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent flex flex-col justify-between p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-bold text-lg">
                      {property.name}
                    </h3>
                    <p className="text-white/80 text-sm flex items-center gap-1 mt-1">
                      📍 {property.location}
                    </p>
                  </div>
                  <span
                    className={`${getStatusColor(
                      property.status
                    )} text-white text-xs font-bold px-3 py-1 rounded-full`}
                  >
                    {property.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Type and ROI */}
              <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                    Type
                  </p>
                  <p className="text-gray-900 font-bold text-sm mt-1">
                    {property.type}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                    ROI
                  </p>
                  <p className={`font-bold text-sm mt-1 ${getROIColor(property.roi)}`}>
                    {property.roi}
                  </p>
                </div>
              </div>

              {/* Occupancy */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 text-sm font-semibold">
                    Occupancy
                  </span>
                  <span className="text-gray-900 font-bold text-sm">
                    {property.occupancy}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: property.occupancy.replace('%', ''),
                    }}
                  ></div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-6 pb-6 border-b border-gray-200">
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold">{property.units}</span>
                </p>
                <p className="text-gray-500 text-sm">{property.managed}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedProperty(property)
                    setIsEditModalOpen(true)
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-semibold transition duration-200 border border-gray-200"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === property.id ? null : property.id
                      )
                    }
                    className="px-3 py-2 hover:bg-gray-100 border border-gray-200 rounded-lg transition duration-200 text-gray-600"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {/* Dropdown Menu */}
                  {activeDropdown === property.id && (
                    <div className="absolute right-0 -top-40 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => {
                          setSelectedProperty(property)
                          setIsViewDetailsModalOpen(true)
                          setActiveDropdown(null)
                        }}
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 font-semibold border-b border-gray-100 transition duration-200"
                      >
                        👁️ View Details
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProperty(property)
                          setIsManageUnitsModalOpen(true)
                          setActiveDropdown(null)
                        }}
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 font-semibold border-b border-gray-100 transition duration-200"
                      >
                        🚪 Manage Units
                      </button>
                      <button
                        onClick={() => {
                          setActiveDropdown(null)
                          handleDelete(property.id)
                        }}
                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-semibold transition duration-200"
                      >
                        🗑️ Delete Property
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No properties found</p>
        </div>
      )}

      <AddPropertyModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      {/* <EditPropertyModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} property={selectedProperty} /> */}
        <EditPropertyModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          property={selectedProperty}
          // onUpdated={() => load()} // ← add this to refetch properties after edit
          onUpdated={load}
        />
      <ViewDetailsModal
        isOpen={isViewDetailsModalOpen}
        onClose={() => setIsViewDetailsModalOpen(false)}
        property={selectedProperty}
        onEditClick={() => {
          setIsViewDetailsModalOpen(false)
          setIsEditModalOpen(true)
        }}
      />
      <ManageUnitsModal isOpen={isManageUnitsModalOpen} onClose={() => setIsManageUnitsModalOpen(false)} property={selectedProperty} />
    </div>
  )
}

export default Property
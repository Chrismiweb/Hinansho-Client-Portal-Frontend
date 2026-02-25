"use client";

import { useState } from "react";
import { Camera } from "lucide-react";

export default function Profile() {
  const [profileData, setProfileData] = useState({
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 000-0000",
    bio: "",
  });

  const [formData, setFormData] = useState(profileData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveChanges = () => {
    setProfileData(formData);
  };

  return (
    <div className=" bg-gray-50">
      <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT PROFILE CARD */}
        <div className="bg-white rounded-[28px] h-fit pb-20 shadow-lg flex flex-col items-center">
          <div className="relative w-full h-40 bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-t-[28px] mb-12"></div>
          <div className="-mt-20 relative">
            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-md">
              <div className="w-24 h-24 bg-[#0f172a] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                {profileData.firstName[0]}
                {profileData.lastName[0]}
              </div>
            </div>
            <button className="absolute bottom-2 right-2 bg-orange-500 p-2 rounded-full text-white shadow">
              <Camera size={16} />
            </button>
          </div>

          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            {profileData.firstName} {profileData.lastName}
          </h2>
          <p className="text-gray-500 text-sm">Real Estate Investor</p>

          <div className="flex gap-3 mt-6">
            <button className="px-5 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              Remove
            </button>
            <button className="px-5 py-2 bg-[#0f172a] text-white rounded-lg text-sm hover:bg-[#1e293b]">
              Change Photo
            </button>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="md:col-span-2 bg-white rounded-[28px] p-8 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900">
            Personal Information
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Update your personal details and public profile.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="text-sm text-gray-600">First Name</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full mt-1 px-4 h-12 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#0f172a] outline-none bg-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Last Name</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full mt-1 px-4 h-12 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#0f172a] outline-none bg-[#F8FAFC]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="text-sm text-gray-600">Email Address</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full mt-1 px-4 h-12 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#0f172a] outline-none bg-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Phone Number</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full mt-1 px-4 h-12 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#0f172a] outline-none bg-[#F8FAFC]"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="text-sm text-gray-600">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="7"
              placeholder="Tell us a little about yourself"
              className="w-full mt-1 px-4 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#0f172a] outline-none bg-[#F8FAFC]"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveChanges}
              className="px-6 py-2 bg-[#0f172a] text-white rounded-lg hover:bg-[#1e293b]"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

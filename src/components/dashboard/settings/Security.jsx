"use client";
import { Lock } from "lucide-react";
import React, { useState } from "react";

export default function Security() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordsMatch = newPassword && newPassword === confirmPassword;

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!passwordsMatch) {
      alert("New passwords do not match.");
      return;
    }
    // TODO: Replace with real API call
    alert("Password updated (mock)");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleDeleteAccount = () => {
    const confirmed = confirm(
      "This will permanently delete your account and all of your content. Continue?"
    );
    if (!confirmed) return;
    // TODO: Replace with real API call
    alert("Account deleted (mock)");
  };

  return (
    <div className="bg-white rounded-[28px] p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Security Settings</h2>
        <p className="text-sm text-gray-500">Manage your password and security preferences.</p>
      </div>

      <form onSubmit={handleUpdatePassword} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400"><Lock /></span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="************"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-12 py-3 bg-gray-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400"><Lock /></span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="************"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-12 py-3 bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400"><Lock /></span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="************"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-12 py-3 bg-gray-50"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <label className="flex items-center cursor-pointer">
            <div className={`w-11 h-6 flex items-center p-1 rounded-full mr-3 ${showPassword ? "bg-indigo-600" : "bg-gray-200"}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow transform ${showPassword ? "translate-x-5" : "translate-x-0"}`} />
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={showPassword}
              onChange={() => setShowPassword((s) => !s)}
            />
            <span className="text-sm text-gray-700">Show Password</span>
          </label>

          <div className="ml-auto">
            <button
              type="submit"
              disabled={!passwordsMatch || !newPassword}
              className="bg-slate-900 text-white px-6 py-2 rounded-full disabled:opacity-50"
            >
              Update Password
            </button>
          </div>
        </div>
      </form>

      <hr className="my-6 border-t border-gray-100" />

      <div>
        <h3 className="text-red-600 font-semibold">Danger Zone</h3>
        <p className="text-sm text-gray-500 mb-4">Permanently delete your account and all of your content.</p>
        <button onClick={handleDeleteAccount} className="bg-red-600 text-white px-4 py-2 rounded-full">
          Delete Account
        </button>
      </div>
    </div>
  );
}

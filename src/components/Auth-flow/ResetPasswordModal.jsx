"use client";

import React, { useState } from "react";

export default function ResetPasswordModal({ email, onClose, onSubmit }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(pwd)) return "Password must contain an uppercase letter";
    if (!/[a-z]/.test(pwd)) return "Password must contain a lowercase letter";
    if (!/[0-9]/.test(pwd)) return "Password must contain a number";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        onSubmit();
      } else {
        setError(json.message || `Failed to reset password (${res.status})`);
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[999]">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-8 md:p-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-semibold font-pop text-[#1A1A2E] mb-2">
          Reset Password
        </h2>

        {/* Description */}
        <p className="text-sm md:text-base text-gray-600 font-inter mb-6">
          Create a strong new password for your account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-[#768C9F] font-pop mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="••••••••"
                className="w-full px-4 h-12 md:h-14 border border-gray-300 rounded-lg text-sm md:text-[14px] bg-[#F3F3F5] text-[#717182] placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-[#DDA04E] focus:bg-white focus:ring-4 focus:ring-amber-100 font-inter"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.83 9L15.5 12.67c.04-.3.07-.59.07-.9 0-1.66-1.34-3-3-3-.31 0-.59.03-.89.07zM7.47 7.47c-1.88 1.88-3.07 4.47-3.07 7.33 0 5.59 4.41 10 10 10 2.86 0 5.45-1.19 7.33-3.07l2.85 2.85c.41.41 1.05.41 1.46 0 .41-.41.41-1.05 0-1.46L9.41 5.05l-.01-.01c-.41-.41-1.05-.41-1.46 0-.41.41-.41 1.05 0 1.46L7.47 7.47zM2.1 2.1c-.41.41-.41 1.05 0 1.46l2.26 2.26C2.62 7.7 1 10.63 1 14c0 5.59 4.41 10 10 10 3.37 0 6.3-1.62 8.18-4.1l2.26 2.26c.41.41 1.05.41 1.46 0 .41-.41.41-1.05 0-1.46L3.56 2.1c-.41-.41-1.05-.41-1.46 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-sm font-medium text-[#768C9F] font-pop mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                placeholder="••••••••"
                className="w-full px-4 h-12 md:h-14 border border-gray-300 rounded-lg text-sm md:text-[14px] bg-[#F3F3F5] text-[#717182] placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-[#DDA04E] focus:bg-white focus:ring-4 focus:ring-amber-100 font-inter"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.83 9L15.5 12.67c.04-.3.07-.59.07-.9 0-1.66-1.34-3-3-3-.31 0-.59.03-.89.07zM7.47 7.47c-1.88 1.88-3.07 4.47-3.07 7.33 0 5.59 4.41 10 10 10 2.86 0 5.45-1.19 7.33-3.07l2.85 2.85c.41.41 1.05.41 1.46 0 .41-.41.41-1.05 0-1.46L9.41 5.05l-.01-.01c-.41-.41-1.05-.41-1.46 0-.41.41-.41 1.05 0 1.46L7.47 7.47zM2.1 2.1c-.41.41-.41 1.05 0 1.46l2.26 2.26C2.62 7.7 1 10.63 1 14c0 5.59 4.41 10 10 10 3.37 0 6.3-1.62 8.18-4.1l2.26 2.26c.41.41 1.05.41 1.46 0 .41-.41.41-1.05 0-1.46L3.56 2.1c-.41-.41-1.05-.41-1.46 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs md:text-sm font-inter">
              {error}
            </p>
          )}



          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 md:h-14 bg-[#DDA04E] hover:bg-[#C68E3D] disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer text-white font-semibold text-sm md:text-base rounded-lg transition-all duration-300 hover:shadow-lg active:translate-y-0 mt-6 font-pop"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          {/* Back to Login */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 text-center text-[#768C9F] font-medium text-sm md:text-base hover:text-[#1A1A2E] transition-colors font-pop"
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}

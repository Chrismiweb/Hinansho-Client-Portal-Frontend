"use client";

import React, { useState } from "react";

export default function ForgotPasswordModal({ onClose, onSubmit }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        onSubmit(email);
      } else {
        setError(json.message || `Failed to send reset email (${res.status})`);
      }
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.');
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
          Forgot Password?
        </h2>

        {/* Description */}
        <p className="text-sm md:text-base text-gray-600 font-inter mb-6">
          Enter your email address and we&apos;ll send you a code to reset your
          password.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-[#768C9F] font-pop mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="johndoe@gmail.com"
              className="w-full px-4 h-12 md:h-14 border border-gray-300 rounded-lg text-sm md:text-[14px] bg-[#F3F3F5] text-[#717182] placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-[#DDA04E] focus:bg-white focus:ring-4 focus:ring-amber-100 font-inter"
            />
            {error && (
              <p className="text-red-500 text-xs md:text-sm font-inter mt-2">
                {error}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 md:h-14 bg-[#DDA04E] hover:bg-[#C68E3D] disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer text-white font-semibold text-sm md:text-base rounded-lg transition-all duration-300 hover:shadow-lg active:translate-y-0 mt-6 font-pop"
          >
            {loading ? "Sending..." : "Send Reset Code"}
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

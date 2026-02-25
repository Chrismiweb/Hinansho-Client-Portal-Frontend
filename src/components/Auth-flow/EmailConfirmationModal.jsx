"use client";

import React, { useState, useEffect } from "react";

export default function EmailConfirmationModal({ email, onClose, onSubmit }) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (index, value) => {
    const numValue = value.replace(/[^0-9]/g, "");
    if (numValue.length > 1) return;

    const newCode = [...code];
    newCode[index] = numValue;
    setCode(newCode);
    setError("");

    // Auto-focus next input
    if (numValue && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join("");

    if (fullCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: fullCode }),
      });

      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        console.log('OTP verification successful:', json);
        onSubmit();
      } else {
        setError(json.message || `Verification failed (${res.status})`);
      }
    } catch (err) {
      setError(err.message || 'Invalid code. Please try again.');
      console.error('OTP verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setTimeLeft(300); // Reset timer to 5 minutes
        setError('');
        console.log('OTP resent successfully');
      } else {
        setError(json.message || `Failed to resend (${res.status})`);
      }
    } catch (err) {
      setError(err.message || 'Failed to resend code. Please try again.');
      console.error('Resend OTP error:', err);
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
          Verify Your Email
        </h2>

        {/* Description */}
        <p className="text-sm md:text-base text-gray-600 font-inter mb-2">
          We&apos;ve sent a 6-digit code to <br />
          <span className="font-semibold text-[#1A1A2E]">{email}</span>
        </p>

        {/* Time Left */}
        <p className="text-xs md:text-sm text-[#DDA04E] font-semibold font-pop mb-6">
          Code expires in: {formatTime(timeLeft)}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Code Input */}
          <div className="flex gap-2 md:gap-3 justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-input-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength="1"
                placeholder="0"
                className="w-12 h-12 md:w-14 md:h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg bg-[#F3F3F5] text-[#717182] transition-all duration-300 focus:outline-none focus:border-[#DDA04E] focus:bg-white focus:ring-4 focus:ring-amber-100 font-pop"
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-xs md:text-sm font-inter text-center">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 md:h-14 bg-[#DDA04E] hover:bg-[#C68E3D] disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer text-white font-semibold text-sm md:text-base rounded-lg transition-all duration-300 hover:shadow-lg active:translate-y-0 mt-6 font-pop"
          >
            {loading ? "Verifying..." : "Confirm Code"}
          </button>

          {/* Resend Code */}
          <button
            type="button"
            onClick={handleResendCode}
            disabled={loading || timeLeft > 240}
            className="w-full py-3 text-center text-[#768C9F] font-medium text-sm md:text-base hover:text-[#1A1A2E] transition-colors font-pop disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Didn&apos;t receive the code? Resend
          </button>
        </form>
      </div>
    </div>
  );
}

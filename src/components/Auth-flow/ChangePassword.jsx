"use client";

import React, { useState, useEffect } from "react";

const slides = [
  {
    id: 1,
    image: "/assets/slide1.png",
    title: "Transparency & Trust",
    description:
      "Your investments, clearly tracked. Welcome to full financial transparency.",
  },
  {
    id: 2,
    image: "/assets/slide2.png",
    title: "Seamless Communication",
    description:
      "Stay connected with tenants, landlords, and admins all in one place.",
  },
  {
    id: 3,
    image: "/assets/slide3.png",
    title: "Real-Time Updates",
    description:
      "Get notified on rent, expenses, and project milestones as they happen.",
  },
];

function ChangePassword() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Slider auto change
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://hinansho-client-portal-backend.onrender.com/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );

      if (res.ok) {
        alert("Password changed successfully.");
        window.location.href = "/dahboard";
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Failed to change password.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen relative bg-white">
      {/* Logo */}
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6 lg:right-10 lg:top-10 z-50">
        <img
          src="/assets/logo.png"
          alt="Logo"
          className="w-8 h-8 sm:w-10 sm:h-10"
        />
      </div>

      {/* Left Side - Slider */}
      <div className="hidden sm:flex w-full lg:flex-1 h-64 sm:h-96 lg:h-screen relative overflow-hidden bg-gray-100 order-2 lg:order-1">
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute w-full h-full transition-opacity duration-800 ease-in-out flex items-end justify-start ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/0 z-10"></div>

              <div className="relative z-20 text-white p-8 lg:p-10">
                <h2 className="text-2xl lg:text-[32px] font-semibold mb-4 font-pop">
                  {slide.title}
                </h2>
                <p className="text-base opacity-95 font-inter">
                  {slide.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-5 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-md border-2 transition-all duration-300 ${
                index === currentSlide
                  ? "bg-[#DDA04E] border-[#DDA04E] w-[50px]"
                  : "w-3 border-white/50"
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:flex-1 flex flex-col justify-center items-center p-6 lg:p-10 bg-white order-1 lg:order-2">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-medium text-[#F4D09F] mb-6">
            Change Your Password
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-base text-[#768C9F] mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 sm:px-4 h-12 sm:h-14 border border-gray-300 rounded-lg text-sm sm:text-[14px] bg-[#F3F3F5] text-[#717182] placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-[#DDA04E] focus:bg-white focus:ring-4 focus:ring-amber-100 font-inter"

                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-base text-[#768C9F] mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                // className="w-12 h-12 md:w-14 md:h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg bg-[#F3F3F5] text-[#717182] transition-all duration-300 focus:outline-none focus:border-[#DDA04E] focus:bg-white focus:ring-4 focus:ring-amber-100 font-pop"
                className="w-full px-3 sm:px-4 h-12 sm:h-14 border border-gray-300 rounded-lg text-sm sm:text-[14px] bg-[#F3F3F5] text-[#717182] placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-[#DDA04E] focus:bg-white focus:ring-4 focus:ring-amber-100 font-inter"


                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-base text-[#768C9F] mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                // className="w-12 h-12 md:w-14 md:h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg bg-[#F3F3F5] text-[#717182] transition-all duration-300 focus:outline-none focus:border-[#DDA04E] focus:bg-white focus:ring-4 focus:ring-amber-100 font-pop"
                className="w-full px-3 sm:px-4 h-12 sm:h-14 border border-gray-300 rounded-lg text-sm sm:text-[14px] bg-[#F3F3F5] text-[#717182] placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-[#DDA04E] focus:bg-white focus:ring-4 focus:ring-amber-100 font-inter"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 sm:h-[64px] bg-[#DDA04E] hover:bg-[#C68E3D] disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer text-white font-semibold text-sm sm:text-base rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 mb-3 sm:mb-4 font-pop"

            >
              {loading ? "Changing Password..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
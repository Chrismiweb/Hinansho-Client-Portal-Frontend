"use client";

import React, { useState, useEffect } from "react";
// Directly call /api/auth/register from this component
import EmailConfirmationModal from "./EmailConfirmationModal";

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

function Register() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const registrationData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "Tenant", // Default role, can be changed based on UI
      };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok) {
        // Store email for confirmation and show modal
        setRegisteredEmail(formData.email);
        setShowEmailConfirmation(true);
        console.log('Registration successful:', json);
      } else {
        throw Object.assign(new Error(json.message || `HTTP ${res.status}`), { data: json, status: res.status });
      }
    } catch (err) {
      setError(err.data?.message || err.message || "Registration failed. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailConfirmationClose = () => {
    setShowEmailConfirmation(false);
  };

  const handleEmailConfirmationSuccess = () => {
    setShowEmailConfirmation(false);
    // Redirect to login or dashboard
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen relative bg-white">
      {/* Logo */}
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6 lg:right-10 lg:top-10 z-50">
        <img src="/assets/logo.png" alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
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
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/0 z-10"></div>

              {/* Slide Content */}
              <div className="relative z-20 text-white p-4 sm:p-8 lg:p-10 lg:max-w-4xl">
                <h2 className="text-xl sm:text-2xl lg:text-[32px] font-semibold mb-2 sm:mb-4 leading-tight font-pop">
                  {slide.title}
                </h2>
                <p className="text-sm sm:text-base lg:text-[16px] font-normal mb-10 leading-snug opacity-95 font-inter">
                  {slide.description}
                </p>
              </div>
            </div>
          ))}
        </div>



        {/* Slide Indicators */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-5 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 sm:h-3 rounded-md border-2 transition-all duration-300 ${
                index === currentSlide
                  ? "bg-[#DDA04E] border-[#DDA04E] w-8 sm:w-[50px] scale-100"
                  : "w-2 sm:w-3 border-white/50 hover:border-white"
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:flex-1 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 lg:p-10 bg-white overflow-y-auto order-1 lg:order-2">
        <div className="w-full max-w-md">
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-medium font-pop text-[#F4D09F] text-start mb-2 sm:mb-3">
            Create an account
          </h2>

          {/* Login Link */}
          <p className="text-start text-sm sm:text-base lg:text-[16px] text-[#768C9F] font-medium font-pop mb-6 sm:mb-8 lg:mb-[42px]">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#F4D09F] font-semibold hover:underline"
            >
              Log in
            </a>
          </p>

          {/* Form */}
          <form className="w-full" onSubmit={handleRegisterSubmit}>
            {/* Username Field */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm sm:text-base lg:text-[16px] text-[#768C9F] font-medium font-pop mb-2">
                User name
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="name@example.com"
                className="w-full px-3 sm:px-4 h-12 sm:h-14 border border-gray-300 rounded-lg text-sm sm:text-[14px] bg-[#F3F3F5] text-[#717182] placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-[#DDA04E] focus:bg-white focus:ring-4 focus:ring-amber-100 font-inter"
                required
              />
            </div>

            {/* Email Field */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm sm:text-base lg:text-[16px] text-[#768C9F] font-medium font-pop mb-2">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="johndoe@gmail.com"
                className="w-full px-3 sm:px-4 h-12 sm:h-14 border border-gray-300 rounded-lg text-sm sm:text-[14px] bg-[#F3F3F5] text-[#717182] placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-[#DDA04E] focus:bg-white focus:ring-4 focus:ring-amber-100 font-inter"
                required
              />
            </div>

            {/* Password Field */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm sm:text-base lg:text-[16px] text-[#768C9F] font-medium font-pop mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-3 sm:px-4 h-12 sm:h-14 border border-gray-300 rounded-lg text-sm sm:text-[14px] bg-[#F3F3F5] text-[#717182] placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-[#DDA04E] focus:bg-white focus:ring-4 focus:ring-amber-100 font-inter"
                required
              />
              <small className="block text-xs sm:text-[14px] text-[#768C9F] font-medium font-pop mt-2 sm:mt-3">
                Use 8 or more characters with a mix of letters, numbers &
                symbols
              </small>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs sm:text-sm text-red-600 font-inter">{error}</p>
              </div>
            )}

            {/* Terms Section */}
            <div className="mb-4 sm:mb-6 text-start">
              <p className="text-xs sm:text-[14px] text-[#768C9F] font-medium font-pop leading-relaxed">
                By creating an account, you agree to our{" "}
                <a
                  href="/terms"
                  className="text-[#F4D09F] font-medium hover:underline"
                >
                  Terms of use
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="text-[#F4D09F] font-medium hover:underline"
                >
                  Privacy Policy
                </a>
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 sm:h-[64px] bg-[#DDA04E] hover:bg-[#C68E3D] disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer text-white font-semibold text-sm sm:text-base rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 mb-3 sm:mb-4 font-pop"
            >
              {loading ? "Creating account..." : "Create an account"}
            </button>

            {/* Login Link Bottom */}
            <p className="text-start text-xs sm:text-sm text-gray-600 font-inter">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-[#F4D09F] font-semibold hover:underline"
              >
                Log in
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Email Confirmation Modal */}
      {showEmailConfirmation && (
        <EmailConfirmationModal
          email={registeredEmail}
          onClose={handleEmailConfirmationClose}
          onSubmit={handleEmailConfirmationSuccess}
        />
      )}
    </div>
  );
}

export default Register;

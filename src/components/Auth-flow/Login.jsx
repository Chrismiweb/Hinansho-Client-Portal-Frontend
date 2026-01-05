"use client";

import React, { useState, useEffect } from "react";
import ForgotPasswordModal from "./ForgotPasswordModal";
import EmailConfirmationModal from "./EmailConfirmationModal";
import ResetPasswordModal from "./ResetPasswordModal";

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

function Login() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modalState, setModalState] = useState({
    showForgotPassword: false,
    showEmailConfirmation: false,
    showResetPassword: false,
    email: "",
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const openForgotPasswordModal = () => {
    setModalState((prev) => ({ ...prev, showForgotPassword: true }));
  };

  const closeForgotPasswordModal = () => {
    setModalState((prev) => ({ ...prev, showForgotPassword: false }));
  };

  const handleForgotPasswordSubmit = (email) => {
    setModalState((prev) => ({
      ...prev,
      email,
      showForgotPassword: false,
      showEmailConfirmation: true,
    }));
  };

  const closeEmailConfirmationModal = () => {
    setModalState((prev) => ({ ...prev, showEmailConfirmation: false }));
  };

  const handleEmailConfirmationSubmit = () => {
    setModalState((prev) => ({
      ...prev,
      showEmailConfirmation: false,
      showResetPassword: true,
    }));
  };

  const closeResetPasswordModal = () => {
    setModalState((prev) => ({
      ...prev,
      showResetPassword: false,
      email: "",
    }));
  };

  const handleResetPasswordSubmit = () => {
    // Reset password logic here
    closeResetPasswordModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        if (json.token) localStorage.setItem('token', json.token);
        // Redirect on success
        window.location.href = '/';
      } else {
        setError(json.message || `Login failed (${res.status})`);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
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

      {/* Modals */}
      {modalState.showForgotPassword && (
        <ForgotPasswordModal
          onClose={closeForgotPasswordModal}
          onSubmit={handleForgotPasswordSubmit}
        />
      )}
      {modalState.showEmailConfirmation && (
        <EmailConfirmationModal
          email={modalState.email}
          onClose={closeEmailConfirmationModal}
          onSubmit={handleEmailConfirmationSubmit}
        />
      )}
      {modalState.showResetPassword && (
        <ResetPasswordModal
          email={modalState.email}
          onClose={closeResetPasswordModal}
          onSubmit={handleResetPasswordSubmit}
        />
      )}

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
            Sign in to your account
          </h2>

          {/* Login Link */}
          <p className="text-start text-sm sm:text-base lg:text-[16px] text-[#768C9F] font-medium font-pop mb-6 sm:mb-8 lg:mb-[42px]">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="text-[#F4D09F] font-semibold hover:underline"
            >
              Sign up
            </a>
          </p>

          {/* Form */}
          <form className="w-full" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm sm:text-base lg:text-[16px] text-[#768C9F] font-medium font-pop mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 sm:px-4 h-12 sm:h-14 border border-gray-300 rounded-lg text-sm sm:text-[14px] bg-[#F3F3F5] text-[#717182] placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-[#DDA04E] focus:bg-white focus:ring-4 focus:ring-amber-100 font-inter"
                required
              />
              <small className="block text-xs sm:text-[14px] text-[#768C9F] font-medium font-pop mt-2 sm:mt-3">
                <button
                  type="button"
                  onClick={openForgotPasswordModal}
                  className="text-[#DDA04E] hover:underline transition-all duration-200"
                >
                  Forgot Password?
                </button>
              </small>
            </div>

            {/* Submit Button */}
            {error && (
              <p className="text-red-500 text-xs sm:text-sm font-inter mb-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 sm:h-[64px] bg-[#DDA04E] hover:bg-[#C68E3D] disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer text-white font-semibold text-sm sm:text-base rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 mb-3 sm:mb-4 font-pop"
            >
              {loading ? 'Signing in...' : 'Log In'}
            </button>

            {/* Login Link Bottom */}
            <p className="text-start text-xs sm:text-sm text-gray-600 font-inter">
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className="text-[#F4D09F] font-semibold hover:underline"
              >
                Sign up
              </a>
            </p>

            
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

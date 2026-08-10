"use client";

import React, { useState, useEffect } from "react";
import ForgotPasswordModal from "./ForgotPasswordModal";
import EmailConfirmationModal from "./EmailConfirmationModal";
import ResetPasswordModal from "./ResetPasswordModal";
import { setAuthSession } from "@/lib/authStorage";
import { BASE_URL } from "@/lib/apiClient";

const slides = [
  {
    id: 1,
    image: "/assets/slide1.png",
    title: "Transparency & Trust",
    description: "Your investments, clearly tracked. Welcome to full financial transparency.",
  },
  {
    id: 2,
    image: "/assets/slide2.png",
    title: "Seamless Communication",
    description: "Stay connected with tenants, landlords, and admins all in one place.",
  },
  {
    id: 3,
    image: "/assets/slide3.png",
    title: "Real-Time Updates",
    description: "Get notified on rent, expenses, and project milestones as they happen.",
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
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const openForgotPasswordModal  = () => setModalState(p => ({ ...p, showForgotPassword: true }));
  const closeForgotPasswordModal = () => setModalState(p => ({ ...p, showForgotPassword: false }));

  const handleForgotPasswordSubmit = (email) => {
    setModalState(p => ({ ...p, email, showForgotPassword: false, showEmailConfirmation: true }));
  };

  const closeEmailConfirmationModal  = () => setModalState(p => ({ ...p, showEmailConfirmation: false }));
  const handleEmailConfirmationSubmit = (resetToken) => {
    setModalState(p => ({ ...p, showEmailConfirmation: false, showResetPassword: true, resetToken }));
  };

  const closeResetPasswordModal  = () => setModalState(p => ({ ...p, showResetPassword: false, email: "" }));
  const handleResetPasswordSubmit = () => closeResetPasswordModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res  = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setAuthSession({ token: json.token, user: json.user, role: json.user?.role });
        if (json.token)      localStorage.setItem("token", json.token);
        if (json.user?.role) localStorage.setItem("role", json.user.role);
        if (json.forcePasswordChange) { window.location.href = "/change-password"; return; }
        const role = json.user?.role;
        if (role === "Admin")    window.location.href = "/admin";
        else if (role === "Investor") window.location.href = "/dashboard";
        else if (role === "Tenant")   window.location.href = "/tenant";
        else window.location.href = "/";
      } else {
        setError(json.message || json.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen relative bg-white">

      {/* Modals */}
      {modalState.showForgotPassword && (
        <ForgotPasswordModal onClose={closeForgotPasswordModal} onSubmit={handleForgotPasswordSubmit} />
      )}
      {modalState.showEmailConfirmation && (
        <EmailConfirmationModal email={modalState.email} onClose={closeEmailConfirmationModal} onSubmit={handleEmailConfirmationSubmit} />
      )}
      {modalState.showResetPassword && (
        <ResetPasswordModal email={modalState.email} onClose={closeResetPasswordModal} onSubmit={handleResetPasswordSubmit} />
      )}

      {/* ── MOBILE VIEW — full screen background with form overlay ─────────── */}
      <div className="lg:hidden relative min-h-screen w-full flex flex-col">

        {/* Background image — cycles with slide */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 flex flex-col min-h-screen px-6 pt-12 pb-8">

          {/* Top — Logo + heading */}
          <div className="flex flex-col items-center mb-8">
            <img src="/assets/logo4567-removebg-preview.png" alt="Logo" className="w-[25%] mb-4" />
            {/* <p className="text-white/70 text-[13px] font-medium mb-1">Join Hinansho</p> */}
            <h1 className="text-white text-[28px] font-bold text-center leading-tight">
              Sign in to your account
            </h1>
            {/* <p className="text-white/60 text-[13px] mt-2">
              Already have an account?{" "}
              <a href="/register" className="text-[#DDA04E] font-semibold hover:underline">Log in</a>
            </p> */}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">

            {/* Email */}
            <div>
              <label className="block text-white/80 text-[13px] font-medium mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                placeholder="johndoe@gmail.com"
                className="w-full px-4 h-[52px] rounded-xl text-sm text-white placeholder-white/40 bg-white/10 border border-white/20 backdrop-blur-sm focus:outline-none focus:border-[#DDA04E] focus:bg-white/15 transition"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/80 text-[13px] font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  className="w-full px-4 pr-16 h-[52px] rounded-xl text-sm text-white placeholder-white/40 bg-white/10 border border-white/20 backdrop-blur-sm focus:outline-none focus:border-[#DDA04E] focus:bg-white/15 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-[13px] font-medium"
                  tabIndex={-1}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <p className="text-white/40 text-[11px] mt-1.5">Use 8 or more characters with a mix of letters, numbers & symbols</p>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end -mt-1">
              <button
                type="button"
                onClick={openForgotPasswordModal}
                className="text-[13px] text-[#DDA04E] font-medium hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-400/30 rounded-xl">
                <p className="text-red-300 text-[13px]">{error}</p>
              </div>
            )}

            {/* Terms */}
            <p className="text-white/50 text-[12px]">
              By creating an account, you agree to our{" "}
              <span className="text-white/80 underline cursor-pointer">Terms of use</span>{" "}
              and{" "}
              <span className="text-white/80 underline cursor-pointer">Privacy Policy</span>
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] bg-[#DDA04E] hover:bg-[#C68E3D] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-[15px] rounded-xl transition-all duration-200 hover:shadow-lg mt-2"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            {/* <p className="text-center text-white/50 text-[13px]">
              Already have an account?{" "}
              <a href="/register" className="text-[#DDA04E] font-semibold hover:underline">Log in</a>
            </p> */}
          </form>

          {/* Slide indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentSlide ? "bg-[#DDA04E] w-8" : "bg-white/30 w-1.5"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── DESKTOP VIEW — unchanged split layout ───────────────────────────── */}
      <div className="hidden lg:flex w-full lg:flex-row min-h-screen">

        {/* Left — Slider */}
        <div className="lg:flex-1 relative overflow-hidden bg-gray-100">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute w-full h-full transition-opacity duration-700 ease-in-out flex items-end justify-start ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url(${slide.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/0 z-10" />
              <div className="relative z-20 text-white p-10 max-w-xl">
                <h2 className="text-[32px] font-semibold mb-4 leading-tight">{slide.title}</h2>
                <p className="text-[16px] font-normal mb-10 leading-snug opacity-95">{slide.description}</p>
              </div>
            </div>
          ))}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-5 z-30">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-3 rounded-md border-2 transition-all duration-300 ${
                  index === currentSlide ? "bg-[#DDA04E] border-[#DDA04E] w-[50px]" : "w-3 border-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right — Form */}
        <div className="lg:flex-1 flex flex-col justify-center items-center p-10 bg-white">
          <div className="w-full max-w-md">
            <div className="absolute right-10 top-10">
              <img src="/assets/logo.png" alt="Logo" className="w-10 h-10" />
            </div>
            <h2 className="text-[32px] font-medium text-[#F4D09F] mb-2">Sign in to your account</h2>
            {/* <p className="text-[#768C9F] font-medium mb-10">
              Don&apos;t have an account?{" "}
              <a href="/register" className="text-[#F4D09F] font-semibold hover:underline">Sign up</a>
            </p> */}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-[#768C9F] font-medium mb-2">Email address</label>
                <input
                  type="email" value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  placeholder="johndoe@gmail.com"
                  className="w-full px-4 h-14 border border-gray-300 rounded-lg text-sm bg-[#F3F3F5] text-[#717182] placeholder-gray-400 focus:outline-none focus:border-[#DDA04E] focus:bg-white focus:ring-4 focus:ring-amber-100 transition"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-[#768C9F] font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} value={password}
                    onChange={e => { setPassword(e.target.value); setError(""); }}
                    placeholder="••••••••"
                    className="w-full px-4 h-14 border border-gray-300 rounded-lg text-sm bg-[#F3F3F5] text-[#717182] placeholder-gray-400 focus:outline-none focus:border-[#DDA04E] focus:bg-white focus:ring-4 focus:ring-amber-100 transition"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.83 9L15 12.17V12c0-1.66-1.34-3-3-3h-.17zm-4.3.8l1.55 1.55A3 3 0 0 0 9 12c0 1.66 1.34 3 3 3 .55 0 1.06-.15 1.5-.42l.98.98A5.01 5.01 0 0 1 12 17c-2.76 0-5-2.24-5-5 0-.68.14-1.33.38-1.93l-.85-.85zm9.43-.93C18.37 10.35 19 11.11 19 12c0 2.76-2.24 5-5 5-.77 0-1.5-.19-2.14-.53l-1.46-1.46A5.01 5.01 0 0 0 12 17c2.76 0 5-2.24 5-5 0-.92-.25-1.79-.68-2.54l-1.36-1.59zM2.1 2.1c-.41.41-.41 1.05 0 1.46l2.68 2.68A11.95 11.95 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.96 0 3.8-.51 5.4-1.4l2.96 2.96c.41.41 1.05.41 1.46 0 .41-.41.41-1.05 0-1.46L3.56 2.1c-.41-.41-1.05-.41-1.46 0z"/></svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex justify-end mb-4">
                <button type="button" onClick={openForgotPasswordModal}
                  className="text-sm text-[#F4D09F] font-medium hover:underline">
                  Forgot password?
                </button>
              </div>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              <button type="submit" disabled={loading}
                className="w-full h-[64px] bg-[#DDA04E] hover:bg-[#C68E3D] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg mb-4">
                {loading ? "Signing in..." : "Sign in"}
              </button>
              {/* <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <a href="/register" className="text-[#F4D09F] font-semibold hover:underline">Sign up</a>
              </p> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

// "use client";

// import React, { useState, useEffect } from "react";

// export default function EmailConfirmationModal({ email, onClose, onSubmit }) {
//   const [code, setCode] = useState(["", "", "", "", ""]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) { clearInterval(timer); return 0; }
//         return prev - 1;
//       });
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const handleInputChange = (index, value) => {
//     const numValue = value.replace(/[^0-9]/g, "");
//     if (numValue.length > 1) return;
//     const newCode = [...code];
//     newCode[index] = numValue;
//     setCode(newCode);
//     setError("");
//     if (numValue && index < 4) {
//       document.getElementById(`code-input-${index + 1}`)?.focus();
//     }
//   };

//   const handleKeyDown = (index, e) => {
//     if (e.key === "Backspace" && !code[index] && index > 0) {
//       document.getElementById(`code-input-${index - 1}`)?.focus();
//     }
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();
//     const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 5);
//     if (!pasted) return;
//     const newCode = [...code];
//     pasted.split("").forEach((ch, i) => { if (i < 5) newCode[i] = ch; });
//     setCode(newCode);
//     document.getElementById(`code-input-${Math.min(pasted.length, 4)}`)?.focus();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const fullCode = code.join("");
//     if (fullCode.length !== 5) {
//       setError("Please enter all 5 digits");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch("/api/auth/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         // Backend requires both email and otp
//         body: JSON.stringify({ email, otp: fullCode }),
//       });

//       const json = await res.json().catch(() => ({}));
//       if (res.ok) {
//         onSubmit();
//       } else {
//         setError(json.message || `Verification failed (${res.status})`);
//       }
//     } catch (err) {
//       setError(err.message || "Invalid code. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   const handleResendCode = async () => {
//     if (timeLeft > 240) return; // enforce cooldown
//     try {
//       setLoading(true);
//       const res = await fetch("/api/auth/resend-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });
//       const json = await res.json().catch(() => ({}));
//       if (res.ok) {
//         setTimeLeft(300);
//         setError("");
//         setCode(["", "", "", "", ""]);
//         document.getElementById("code-input-0")?.focus();
//       } else {
//         setError(json.message || `Failed to resend (${res.status})`);
//       }
//     } catch (err) {
//       setError(err.message || "Failed to resend code. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-[999]">
//       <div
//         className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//         onClick={onClose}
//       />
//       <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-8 md:p-10">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
//           aria-label="Close"
//         >
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>

//         <h2 className="text-2xl md:text-3xl font-semibold font-pop text-[#1A1A2E] mb-2">
//           Verify Your Email
//         </h2>
//         <p className="text-sm md:text-base text-gray-600 font-inter mb-2">
//           We&apos;ve sent a 5-digit code to <br />
//           <span className="font-semibold text-[#1A1A2E]">{email}</span>
//         </p>
//         <p className="text-xs md:text-sm text-[#DDA04E] font-semibold font-pop mb-6">
//           Code expires in: {formatTime(timeLeft)}
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="flex gap-2 md:gap-3 justify-between" onPaste={handlePaste}>
//             {code.map((digit, index) => (
//               <input
//                 key={index}
//                 id={`code-input-${index}`}
//                 type="text"
//                 inputMode="numeric"
//                 value={digit}
//                 onChange={(e) => handleInputChange(index, e.target.value)}
//                 onKeyDown={(e) => handleKeyDown(index, e)}
//                 maxLength="1"
//                 placeholder="0"
//                 className="w-12 h-12 md:w-14 md:h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg bg-[#F3F3F5] text-[#717182] transition-all duration-300 focus:outline-none focus:border-[#DDA04E] focus:bg-white focus:ring-4 focus:ring-amber-100 font-pop"
//               />
//             ))}
//           </div>

//           {error && (
//             <p className="text-red-500 text-xs md:text-sm font-inter text-center">{error}</p>
//           )}

//           <button
//             type="submit"
//             disabled={loading || code.join("").length !== 5}
//             className="w-full h-12 md:h-14 bg-[#DDA04E] hover:bg-[#C68E3D] disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer text-white font-semibold text-sm md:text-base rounded-lg transition-all duration-300 hover:shadow-lg active:translate-y-0 mt-6 font-pop"
//           >
//             {loading ? "Verifying..." : "Confirm Code"}
//           </button>

//           <button
//             type="button"
//             onClick={handleResendCode}
//             disabled={loading || timeLeft > 240}
//             className="w-full py-3 text-center text-[#768C9F] font-medium text-sm md:text-base hover:text-[#1A1A2E] transition-colors font-pop disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {timeLeft > 240
//               ? `Resend available in ${formatTime(timeLeft - 240)}`
//               : "Didn't receive the code? Resend"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


"use client";
import { useState, useRef, useEffect } from "react";
import { BASE_URL } from "@/lib/apiClient";

export default function EmailConfirmationModal({ email, onClose, onSubmit }) {
  const [otp, setOtp]         = useState(["", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [resending, setResending] = useState(false);
  const [resent, setResent]   = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputs = useRef([]);

  // ✅ Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const otpString = otp.join("");
    if (otpString.length < 5) {
      setError("Please enter all 5 digits.");
      return;
    }
    setLoading(true);
    try {
      const res  = await fetch(`${BASE_URL}/auth/verify-reset`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, otp: otpString }),
      });
      const data = await res.json();
      if (res.ok) {
        // ✅ Pass userId back to parent
        onSubmit(data.userId);
      } else {
        setError(data.error || data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    setOtp(["", "", "", "", "", ""]);
    setCountdown(60);
    inputs.current[0]?.focus();
    try {
      await fetch(`${BASE_URL}/auth/resend-reset`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      });
      setResent(true);
      setTimeout(() => setResent(false), 3000);
    } catch (err) {
      setError("Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 relative">
        <button onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 text-2xl leading-none">
          ×
        </button>

        <div className="text-center mb-6">
          {/* <div className="text-4xl mb-3">📧</div> */}
          <h2 className="text-[22px] font-bold text-[#0F172A] mb-2">Check Your Email</h2>
          {/* <p className="text-[14px] text-[#62748E]">
            We sent a 6-digit code to:
          </p> */}
          <p className="text-sm md:text-base text-gray-600 font-inter mb-2">
            We&apos;ve sent a 5-digit code to <br />
            <span className="font-semibold text-[#1A1A2E]">{email}</span>
         </p>
          {/* <p className="text-[15px] font-semibold text-[#DDA04E] mt-1">{email}</p> */}
         {/* <p className="text-xs md:text-sm text-[#DDA04E] font-semibold font-pop mb-6"> */}

          <p className="text-xs md:text-sm text-[#DDA04E] font-semibold font-pop mb-6">
            {countdown > 0 ? (
              <>
                <span className="text-[#DDA04E]">Code expires in </span>
                <span className={`font-bold ${countdown <= 10 ? "text-red-500" : "text-[#DDA04E]"}`}>
                  {String(Math.floor(countdown / 60)).padStart(2, "0")}:{String(countdown % 60).padStart(2, "0")}
                </span>
              </>
            ) : (
              <span className="text-red-500 font-medium">Code expired — please resend</span>
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ✅ Original 6-box design */}
          <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputs.current[index] = el}
                placeholder = "0"
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                className={`w-12 h-12 text-center text-[22px] font-bold border-2 rounded-xl focus:outline-none transition ${
                  digit
                    ? "border-[#DDA04E] bg-[#FFFBEB] text-[#0F172A]"
                    : "border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A]"
                } focus:border-[#DDA04E]`}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-[13px] text-center mb-3">{error}</p>
          )}

          {resent && (
            <p className="text-green-500 text-[13px] text-center mb-3">✅ OTP resent successfully!</p>
          )}

          <button
            type="submit"
            disabled={loading || otp.join("").length < 5}
            className="w-full py-3 bg-[#0F172A] text-white rounded-xl font-semibold text-[15px] hover:bg-[#1E293B] transition disabled:opacity-60 mb-3"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-[13px] text-[#DDA04E] font-medium hover:underline disabled:opacity-50"
            >
              {resending ? "Resending..." : "Didn't receive it? Resend OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

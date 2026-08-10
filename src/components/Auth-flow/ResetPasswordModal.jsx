// "use client";
// import { useState } from "react";
// import { BASE_URL } from "@/lib/apiClient";

// export default function ResetPasswordModal({ email, resetToken, onClose, onSubmit }) {
//   const [newPassword, setNewPassword]     = useState("");
//   const [confirmPass, setConfirmPass]     = useState("");
//   const [showPass, setShowPass]           = useState(false);
//   const [loading, setLoading]             = useState(false);
//   const [error, setError]                 = useState("");
//   const [success, setSuccess]             = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (newPassword.length < 8) {
//       setError("Password must be at least 8 characters.");
//       return;
//     }
//     if (newPassword !== confirmPass) {
//       setError("Passwords do not match.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res  = await fetch(`${BASE_URL}/auth/reset-password`, {
//         method:  "POST",
//         headers: { "Content-Type": "application/json" },
//         // ✅ Send resetToken along with email and newPassword
//         body:    JSON.stringify({ email, newPassword, resetToken }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setSuccess(true);
//         setTimeout(() => {
//           onSubmit();
//           onClose();
//         }, 2000);
//       } else {
//         setError(data.error || data.message || "Failed to reset password.");
//       }
//     } catch (err) {
//       setError("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
//       <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 relative">
//         <button onClick={onClose}
//           className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 text-2xl leading-none">
//           ×
//         </button>

//         {success ? (
//           <div className="text-center py-4">
//             <div className="text-5xl mb-4">✅</div>
//             <h2 className="text-[22px] font-bold text-[#0F172A] mb-2">Password Reset!</h2>
//             <p className="text-[14px] text-[#62748E]">
//               Your password has been reset successfully. You can now log in.
//             </p>
//           </div>
//         ) : (
//           <>
//             <h2 className="text-[22px] font-bold text-[#0F172A] mb-2">Set New Password</h2>
//             <p className="text-[14px] text-[#62748E] mb-6">
//               Enter a new password for <span className="text-[#DDA04E] font-medium">{email}</span>
//             </p>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
//                   New Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPass ? "text" : "password"}
//                     value={newPassword}
//                     onChange={e => setNewPassword(e.target.value)}
//                     placeholder="Min. 8 characters"
//                     required
//                     className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#DDA04E] bg-[#F8FAFC] pr-16"
//                   />
//                   <button type="button" onClick={() => setShowPass(v => !v)}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#62748E] font-medium">
//                     {showPass ? "Hide" : "Show"}
//                   </button>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
//                   Confirm New Password
//                 </label>
//                 <input
//                   type={showPass ? "text" : "password"}
//                   value={confirmPass}
//                   onChange={e => setConfirmPass(e.target.value)}
//                   placeholder="Repeat your password"
//                   required
//                   className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#DDA04E] bg-[#F8FAFC]"
//                 />
//               </div>

//               {error && (
//                 <p className="text-red-500 text-[13px]">❌ {error}</p>
//               )}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-3 bg-[#DDA04E] text-white rounded-xl font-semibold text-[15px] hover:bg-[#C68E3D] transition disabled:opacity-60"
//               >
//                 {loading ? "Resetting..." : "Reset Password"}
//               </button>
//             </form>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { BASE_URL } from "@/lib/apiClient";

export default function ResetPasswordModal({ email, userId, onClose, onSubmit }) {
  const [newPassword, setNewPassword]   = useState("");
  const [confirmPass, setConfirmPass]   = useState("");
  const [showPass, setShowPass]         = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [success, setSuccess]           = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPass) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res  = await fetch(`${BASE_URL}/auth/reset-password`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ userId, newPassword }),
      });
      const data = await res.json();
      if (res.ok || data.success) {
        setSuccess(true);
        setTimeout(() => {
          onSubmit();
          onClose();
        }, 2000);
      } else {
        setError(data.error || data.message || "Failed to reset password.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 relative">
        <button onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 text-2xl leading-none">
          ×
        </button>

        {success ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-[22px] font-bold text-[#0F172A] mb-2">Password Reset!</h2>
            <p className="text-[14px] text-[#62748E]">
              Your password has been reset successfully. You can now log in.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-[22px] font-bold text-[#0F172A] mb-2">Set New Password</h2>
            <p className="text-[14px] text-[#62748E] mb-6">
              Enter a new password for <span className="text-[#DDA04E] font-medium">{email}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    required
                    className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#DDA04E] bg-[#F8FAFC] pr-16"
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#62748E] font-medium">
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">Confirm New Password</label>
                <input
                  type={showPass ? "text" : "password"}
                  value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#DDA04E] bg-[#F8FAFC]"
                />
              </div>

              {error && <p className="text-red-500 text-[13px]">❌ {error}</p>}

              <button type="submit" disabled={loading}
                className="w-full py-3 bg-[#DDA04E] text-white rounded-xl font-semibold text-[15px] hover:bg-[#C68E3D] transition disabled:opacity-60">
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

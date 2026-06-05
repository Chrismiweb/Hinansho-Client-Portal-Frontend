"use client";

import { useEffect, useState, useRef } from "react";
import { apiRequest } from "@/lib/apiClient";
import { IoClose } from "react-icons/io5";
import { BiBell } from "react-icons/bi";
import { MdOutlinePayment } from "react-icons/md";
import { BsCheckCircle }    from "react-icons/bs";
import { MdOutlineCancel }  from "react-icons/md";
import { LuFileText }       from "react-icons/lu";
import { BiBellOff }        from "react-icons/bi";

const timeAgo = (dateStr) => {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "Just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const TYPE_CONFIG = {
  payment_submitted: { icon: MdOutlinePayment, bg: "bg-[#FFFBEB]", color: "text-[#E17100]" },
  payment_confirmed: { icon: BsCheckCircle,    bg: "bg-[#F0FDF4]", color: "text-[#00A63E]" },
  payment_rejected:  { icon: MdOutlineCancel,  bg: "bg-[#FEF2F2]", color: "text-red-500"   },
  document_uploaded: { icon: LuFileText,       bg: "bg-[#EFF6FF]", color: "text-blue-500"  },
  general:           { icon: BiBellOff,        bg: "bg-[#F1F5F9]", color: "text-[#64748B]" },
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [open, setOpen]                   = useState(false);
  const [loading, setLoading]             = useState(false);
  const ref = useRef(null);

  const fetchNotifications = () => {
    setLoading(true);
    apiRequest("/notifications")
      .then(res => {
        if (res.success) {
          setNotifications(res.notifications || []);
          setUnreadCount(res.unreadCount || 0);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    setOpen(o => !o);
    if (!open && unreadCount > 0) {
      apiRequest("/notifications/mark-read", { method: "PUT" })
        .then(() => setUnreadCount(0))
        .catch(console.error);
    }
  };

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#E2E8F0] hover:border-[#DDA04E] transition"
      >
        <BiBell className="text-[20px] text-[#62748E]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] z-50 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#F1F5F9]">
            <h4 className="font-semibold text-[15px] text-[#0F172A]">Notifications</h4>
            <button onClick={() => setOpen(false)}>
              <IoClose className="text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[#F8FAFC]">
            {loading && notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center">
                <BiBell className="text-4xl text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => {
                const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.general;
                const Icon   = config.icon;
                return (
                  <div key={n._id} className={`px-4 py-3 hover:bg-[#F8FAFC] transition ${!n.read ? "bg-[#FFFBEB]" : ""}`}>
                    <div className="flex gap-3 items-start">
                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                        <Icon className={`text-[18px] ${config.color}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[#0F172A] leading-snug">{n.title}</p>
                        <p className="text-[12px] text-[#64748B] mt-0.5 leading-snug">{n.message}</p>
                        <p className="text-[11px] text-[#94A3B8] mt-1">{timeAgo(n.createdAt)}</p>
                      </div>

                      {/* Unread dot */}
                      {!n.read && (
                        <span className="w-2 h-2 bg-[#DDA04E] rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-[#F1F5F9] text-center">
              <button
                onClick={() => {
                  apiRequest("/notifications/mark-read", { method: "PUT" });
                  setUnreadCount(0);
                  setNotifications(n => n.map(x => ({ ...x, read: true })));
                }}
                className="text-[13px] text-[#DDA04E] font-medium hover:underline"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

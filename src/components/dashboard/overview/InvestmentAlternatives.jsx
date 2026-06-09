"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, X, Phone, Mail, Globe, Instagram, Facebook } from "lucide-react";
import { apiRequest } from "@/lib/apiClient";

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "₦0";
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000)     return `₦${(amount / 1_000).toFixed(0)}K`;
  return `₦${Number(amount).toLocaleString()}`;
};

const PLACEHOLDER = "/assets/property.jpg";

const CONTACT = {
  phone:     "+234 801 234 5678",
  email:     "info@hinansho.com",
  website:   "https://hinansho.com",
  instagram: "https://instagram.com/hinansho",
  facebook:  "https://facebook.com/hinansho",
  whatsapp:  "https://wa.me/2348012345678",
};

// ── Contact Modal ─────────────────────────────────────────────────────────────
function ContactModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-[24px] overflow-hidden shadow-xl bg-white">

        {/* Dark header */}
        <div className="bg-[#0F172A] px-6 pt-6 pb-10 text-center relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X size={16} className="text-white" />
          </button>
          <div className="w-14 h-14 rounded-[14px] bg-[#DDA04E]/20 border border-[#DDA04E]/40 flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-[#DDA04E]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
          </div>
          <p className="text-white font-semibold text-[17px]">Hinansho Management</p>
          <p className="text-white/50 text-[13px] mt-1">We're here to help — reach out anytime</p>
        </div>

        {/* Body */}
        <div className="px-5 py-5 -mt-4 bg-white rounded-t-[20px] relative">

          {/* Contact rows */}
          <div className="flex flex-col gap-3 mb-5">
            {[
              { icon: Phone,  label: "Phone",   value: CONTACT.phone,   href: `tel:${CONTACT.phone}`,    iconBg: "bg-[#EAF3DE]", iconColor: "text-[#3B6D11]" },
              { icon: Mail,   label: "Email",   value: CONTACT.email,   href: `mailto:${CONTACT.email}`, iconBg: "bg-[#E6F1FB]", iconColor: "text-[#185FA5]" },
              { icon: Globe,  label: "Website", value: "www.hinansho.com", href: CONTACT.website,         iconBg: "bg-[#FAEEDA]", iconColor: "text-[#854F0B]" },
            ].map(item => (
              <a
                key={item.label}
                href={item.href}
                target={item.label === "Website" ? "_blank" : undefined}
                rel="noreferrer"
                className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9] hover:border-[#DDA04E] transition no-underline"
              >
                <div className={`w-9 h-9 rounded-[10px] ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <item.icon size={16} className={item.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-[#94A3B8] uppercase tracking-wider">{item.label}</p>
                  <p className="text-[14px] font-medium text-[#0F172A] truncate mt-0.5">{item.value}</p>
                </div>
                <ArrowUpRight size={14} className="text-[#94A3B8] flex-shrink-0" />
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#F1F5F9]" />
            <p className="text-[12px] text-[#94A3B8]">Follow us</p>
            <div className="flex-1 h-px bg-[#F1F5F9]" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              {
                label: "Instagram",
                href:  CONTACT.instagram,
                bg:    "bg-[#FBEAF0]",
                color: "text-[#993556]",
                icon: (
                  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                )
              },
              {
                label: "Facebook",
                href:  CONTACT.facebook,
                bg:    "bg-[#E6F1FB]",
                color: "text-[#185FA5]",
                icon: (
                  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                )
              },
              {
                label: "WhatsApp",
                href:  CONTACT.whatsapp,
                bg:    "bg-[#EAF3DE]",
                color: "text-[#3B6D11]",
                icon: (
                  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                )
              },
            ].map(social => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border border-[#F1F5F9] ${social.bg} hover:opacity-80 transition no-underline`}
              >
                <span className={social.color}>{social.icon}</span>
                <span className={`text-[11px] font-medium ${social.color}`}>{social.label}</span>
              </a>
            ))}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#0F172A] text-white rounded-xl text-[14px] font-medium hover:bg-[#1E293B] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function InvestmentAlternatives() {
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [selected, setSelected]         = useState(null);
  const [showContact, setShowContact]   = useState(false);

  useEffect(() => {
    apiRequest("/investor/investment-alternatives")
      .then(data => {
        if (data.success) setAlternatives(data.alternatives);
        else throw new Error(data.message || "Failed to load alternatives");
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-full">
      <div className="w-full bg-white rounded-[36px] border border-gray-200 px-6 py-8 shadow-sm sm:px-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Investment Alternatives</h2>
          <p className="mt-1 text-base text-slate-500">View other investment alternatives</p>
        </div>

        {loading && (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-6 animate-pulse">
                <div className="w-[50px] h-[44px] rounded-md bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-40" />
                  <div className="h-3 bg-gray-100 rounded w-56" />
                </div>
                <div className="h-9 bg-gray-200 rounded-2xl w-28" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="text-sm text-red-500 text-center py-6">{error}</p>
        )}

        {!loading && !error && alternatives.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 text-sm">
              🎉 You own all available properties! Check back later for new listings.
            </p>
          </div>
        )}

        {!loading && !error && alternatives.length > 0 && (
          <div className="space-y-10">
            {alternatives.map(item => (
              <div key={item.id}
                className="grid w-full grid-cols-[56px_1.5fr_auto] md:grid-cols-[56px_1.5fr_1fr_1fr_auto] items-center gap-x-4 md:gap-x-6">
                <div className="relative h-[44px] w-[50px] overflow-hidden rounded-md flex-shrink-0">
                  <img src={item.image || PLACEHOLDER} alt={item.title}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.src = PLACEHOLDER; }} />
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-[16px] font-bold text-black truncate">{item.title}</p>
                  <p className="mt-1 text-[13px] text-gray-500 truncate">{item.description || item.location}</p>
                </div>
                {item.price > 0 ? (
                  <p className="hidden md:block text-[16px] font-bold text-[#111827]">{formatCurrency(item.price)}</p>
                ) : (
                  <span className="hidden md:block text-[13px] font-bold text-red-500 px-3 py-1 rounded-full">Sold Out</span>
                )}
                <p className="hidden md:block text-[16px] text-[#1f2937]">{item.category}</p>
                <button type="button" onClick={() => setSelected(item)}
                  className="flex items-center justify-center gap-[10px] rounded-[16px] bg-[#0f172a] px-[14px] py-[8px] text-[14px] font-normal text-white shadow-[0_12px_22px_rgba(15,23,42,0.18)] transition hover:bg-[#1e293b] whitespace-nowrap">
                  Learn More <ArrowUpRight size={15} strokeWidth={2} />
                </button>
                <div className="col-span-3 flex gap-6 text-sm md:hidden mt-1">
                  {item.price > 0
                    ? <p className="font-bold text-slate-900">{formatCurrency(item.price)}</p>
                    : <span className="text-[13px] font-bold text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">Sold Out</span>
                  }
                  <p className="text-slate-600">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelected(null)}
              className="absolute right-5 top-5 z-10 rounded-full bg-white border border-gray-200 p-2 text-gray-700 hover:bg-gray-100 shadow-sm transition">
              <X size={18} />
            </button>
            <div className="relative mb-5 h-44 w-full overflow-hidden rounded-2xl bg-gray-100">
              <img src={selected.image || PLACEHOLDER} alt={selected.title}
                className="w-full h-full object-cover"
                onError={e => { e.target.src = PLACEHOLDER; }} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{selected.title}</h3>
            {selected.location && (
              <p className="mt-1 text-sm text-slate-400">📍 {selected.location}</p>
            )}
            <p className="mt-2 text-sm text-slate-500">{selected.description}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-gray-100 p-4">
                <p className="text-xs text-gray-500">Price</p>
                {selected.price > 0
                  ? <p className="font-bold text-slate-900">{formatCurrency(selected.price)}</p>
                  : <span className="text-[13px] font-bold text-red-500">Sold Out</span>
                }
              </div>
              <div className="rounded-2xl bg-gray-100 p-4">
                <p className="text-xs text-gray-500">Category</p>
                <p className="font-bold text-slate-900">{selected.category}</p>
              </div>
              {selected.totalUnits > 0 && (
                <div className="rounded-2xl bg-gray-100 p-4">
                  <p className="text-xs text-gray-500">Total Units</p>
                  <p className="font-bold text-slate-900">{selected.totalUnits}</p>
                </div>
              )}
              {selected.expectedRoi > 0 && (
                <div className="rounded-2xl bg-gray-100 p-4">
                  <p className="text-xs text-gray-500">Expected ROI</p>
                  <p className="font-bold text-slate-900">{selected.expectedRoi}%</p>
                </div>
              )}
            </div>
            {/* Contact Us button — opens contact modal */}
            <button
              onClick={() => { setSelected(null); setShowContact(true); }}
              className="mt-6 w-full rounded-2xl bg-slate-950 py-3 font-medium text-white transition hover:bg-slate-800">
              Contact Us
            </button>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </section>
  );
}

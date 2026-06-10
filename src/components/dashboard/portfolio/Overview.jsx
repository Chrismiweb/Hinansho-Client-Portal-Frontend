"use client";

const formatCurrency = (n) => {
  if (!n && n !== 0) return "—";
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `₦${(n / 1_000).toFixed(0)}K`;
  return `₦${Number(n).toLocaleString("en-NG")}`;
};

// ── Smart measurement — Pavilion = units, everything else = sqm ───────────────
const getMeasurement = (name = "", sqm = 0) => {
  if (!sqm) return "—";
  const n = name.toLowerCase();
  if (n.includes("pavilion") || n.includes("pavillion")) return `${sqm.toLocaleString()} units`;
  return `${sqm.toLocaleString()} sqm`;
};

const getType = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("pavilion") || n.includes("pavillion")) return "Hostel";
  if (n.includes("verda") || n.includes("farm"))         return "Farm";
  if (n.includes("hr"))                                  return "Hostel";
  if (n.includes("apartment") || n.includes("studio"))   return "Apartment";
  return "Land";
};

const getLocation = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("hr1") || n.includes("hr2") || n.includes("hr3")) return "Malete, Kwara State";
  if (n.includes("pavilion") || n.includes("pavillion"))            return "Malete, Kwara State";
  if (n.includes("verda") || n.includes("farm"))                    return "Kwara State";
  return "Nigeria";
};

// ── Description — uses sheet data if available, fallback to static ────────────
const getFallbackDescription = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("hr1")) return "HR 1 began the Hinansho journey — a modern, youth-focused estate strategically located in the Oke-Oyi axis of Ilorin. It combines affordability, accessibility, and long-term appreciation potential.";
  if (n.includes("hr2")) return "HR 2 is the second phase of Hinansho's residential development, offering investors a premium opportunity in one of Ilorin's fastest growing corridors.";
  if (n.includes("hr3")) return "HR 3 represents Hinansho's most ambitious residential project yet — a landmark development designed for modern living with strong ROI projections.";
  if (n.includes("pavilion") || n.includes("pavillion")) return "The Pavilion is Hinansho's flagship hostel investment, strategically positioned near major institutions to deliver consistent rental returns.";
  if (n.includes("verda") || n.includes("farm")) return "Verda Farms is Hinansho's agro-investment arm — offering investors a unique opportunity to participate in sustainable agriculture with strong annual returns.";
  return "A premium Hinansho real estate investment offering strong returns and long-term capital appreciation.";
};

export default function Overview({ data }) {
  const progress = data.receivable > 0
    ? Math.min(100, Math.round((data.received / data.receivable) * 100))
    : 100;

  const isPaid   = data.balance === 0;
  const type     = getType(data.name);
  const location = getLocation(data.name);
  const size     = getMeasurement(data.name, data.sqm);

  // Use description from sheet if available, otherwise use static fallback
  const desc = data.description?.trim() || getFallbackDescription(data.name);

  return (
    <div className="mt-6 space-y-6">

      {/* Row 1 — Summary + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Project Summary */}
        <div className="bg-white rounded-xl border border-[#0000001A] p-6">
          <p className="text-[17px] font-semibold text-[#0A0A0A] mb-4">Project Summary</p>
          <p className="text-[14px] text-[#62748E] leading-relaxed">{desc}</p>
        </div>

        {/* Property Details */}
        <div className="bg-white rounded-xl border border-[#0000001A] p-6">
          <p className="text-[17px] font-semibold text-[#0A0A0A] mb-4">Property Details</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <p className="text-[11px] font-bold text-[#90A1B9] uppercase tracking-wider mb-1">Type</p>
              <p className="text-[16px] font-medium text-[#0A0A0A]">{type}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#90A1B9] uppercase tracking-wider mb-1">Size</p>
              <p className="text-[16px] font-medium text-[#0A0A0A]">{size}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#90A1B9] uppercase tracking-wider mb-1">Location</p>
              <p className="text-[16px] font-medium text-[#0A0A0A]">{location}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#90A1B9] uppercase tracking-wider mb-1">Amount</p>
              <p className="text-[16px] font-medium text-[#0A0A0A]">{formatCurrency(data.receivable)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

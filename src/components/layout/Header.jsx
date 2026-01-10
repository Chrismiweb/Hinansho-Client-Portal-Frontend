export default function Header() {
  return (
    <header className="w-full mt-7.5 flex items-center justify-between gap-4 mb-6">
      {/* Left: Greeting */}
      <div>
        <h1 className="text-[24px] font-semibold text-[#0F172B] flex items-center gap-2">
          Good morning, Chrismi! <span>👋</span>
        </h1>
        <p className="text-sm text-[#62748E]">
          Here is what’s happening with your portfolio today.
        </p>
      </div>

      {/* Right: Search + Icons */}
      <div className="flex  items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="w-100 shadow-md shadow-[#717182] rounded-full bg-white px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
          />

          {/* Search Icon */}
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>

        {/* Notification */}
        <button className="w-10 h-10 rounded-full bg-white shadow-[#0000001A] shadow-md cursor-pointer flex items-center justify-center">
          <svg
            className="w-5 h-5 text-slate-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5" />
            <path d="M9 17a3 3 0 0 0 6 0" />
          </svg>
        </button>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200">
          <img
            src="https://i.pravatar.cc/100"
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}

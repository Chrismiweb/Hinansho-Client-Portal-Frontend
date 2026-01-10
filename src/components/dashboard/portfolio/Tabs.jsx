// components/Tabs.jsx
export default function Tabs({ tab, setTab }) {
  const tabs = ["overview", "financials", "expenses", "documents"];

  return (
    <div className="mt-6 bg-[#ECECF0] inline-flex rounded-full p-1">
      {tabs.map(t => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`px-[20px] cursor-pointer py-2 rounded-full text-[16px] ${
            tab === t ? "bg-white shadow" : ""
          }`}
        >
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  );
}

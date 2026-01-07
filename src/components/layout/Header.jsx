export default function Header() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">
      <div>
        <h1 className="text-lg font-semibold">
          Good morning, Alex 👋
        </h1>
        <p className="text-sm text-gray-500">
          Here’s what’s happening with your portfolio today
        </p>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="hidden md:block px-3 py-2 border rounded-md text-sm"
        />

        <div className="w-9 h-9 rounded-full bg-gray-200" />
      </div>
    </header>
  );
}

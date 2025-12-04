import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition"
          >
            <span className="text-2xl font-bold text-blue-600">IISF</span>
            <span className="text-sm text-gray-500 hidden sm:block">
              Innovation & Incubation
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition px-3 py-2"
            >
              Home
            </Link>
            <Link
              href="/events"
              style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
              className="px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 transition shadow-md"
            >
              Explore Events
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

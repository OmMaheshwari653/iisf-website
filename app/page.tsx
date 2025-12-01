import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-4xl">
        {/* Logo */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <Image
            src="/iisf-logo-new.jpg"
            alt="IISF Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-[#1E293B] mb-6 tracking-tight leading-tight">
          <span className="text-[#1A4DB3]">Innovation Incubation</span> and <span className="text-[#F5A623]">Startup Foundation</span>
        </h1>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-10 transform hover:scale-105 transition-transform duration-300">
          <span className="block text-5xl md:text-7xl font-black tracking-widest mb-2">
            <span className="text-[#1A4DB3]">COMING</span>
          </span>
          <span className="block text-5xl md:text-7xl font-black tracking-widest text-[#F5A623]">
            SOON
          </span>
        </div>

        <p className="text-xl text-gray-600 mb-12 max-w-lg mx-auto leading-relaxed">
          We are building something extraordinary. The Innovation Incubation and Startup Foundation's new digital experience is on its way.
        </p>

        {/* Tussle 3.0 Link - Kept accessible as requested implicitly by keeping the form active */}
        <div className="animate-bounce">
          <Link
            href="/forms/tussle3"
            className="inline-flex items-center px-8 py-4 bg-[#1A4DB3] text-white font-bold rounded-full hover:bg-[#F5A623] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Register for Tussle 3.0
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-8 text-gray-400 text-sm">
        &copy; 2025 IISF. All rights reserved.
      </footer>
    </div>
  );
}

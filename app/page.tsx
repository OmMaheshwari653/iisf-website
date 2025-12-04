import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Innovation & Incubation Startup Foundation
          </h1>
          <p className="mt-2 text-gray-600">Your College Innovation Hub</p>
        </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-gray-900 sm:text-6xl mb-6">
            Welcome to IISF
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join our community of innovators, entrepreneurs, and tech
            enthusiasts. Discover exciting events and opportunities!
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Innovation
            </h3>
            <p className="text-gray-600">
              Foster creativity and develop groundbreaking solutions
            </p>
          </div>
          <div className="text-center p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition">
            <div className="text-5xl mb-4">💡</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Incubation
            </h3>
            <p className="text-gray-600">
              Transform ideas into successful startups with mentorship
            </p>
          </div>
          <div className="text-center p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition">
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Community</h3>
            <p className="text-gray-600">
              Connect with like-minded innovators and entrepreneurs
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-20 py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>
            © 2025 Innovation & Incubation Startup Foundation. All rights
            reserved.
          </p>
        </div>
      </div>

      <footer className="absolute bottom-8 text-gray-400 text-sm">
        &copy; 2025 IISF. All rights reserved.
      </footer>
    </div>
  );
}

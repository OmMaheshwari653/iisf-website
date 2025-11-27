import Link from "next/link";

export default function Home() {
  const events = [
    {
      name: "Hackathon 2025",
      slug: "hackathon-2025",
      description: "Code, Build, and Win! 48-hour coding marathon",
      date: "January 15-17, 2025",
    },
    {
      name: "Startup Pitch Competition",
      slug: "startup-pitch-2025",
      description: "Present your innovative startup idea to investors",
      date: "February 5, 2025",
    },
    {
      name: "Innovation Workshop",
      slug: "innovation-workshop",
      description: "Learn about latest tech trends and innovations",
      date: "March 10, 2025",
    },
    {
      name: "Tech Talk Series",
      slug: "tech-talk-2025",
      description: "Industry experts share their insights and experiences",
      date: "Monthly",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Innovation & Incubation Startup Foundation
          </h1>
          <p className="mt-2 text-gray-600">Your College Innovation Hub</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Welcome to IISF
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our community of innovators, entrepreneurs, and tech
            enthusiasts. Register for exciting events and competitions!
          </p>
        </div>

        {/* Events Section */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Upcoming Events
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div
                key={event.slug}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-200"
              >
                <h4 className="text-2xl font-bold text-gray-900 mb-2">
                  {event.name}
                </h4>
                <p className="text-gray-600 mb-2">{event.description}</p>
                <p className="text-sm text-indigo-600 font-semibold mb-4">
                  📅 {event.date}
                </p>
                <Link
                  href={`/register/${event.slug}`}
                  className="inline-block w-full text-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  Register Now
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
            <p className="text-gray-600">
              Foster creativity and develop groundbreaking solutions
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Incubation</h3>
            <p className="text-gray-600">
              Transform ideas into successful startups with mentorship
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Community</h3>
            <p className="text-gray-600">
              Connect with like-minded innovators and entrepreneurs
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-16 py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>
            © 2025 Innovation & Incubation Startup Foundation. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

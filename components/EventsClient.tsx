"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Rocket, Lightbulb, Handshake } from "lucide-react";

interface Event {
  _id: string;
  name: string;
  slug: string;
  description: string;
  date: string;
  image?: string | null;
  rulebook?: string | null;
  whatsappLink?: string | null;
  isActive: boolean;
}

interface EventsClientProps {
  events: Event[];
}

export default function EventsClient({ events }: EventsClientProps) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.05),transparent_50%)]" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-300 backdrop-blur-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Explore & Register
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6">
            <span className="text-slate-900">Upcoming </span>
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">
              Events
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            Join our community of innovators, entrepreneurs, and tech
            enthusiasts. Register for exciting events and competitions!
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {events.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                <Calendar className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                No Events Available
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Check back soon for exciting opportunities and upcoming events!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <Link
                  key={event.slug}
                  href={`/register/${event.slug}`}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100 cursor-pointer"
                >
                  {/* Event Image */}
                  <div className="relative h-56 bg-gradient-to-br from-orange-100 to-amber-50 overflow-hidden">
                    {event.image ? (
                      <Image
                        src={event.image}
                        alt={event.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-8xl font-black text-orange-500/30">
                          {event.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Event Name */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-slate-900 text-center group-hover:text-orange-500 transition-colors">
                      {event.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Why Join{" "}
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                IISF?
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                Icon: Rocket,
                title: "Innovation",
                description:
                  "Foster creativity and develop groundbreaking solutions",
                gradient: "from-orange-500 to-amber-500",
              },
              {
                Icon: Lightbulb,
                title: "Incubation",
                description:
                  "Transform ideas into successful startups with mentorship",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                Icon: Handshake,
                title: "Community",
                description:
                  "Connect with like-minded innovators and entrepreneurs",
                gradient: "from-purple-500 to-pink-500",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="relative rounded-2xl border border-slate-200 bg-white p-8 text-center hover:border-slate-300 shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg text-white`}
                >
                  <feature.Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

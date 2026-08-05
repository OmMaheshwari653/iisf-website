"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Startup {
  _id: string;
  name: string;
  slug: string;
  email: string;
  mobileNumber: string;
  incubatedDate: string;
  incubationDetails?: string;
  status: string;
  website?: string;
  isActive: boolean;
}

interface Event {
  _id: string;
  name: string;
  slug: string;
  description: string;
  date: string;
  isActive: boolean;
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center z-10">
        <div className="flex items-center justify-center mb-4 mt-16 sm:mt-20">
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 via-amber-500/30 to-blue-500/30 rounded-full blur-3xl scale-150" />
            <img
              src="/iisf-logo.png"
              alt="IISF Logo"
              className="relative h-32 sm:h-40 md:h-48 w-auto object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900">
            Innovation Incubation & Startup Foundation
          </h1>

          <div className="flex justify-center items-center gap-2 mt-4">
            {["I", "I", "S", "F"].map((letter, index) => (
              <span
                key={index}
                className="text-4xl sm:text-5xl md:text-6xl font-black"
                style={{
                  background:
                    index === 0
                      ? "linear-gradient(135deg, #f97316, #fbbf24)"
                      : index === 1
                        ? "linear-gradient(135deg, #fbbf24, #f97316)"
                        : index === 2
                          ? "linear-gradient(135deg, #3b82f6, #06b6d4)"
                          : "linear-gradient(135deg, #06b6d4, #3b82f6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>

        <div className="inline-flex items-center gap-3 rounded-full border border-orange-500/30 bg-orange-500/10 px-5 py-2.5 text-xs sm:text-sm font-medium text-orange-600 backdrop-blur-md mb-6">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-orange-500"></span>
          </span>
          KNIT Sultanpur · Official Startup & Innovation Club
        </div>
      </div>
    </section>
  );
}

function UpcomingEventsAd() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUpcomingEvents() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/homepage?type=upcoming-events");
        if (response.ok) {
          const result = await response.json();
          console.log("Events API Response:", result);
          if (result.success && Array.isArray(result.data)) {
            setEvents(result.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUpcomingEvents();
  }, []);

  useEffect(() => {
    if (events.length === 0) return;

    const timer = setInterval(() => {
      const eventDate = new Date(events[currentEventIndex].date);
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [events, currentEventIndex]);

  useEffect(() => {
    if (events.length <= 1) return;
    const rotateTimer = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % events.length);
    }, 8000);
    return () => clearInterval(rotateTimer);
  }, [events.length]);

  if (!isVisible) return null;
  if (isLoading) return null;
  if (events.length === 0) return null;

  const currentEvent = events[currentEventIndex];
  const eventDate = new Date(currentEvent.date);
  const formattedDate = eventDate.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="fixed top-16 sm:top-20 left-0 right-0 z-40 bg-gradient-to-r from-slate-900 via-orange-950 to-slate-900 text-white overflow-hidden shadow-lg border-b border-orange-500/20">
      {/* Animated gradient line at top */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left - Event Info */}
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            {/* Live Badge */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-orange-500/30">
              <span className="w-2 h-2 bg-white rounded-full animate-ping" />
              UPCOMING
            </div>

            {/* Event Name */}
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">
                {currentEvent.name}
              </h3>
              <p className="text-orange-300 text-xs sm:text-sm">
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Center - Countdown Timer */}
          {timeLeft && (
            <div className="flex items-center gap-2 sm:gap-3">
              {[
                { value: timeLeft.days, label: "D" },
                { value: timeLeft.hours, label: "H" },
                { value: timeLeft.minutes, label: "M" },
                { value: timeLeft.seconds, label: "S" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="text-center bg-white/10 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 border border-orange-500/20"
                >
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-xl sm:text-2xl font-black tabular-nums text-white">
                      {String(item.value).padStart(2, "0")}
                    </span>
                    <span className="text-orange-300 text-[10px] font-medium">
                      {item.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Right - Actions */}
          <div className="flex items-center gap-3">
            {/* Register Button */}
            <Link href={`/register/${currentEvent.slug}`}>
              <button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-2 px-5 rounded-full hover:from-orange-600 hover:to-amber-600 transition-all duration-300 flex items-center gap-2 text-sm shadow-lg shadow-orange-500/30">
                Register
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </Link>

            {/* Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Event Dots Indicator */}
        {events.length > 1 && (
          <div className="flex justify-center gap-2 mt-2">
            {events.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentEventIndex(idx)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === currentEventIndex
                    ? "bg-purple-400 w-6"
                    : "bg-white/30 w-2 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Animated gradient line at bottom */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
    </div>
  );
}

function VisionSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative flex justify-center items-center">
            <Image
              src="/professors.jpg"
              alt="IISF Faculty"
              width={600}
              height={500}
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          <div className="lg:pl-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-8">
              It&apos;s enough to have a vision, We will take care of the rest!
            </h2>

            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <p>
                Welcome to IISF KNIT, a dynamic hub for innovation, creativity
                and entrepreneurship. Our center is a vibrant community where
                startups, entrepreneurs and innovators come together to
                collaborate, learn and grow. Our mission is to provide the
                resources, mentorship and guidance necessary to help turn great
                ideas into successful businesses.
              </p>
              <p>
                Our Incubation Center offers comprehensive services designed to
                support startups and entrepreneurs at all stages of their
                journey. From coworking spaces to funding opportunities,
                mentorship to training programs, we provide everything needed to
                help entrepreneurs turn their ideas into thriving businesses.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-16 border-t border-slate-200">
          <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-10">
            Our Partners & Affiliations
          </p>
          <div className="flex flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-20">
            <div className="flex-shrink-0">
              <Image
                src="/innovationHub.png"
                alt="Innovation Hub"
                width={200}
                height={100}
                className="h-20 sm:h-24 lg:h-28 w-auto object-contain"
              />
            </div>
            <div className="flex-shrink-0">
              <Image
                src="/startInUp.png"
                alt="Start In UP"
                width={200}
                height={100}
                className="h-20 sm:h-24 lg:h-28 w-auto object-contain"
              />
            </div>
            <div className="flex-shrink-0">
              <Image
                src="/collegeLogo.png"
                alt="KNIT Sultanpur"
                width={200}
                height={100}
                className="h-20 sm:h-24 lg:h-28 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FacilitiesSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [startups, setStartups] = useState<Startup[]>([]);

  useEffect(() => {
    async function fetchStartups() {
      try {
        const response = await fetch("/api/homepage?type=startups");
        if (response.ok) {
          const result = await response.json();
          console.log("Startups API Response:", result);
          if (result.success && Array.isArray(result.data)) {
            setStartups(result.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch startups:", error);
      }
    }
    fetchStartups();
  }, []);

  const facilities = [
    {
      image: "/coworkingSpaces.jpeg",
      title: "Coworking Spaces",
      description:
        "We provide startups with affordable and flexible coworking spaces to help them save costs and work in a collaborative environment. Our coworking spaces are equipped with all the necessary amenities such as high-speed internet, printers, and meeting rooms.",
    },
    {
      image: "/MentorshipAndNetworking.jpeg",
      title: "Mentorship and Networking",
      description:
        "We offer startups access to a network of experienced mentors who provide guidance and support in various areas such as fundraising, marketing, and operations. Our incubation center also offers various networking opportunities for startups to connect with investors, customers, and other entrepreneurs.",
    },
    {
      image: "/trainingAndWorkshop.jpeg",
      title: "Training and Workshops",
      description:
        "We organize regular training sessions and workshops to equip startups with the necessary skills and knowledge to succeed. These sessions cover a wide range of topics such as business planning, financial management, and product development.",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
            Our Facilities
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full" />
        </div>

        {/* Bento Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Main Large Card */}
          <div
            className="group relative rounded-3xl overflow-hidden cursor-pointer h-[400px] lg:h-[500px]"
            onClick={() => setActiveIndex(activeIndex === 0 ? null : 0)}
          >
            <Image
              src={facilities[0].image}
              alt={facilities[0].title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  {facilities[0].title}
                </h3>
                <div
                  className={`w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 ${activeIndex === 0 ? "rotate-180" : ""}`}
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              <div
                className={`overflow-hidden transition-all duration-500 ${activeIndex === 0 ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <p className="text-white/90 leading-relaxed">
                  {facilities[0].description}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Two Stacked Cards */}
          <div className="flex flex-col gap-6">
            {facilities.slice(1).map((facility, idx) => (
              <div
                key={idx + 1}
                className="group relative rounded-3xl overflow-hidden cursor-pointer h-[190px] lg:h-[237px]"
                onClick={() =>
                  setActiveIndex(activeIndex === idx + 1 ? null : idx + 1)
                }
              >
                <Image
                  src={facility.image}
                  alt={facility.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">
                      {facility.title}
                    </h3>
                    <div
                      className={`w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 ${activeIndex === idx + 1 ? "rotate-180" : ""}`}
                    >
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-500 ${activeIndex === idx + 1 ? "max-h-32 opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <p className="text-white/90 text-sm leading-relaxed">
                      {facility.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Startups Row */}
        {startups.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-slate-900">
                Startups We&apos;re Nurturing
              </h3>
              <Link
                href="/startup"
                className="text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-1 transition-colors"
              >
                View all
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {startups.map((startup, index) => (
                <div
                  key={startup._id}
                  className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-white">
                        {startup.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">
                        {startup.name}
                      </h4>
                      <p className="text-sm text-orange-600">
                        {startup.status === "incubated"
                          ? "Incubated"
                          : "Non-Incubated"}
                      </p>
                    </div>
                  </div>
                  {startup.incubationDetails && (
                    <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                      {startup.incubationDetails}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                      Since {new Date(startup.incubatedDate).getFullYear()}
                    </span>
                    {startup.website && (
                      <a
                        href={startup.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 hover:text-orange-600 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ImpactSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Our Impact
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full" />
        </div>

        {/* Stats - Clean Layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          <div className="text-center p-6 sm:p-8">
            <div className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-2">
              07
            </div>
            <div className="text-slate-400 font-medium">Student Startups</div>
          </div>
          <div className="text-center p-6 sm:p-8">
            <div className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-2">
              01
            </div>
            <div className="text-slate-400 font-medium">Faculty Startups</div>
          </div>
          <div className="text-center p-6 sm:p-8">
            <div className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-2">
              10
            </div>
            <div className="text-slate-400 font-medium">Grants Received</div>
          </div>
          <div className="text-center p-6 sm:p-8">
            <div className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-2">
              48
            </div>
            <div className="text-slate-400 font-medium">Total Incubated</div>
          </div>
        </div>

        {/* Grant Amount - Featured */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 sm:p-10 text-center max-w-2xl mx-auto">
          <p className="text-white/80 text-sm font-medium uppercase tracking-wider mb-2">
            Government & Private Grants
          </p>
          <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white">
            ₹ 28.75 Lakh
          </div>
          <p className="text-white/80 mt-2">
            Total funding secured by IISF startups
          </p>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6">
          Ready to Start Your Entrepreneurial Journey?
        </h2>
        <p className="text-slate-600 text-lg mb-10 max-w-2xl mx-auto">
          Join IISF and get access to mentorship, funding opportunities, and a
          thriving startup community at KNIT Sultanpur.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/incubate">
            <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 text-lg font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              Apply for Incubation
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </Link>
          <Link href="/events">
            <button className="inline-flex items-center gap-2 rounded-full border-2 border-slate-200 bg-white px-8 py-4 text-lg font-bold text-slate-700 hover:border-orange-300 hover:bg-orange-50 transition-all duration-300">
              Explore Events
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  const teamMembers = [
    {
      image: "/director.png",
      name: "Prof. RK Upadhyay",
      post: "Director, KNIT Sultanpur",
    },
    {
      image: "/prof. incharge.png",
      name: "Prof. Anil Kumar",
      post: "Professor Incharge, IISF",
    },
    {
      image: "/mayank.jpeg",
      name: "Mr. Mayank Srivastava",
      post: "IISF, KNIT Sultanpur",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
            Meet the Leaders
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900">
            Our Team
          </h2>
        </div>

        {/* Team Members Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="relative mb-6">
                <div className="absolute -inset-3 bg-gradient-to-br from-orange-200 via-amber-100 to-blue-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {member.name}
              </h3>
              <p className="text-orange-600 font-medium">{member.post}</p>
            </div>
          ))}
        </div>

        {/* Director's and Convenor's Desk */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Director's Desk */}
          <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-white rounded-3xl p-8 sm:p-10 border border-orange-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-200/40 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-200/40 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-12 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full" />
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  FROM THE DIRECTOR&apos;S DESK
                </h3>
              </div>
              <div className="relative">
                <svg
                  className="absolute -top-2 -left-2 w-8 h-8 text-orange-200"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-slate-600 text-lg leading-relaxed pl-8 italic">
                  Advice is like a snow flake—the softer it falls, the longer it
                  dwells upon, and the deeper it sinks into mind. My only advice
                  to all our members is to not only dream but also achieve,
                  become a perfect combination of a doer and a dreamer. One
                  needs three things to create a successful start-up: to start
                  with good people, to make something people actually want, to
                  spend as little money as possible, and this cell is place
                  where your ideas can build up in reality, if you try.
                </p>
              </div>
            </div>
          </div>

          {/* Convenor's Desk */}
          <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-white rounded-3xl p-8 sm:p-10 border border-blue-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-200/40 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-200/40 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-12 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  FROM THE CONVENOR&apos;S DESK
                </h3>
              </div>
              <div className="relative">
                <svg
                  className="absolute -top-2 -left-2 w-8 h-8 text-blue-200"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-slate-600 text-lg leading-relaxed pl-8 italic">
                  Nurturing ideas and inspiring innovation are the key elements
                  behind a successful startup and this purpose is served by our
                  Innovation, Incubation and Star-up cell. The cell&apos;s work
                  is commendable and inspirational for the students, later to
                  achieve brilliance in the future. The cell gives them the
                  courage to present their ideas among people and they also get
                  to know and meet different other start-ups out there in the
                  world which motivates them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      <Navbar />
      <UpcomingEventsAd />
      <main className="pt-16 sm:pt-20">
        <HeroSection />
        <VisionSection />
        <FacilitiesSection />
        <ImpactSection />
        <CTASection />
        <TeamSection />
      </main>
      <Footer />
    </div>
  );
}

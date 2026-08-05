"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import confetti from "canvas-confetti";
import { User, Lightbulb, MapPin, Handshake, Brain, Wrench, TrendingUp, Target, Monitor, Wallet, Building2, PartyPopper, Rocket } from "lucide-react";

interface FormData {
  // Basic Info
  startupName: string;
  founderName: string;
  founderEmail: string;
  founderPhone: string;
  founderCollege: string;
  founderYear: string;
  founderBranch: string;
  teamSize: number;
  // Problem & Solution
  problemStatement: string;
  proposedSolution: string;
  uniqueSellingPoint: string;
  // Current Stage
  currentStage: "idea" | "mvp" | "early-traction" | "";
  // Support Needed
  supportNeeded: string[];
  additionalInfo: string;
}

const sections = [
  {
    id: 1,
    title: "Basic Information",
    subtitle: "Tell us about you",
    Icon: User,
  },
  { id: 2, title: "Problem & Solution", subtitle: "Your big idea", Icon: Lightbulb },
  { id: 3, title: "Current Stage", subtitle: "Where are you now?", Icon: MapPin },
  { id: 4, title: "Support Needed", subtitle: "How can we help?", Icon: Handshake },
];

const years = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "Alumni",
  "Faculty",
];
const branches = [
  "Computer Science & Engineering",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Information Technology",
  "Chemical Engineering",
  "Other",
];

const stages = [
  {
    id: "idea",
    label: "Idea Stage",
    description: "Just in your mind",
    Icon: Brain,
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: "mvp",
    label: "MVP/Prototype",
    description: "Basic model ready",
    Icon: Wrench,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "early-traction",
    label: "Early Traction",
    description: "Some users already",
    Icon: TrendingUp,
    color: "from-green-500 to-emerald-500",
  },
];

const supportOptions = [
  {
    id: "mentorship",
    label: "Mentorship",
    description: "Expert guidance",
    Icon: Target,
  },
  {
    id: "technical",
    label: "Technical Help",
    description: "Development support",
    Icon: Monitor,
  },
  {
    id: "funding",
    label: "Funding",
    description: "Financial support",
    Icon: Wallet,
  },
  {
    id: "coworking",
    label: "Co-working Space",
    description: "Workspace access",
    Icon: Building2,
  },
];

export default function IncubatePage() {
  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    startupName: "",
    founderName: "",
    founderEmail: "",
    founderPhone: "",
    founderCollege: "",
    founderYear: "",
    founderBranch: "",
    teamSize: 1,
    problemStatement: "",
    proposedSolution: "",
    uniqueSellingPoint: "",
    currentStage: "",
    supportNeeded: [],
    additionalInfo: "",
  });

  const updateFormData = (
    field: keyof FormData,
    value: string | number | string[],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSupport = (supportId: string) => {
    setFormData((prev) => ({
      ...prev,
      supportNeeded: prev.supportNeeded.includes(supportId)
        ? prev.supportNeeded.filter((s) => s !== supportId)
        : [...prev.supportNeeded, supportId],
    }));
  };

  const validateSection = (section: number): boolean => {
    switch (section) {
      case 1:
        if (!formData.startupName.trim()) {
          toast.error("Please enter your startup name");
          return false;
        }
        if (!formData.founderName.trim()) {
          toast.error("Please enter your name");
          return false;
        }
        if (
          !formData.founderEmail.trim() ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.founderEmail)
        ) {
          toast.error("Please enter a valid email");
          return false;
        }
        if (
          !formData.founderPhone.trim() ||
          !/^\d{10}$/.test(formData.founderPhone.replace(/\D/g, ""))
        ) {
          toast.error("Please enter a valid 10-digit phone number");
          return false;
        }
        if (!formData.founderCollege.trim()) {
          toast.error("Please enter your college name");
          return false;
        }
        if (!formData.founderYear) {
          toast.error("Please select your year");
          return false;
        }
        if (!formData.founderBranch) {
          toast.error("Please select your branch");
          return false;
        }
        return true;
      case 2:
        if (
          !formData.problemStatement.trim() ||
          formData.problemStatement.length < 20
        ) {
          toast.error("Problem statement should be at least 20 characters");
          return false;
        }
        if (
          !formData.proposedSolution.trim() ||
          formData.proposedSolution.length < 20
        ) {
          toast.error("Proposed solution should be at least 20 characters");
          return false;
        }
        if (
          !formData.uniqueSellingPoint.trim() ||
          formData.uniqueSellingPoint.length < 10
        ) {
          toast.error("USP should be at least 10 characters");
          return false;
        }
        return true;
      case 3:
        if (!formData.currentStage) {
          toast.error("Please select your current stage");
          return false;
        }
        return true;
      case 4:
        if (formData.supportNeeded.length === 0) {
          toast.error("Please select at least one type of support");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      setCurrentSection((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setCurrentSection((prev) => Math.max(prev - 1, 1));
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#f97316", "#fbbf24", "#22c55e"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#f97316", "#fbbf24", "#22c55e"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleSubmit = async () => {
    if (!validateSection(currentSection)) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/incubation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        triggerConfetti();
        toast.success("Application submitted successfully!");
      } else {
        toast.error(data.error || "Failed to submit application");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (currentSection / 4) * 100;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen px-4 pt-20">
          <div className="max-w-lg w-full text-center">
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
              <PartyPopper className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
              Application Submitted!
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Thank you for applying to IISF Incubation Program. We&apos;ll
              review your application and get back to you within 7 working days.
            </p>
            <a
              href="/startup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30 hover:scale-105 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
            >
              Explore Incubated Startups
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
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.08),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none" />

      <div className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-600 backdrop-blur-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              IISF Incubation Program
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
              <span className="text-slate-900">Apply for </span>
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                Incubation
              </span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Take the first step towards turning your idea into reality. Fill
              out this form and join our growing community of innovators.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    if (section.id < currentSection) {
                      setCurrentSection(section.id);
                    }
                  }}
                  className={`flex flex-col items-center relative ${
                    section.id <= currentSection
                      ? "cursor-pointer"
                      : "cursor-not-allowed"
                  }`}
                >
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl mb-2 transition-all duration-300 ${
                      section.id === currentSection
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30 text-white"
                        : section.id < currentSection
                          ? "bg-green-500 shadow-lg shadow-green-500/30 text-white"
                          : "bg-slate-100 border-2 border-slate-200 text-slate-400"
                    }`}
                  >
                    {section.id < currentSection ? (
                      <span className="text-white text-lg font-bold">✓</span>
                    ) : (
                      <section.Icon className="w-6 h-6" />
                    )}
                  </div>
                  <span
                    className={`hidden sm:block text-xs font-medium ${
                      section.id === currentSection
                        ? "text-orange-600"
                        : "text-slate-500"
                    }`}
                  >
                    {section.title}
                  </span>
                </button>
              ))}
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            {/* Section Header */}
            <div className="bg-gradient-to-r from-slate-50 to-white px-6 sm:px-8 py-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center text-orange-500">
                  {(() => { const SectionIcon = sections[currentSection - 1].Icon; return <SectionIcon className="w-7 h-7" />; })()}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {sections[currentSection - 1].title}
                  </h2>
                  <p className="text-slate-500">
                    {sections[currentSection - 1].subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 sm:p-8">
              {/* Section 1: Basic Information */}
              {currentSection === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Startup Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.startupName}
                      onChange={(e) =>
                        updateFormData("startupName", e.target.value)
                      }
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all"
                      placeholder="Enter your startup name (or working title)"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.founderName}
                        onChange={(e) =>
                          updateFormData("founderName", e.target.value)
                        }
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.founderEmail}
                        onChange={(e) =>
                          updateFormData("founderEmail", e.target.value)
                        }
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.founderPhone}
                        onChange={(e) =>
                          updateFormData("founderPhone", e.target.value)
                        }
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all"
                        placeholder="10-digit phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        College <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.founderCollege}
                        onChange={(e) =>
                          updateFormData("founderCollege", e.target.value)
                        }
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all"
                        placeholder="Your college name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Year <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.founderYear}
                        onChange={(e) =>
                          updateFormData("founderYear", e.target.value)
                        }
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all"
                      >
                        <option value="">Select Year</option>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Branch <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.founderBranch}
                        onChange={(e) =>
                          updateFormData("founderBranch", e.target.value)
                        }
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all"
                      >
                        <option value="">Select Branch</option>
                        {branches.map((branch) => (
                          <option key={branch} value={branch}>
                            {branch}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Team Size <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            updateFormData(
                              "teamSize",
                              Math.max(1, formData.teamSize - 1),
                            )
                          }
                          className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 font-bold text-xl hover:bg-slate-200 active:scale-95 transition"
                        >
                          -
                        </button>
                        <span className="w-12 text-center text-2xl font-bold text-slate-900">
                          {formData.teamSize}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateFormData(
                              "teamSize",
                              Math.min(10, formData.teamSize + 1),
                            )
                          }
                          className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 font-bold text-xl hover:bg-slate-200 active:scale-95 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 2: Problem & Solution */}
              {currentSection === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Problem Statement <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-slate-500 mb-2">
                      What problem are you trying to solve?
                    </p>
                    <textarea
                      value={formData.problemStatement}
                      onChange={(e) =>
                        updateFormData("problemStatement", e.target.value)
                      }
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all resize-none"
                      rows={4}
                      placeholder="Describe the problem you're solving in detail..."
                    />
                    <p
                      className={`text-xs mt-1 ${formData.problemStatement.length >= 20 ? "text-green-600" : "text-slate-400"}`}
                    >
                      {formData.problemStatement.length}/20 characters minimum
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Proposed Solution <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-slate-500 mb-2">
                      What&apos;s your product or service?
                    </p>
                    <textarea
                      value={formData.proposedSolution}
                      onChange={(e) =>
                        updateFormData("proposedSolution", e.target.value)
                      }
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all resize-none"
                      rows={4}
                      placeholder="Explain your solution and how it works..."
                    />
                    <p
                      className={`text-xs mt-1 ${formData.proposedSolution.length >= 20 ? "text-green-600" : "text-slate-400"}`}
                    >
                      {formData.proposedSolution.length}/20 characters minimum
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Unique Selling Point (USP){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-slate-500 mb-2">
                      What makes you different from others?
                    </p>
                    <textarea
                      value={formData.uniqueSellingPoint}
                      onChange={(e) =>
                        updateFormData("uniqueSellingPoint", e.target.value)
                      }
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all resize-none"
                      rows={3}
                      placeholder="What's your competitive advantage?"
                    />
                    <p
                      className={`text-xs mt-1 ${formData.uniqueSellingPoint.length >= 10 ? "text-green-600" : "text-slate-400"}`}
                    >
                      {formData.uniqueSellingPoint.length}/10 characters minimum
                    </p>
                  </div>
                </div>
              )}

              {/* Section 3: Current Stage */}
              {currentSection === 3 && (
                <div className="space-y-6">
                  <p className="text-slate-600 mb-6">
                    Select the stage that best describes where your startup is
                    right now:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {stages.map((stage) => (
                      <button
                        key={stage.id}
                        type="button"
                        onClick={() => updateFormData("currentStage", stage.id)}
                        className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] ${
                          formData.currentStage === stage.id
                            ? "border-orange-500 bg-gradient-to-br from-orange-500/10 to-amber-500/10"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        {formData.currentStage === stage.id && (
                          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                            <span className="text-white text-sm">✓</span>
                          </div>
                        )}
                        <div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stage.color} flex items-center justify-center mb-4 text-white`}
                        >
                          <stage.Icon className="w-7 h-7" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg mb-1">
                          {stage.label}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {stage.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 4: Support Needed */}
              {currentSection === 4 && (
                <div className="space-y-6">
                  <p className="text-slate-600 mb-6">
                    Select all the types of support you need (you can select
                    multiple):
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {supportOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => toggleSupport(option.id)}
                        className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-[1.02] active:scale-[0.98] ${
                          formData.supportNeeded.includes(option.id)
                            ? "border-orange-500 bg-gradient-to-br from-orange-500/10 to-amber-500/10"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        {formData.supportNeeded.includes(option.id) && (
                          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                            <span className="text-white text-sm">✓</span>
                          </div>
                        )}
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center text-orange-500">
                            <option.Icon className="w-7 h-7" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg">
                              {option.label}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Additional Information (Optional)
                    </label>
                    <textarea
                      value={formData.additionalInfo}
                      onChange={(e) =>
                        updateFormData("additionalInfo", e.target.value)
                      }
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all resize-none"
                      rows={3}
                      placeholder="Anything else you'd like us to know..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="px-6 sm:px-8 py-6 bg-slate-50 border-t border-slate-100">
              <div className="flex justify-between gap-4">
                <button
                  type="button"
                  onClick={handlePrev}
                  className={`px-6 py-3 rounded-xl font-medium transition hover:scale-[1.02] active:scale-[0.98] ${
                    currentSection === 1
                      ? "opacity-0 pointer-events-none"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  ← Previous
                </button>

                {currentSection < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] transition"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Rocket className="w-5 h-5" /> Submit Application
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

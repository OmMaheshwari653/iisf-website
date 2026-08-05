"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Participant {
  id: string;
  name: string;
  rollNo: string;
  gender: string;
  mobile: string;
  email: string;
}

interface RegistrationFormProps {
  eventName?: string;
  eventSlug?: string;
  eventDescription?: string;
  eventDate?: string;
  eventImage?: string;
  rulebook?: string;
  whatsappLink?: string;
}

export default function RegistrationForm({
  eventName = "Event",
  eventSlug,
  eventDescription,
  eventDate,
  eventImage,
  rulebook,
  whatsappLink,
}: RegistrationFormProps) {
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationType, setRegistrationType] = useState<
    "individual" | "team" | null
  >(null);
  const [teamName, setTeamName] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([
    { id: "1", name: "", rollNo: "", gender: "", mobile: "", email: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const addParticipant = () => {
    if (participants.length >= 6) return;
    setParticipants([
      ...participants,
      {
        id: Date.now().toString(),
        name: "",
        rollNo: "",
        gender: "",
        mobile: "",
        email: "",
      },
    ]);
  };

  const removeParticipant = (id: string) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((p) => p.id !== id));
    }
  };

  const updateParticipant = (
    id: string,
    field: keyof Participant,
    value: string,
  ) => {
    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const participationType =
        registrationType === "individual" ? "solo" : "team";
      const [firstParticipant, ...restParticipants] = participants;

      const requestData = {
        participationType,
        teamName: registrationType === "team" ? teamName : undefined,
        leaderName: firstParticipant.name,
        leaderGender: firstParticipant.gender,
        leaderRollNumber: firstParticipant.rollNo,
        leaderContactNumber: firstParticipant.mobile,
        leaderEmail: firstParticipant.email,
        teamMembers:
          registrationType === "team"
            ? restParticipants.map((p) => ({
                name: p.name,
                gender: p.gender,
                rollNumber: p.rollNo,
                contactNumber: p.mobile,
                email: p.email,
              }))
            : [],
      };

      const response = await fetch(
        `/api/registrations/${encodeURIComponent(eventName)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        },
      );

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Registration successful!");
        setMessage({
          type: "success",
          text: data.message || "Registration successful!",
        });
        setRegistrationType(null);
        setTeamName("");
        setParticipants([
          { id: "1", name: "", rollNo: "", gender: "", mobile: "", email: "" },
        ]);
      } else {
        toast.error(data.error || "Registration failed");
        setMessage({
          type: "error",
          text: data.error || "Registration failed",
        });
      }
    } catch {
      toast.error("Network error. Please try again.");
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleTypeSelection = (type: "individual" | "team") => {
    setRegistrationType(type);
    setParticipants([
      { id: "1", name: "", rollNo: "", gender: "", mobile: "", email: "" },
    ]);
    if (type === "individual") {
      setTeamName("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      {!showRegistration ? (
        /* Event Details Section */
        <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Event Image - 4:5 Poster Ratio */}
            <div className="relative w-full aspect-[4/5] max-h-[600px] rounded-2xl overflow-hidden mb-8 shadow-2xl">
              {eventImage ? (
                <img
                  src={eventImage}
                  alt={eventName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center">
                  <span className="text-9xl font-black text-orange-500/30">
                    {eventName.charAt(0)}
                  </span>
                </div>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {/* Event Date Badge */}
              {eventDate && (
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
                  <p className="text-sm font-bold text-orange-600">
                    {eventDate}
                  </p>
                </div>
              )}
            </div>

            {/* Event Name */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-center mb-6">
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                {eventName}
              </span>
            </h1>

            {/* Event Description */}
            {eventDescription && (
              <p className="text-lg text-slate-600 text-center max-w-2xl mx-auto mb-8">
                {eventDescription}
              </p>
            )}

            {/* Rulebook Section */}
            {rulebook && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
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
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Rules & Guidelines
                  </h2>
                </div>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 whitespace-pre-wrap">
                    {rulebook}
                  </p>
                </div>
              </div>
            )}

            {/* WhatsApp Button */}
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full mb-8"
              >
                <button className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Join WhatsApp Group
                </button>
              </a>
            )}

            {/* Register Button */}
            <button
              onClick={() => setShowRegistration(true)}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-lg shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3"
            >
              Register Now
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
          </div>
        </section>
      ) : (
        /* Registration Form Section */
        <>
          {/* Hero Section */}
          <section className="relative pt-24 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.15),transparent_50%)]" />

            <div className="max-w-4xl mx-auto text-center relative z-10">
              <button
                onClick={() => setShowRegistration(false)}
                className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 transition-colors"
              >
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Event Details
              </button>

              <h1 className="text-3xl sm:text-4xl font-black mb-4">
                <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Register for {eventName}
                </span>
              </h1>

              <p className="text-slate-600">
                Fill in your details to register for this event
              </p>
            </div>
          </section>

          {/* Form Section */}
          <section className="py-8 px-4 sm:px-6 lg:px-8 pb-20">
            <div className="max-w-4xl mx-auto">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
                <div className="p-6 sm:p-8 md:p-10">
                  {message && (
                    <div
                      className={`mb-6 p-4 rounded-xl ${
                        message.type === "success"
                          ? "bg-emerald-100 border border-emerald-300 text-emerald-700"
                          : "bg-red-100 border border-red-300 text-red-700"
                      }`}
                    >
                      {message.text}
                    </div>
                  )}

                  {!registrationType ? (
                    <div className="py-8">
                      <h2 className="text-xl font-bold text-slate-900 text-center mb-8">
                        Choose Registration Type
                      </h2>
                      <div className="flex flex-col gap-4 sm:gap-6 sm:flex-row justify-center items-center">
                        <button
                          onClick={() => handleTypeSelection("individual")}
                          className="flex flex-col items-center justify-center w-full sm:w-64 h-44 rounded-2xl border-2 border-slate-200 bg-white hover:border-orange-500/50 hover:bg-slate-50 hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] transition-all group shadow-sm"
                        >
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center mb-4 group-hover:from-orange-500/30 group-hover:to-amber-500/30 transition-colors">
                            <svg
                              className="w-8 h-8 text-orange-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <span className="text-lg font-bold text-slate-900 group-hover:text-orange-500 transition-colors">
                            Individual
                          </span>
                          <span className="text-sm text-slate-500 mt-1">
                            Register as solo participant
                          </span>
                        </button>

                        <button
                          onClick={() => handleTypeSelection("team")}
                          className="flex flex-col items-center justify-center w-full sm:w-64 h-44 rounded-2xl border-2 border-slate-200 bg-white hover:border-blue-500/50 hover:bg-slate-50 hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] transition-all group shadow-sm"
                        >
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-colors">
                            <svg
                              className="w-8 h-8 text-blue-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                          </div>
                          <span className="text-lg font-bold text-slate-900 group-hover:text-blue-500 transition-colors">
                            Team
                          </span>
                          <span className="text-sm text-slate-500 mt-1">
                            Register with your team
                          </span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Back button */}
                      <button
                        type="button"
                        onClick={() => setRegistrationType(null)}
                        className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors"
                      >
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
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        Back to selection
                      </button>

                      {/* Team Name */}
                      {registrationType === "team" && (
                        <div className="space-y-2">
                          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">
                            Team Information
                          </h3>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Team Name
                            </label>
                            <input
                              type="text"
                              placeholder="Enter your team name"
                              value={teamName}
                              onChange={(e) => setTeamName(e.target.value)}
                              required
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                            />
                          </div>
                        </div>
                      )}

                      {/* Participants */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                          <h3 className="text-lg font-bold text-slate-900">
                            {registrationType === "individual"
                              ? "Participant Details"
                              : "Team Members"}
                          </h3>
                          {registrationType === "team" && (
                            <button
                              type="button"
                              onClick={addParticipant}
                              disabled={participants.length >= 6}
                              className="px-4 py-2 rounded-lg border border-orange-500/50 text-orange-400 text-sm font-medium hover:bg-orange-500/10 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              + Add Member {participants.length >= 6 ? "(Max 6)" : ""}
                            </button>
                          )}
                        </div>

                        {participants.map((participant, index) => (
                          <div
                            key={participant.id}
                            className="p-5 rounded-xl bg-slate-50 border border-slate-200"
                          >
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-sm font-medium text-orange-600">
                                {registrationType === "individual"
                                  ? "Your Information"
                                  : index === 0
                                    ? "Team Leader"
                                    : `Member ${index + 1}`}
                              </span>
                              {registrationType === "team" &&
                                participants.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeParticipant(participant.id)
                                    }
                                    className="text-red-400 hover:text-red-300 text-sm"
                                  >
                                    Remove
                                  </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                                  Full Name
                                </label>
                                <input
                                  type="text"
                                  placeholder="John Doe"
                                  value={participant.name}
                                  onChange={(e) =>
                                    updateParticipant(
                                      participant.id,
                                      "name",
                                      e.target.value,
                                    )
                                  }
                                  required
                                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                                  Roll Number
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. 123456"
                                  value={participant.rollNo}
                                  onChange={(e) =>
                                    updateParticipant(
                                      participant.id,
                                      "rollNo",
                                      e.target.value,
                                    )
                                  }
                                  required
                                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                                  Gender
                                </label>
                                <select
                                  value={participant.gender}
                                  onChange={(e) =>
                                    updateParticipant(
                                      participant.id,
                                      "gender",
                                      e.target.value,
                                    )
                                  }
                                  required
                                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
                                >
                                  <option
                                    value=""
                                    className="bg-white text-slate-900"
                                  >
                                    Select Gender
                                  </option>
                                  <option
                                    value="Male"
                                    className="bg-white text-slate-900"
                                  >
                                    Male
                                  </option>
                                  <option
                                    value="Female"
                                    className="bg-white text-slate-900"
                                  >
                                    Female
                                  </option>
                                  <option
                                    value="Other"
                                    className="bg-white text-slate-900"
                                  >
                                    Other
                                  </option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                                  Mobile Number
                                </label>
                                <input
                                  type="tel"
                                  placeholder="9876543210"
                                  value={participant.mobile}
                                  onChange={(e) =>
                                    updateParticipant(
                                      participant.id,
                                      "mobile",
                                      e.target.value,
                                    )
                                  }
                                  required
                                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
                                />
                              </div>

                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                                  Email
                                </label>
                                <input
                                  type="email"
                                  placeholder="john@example.com"
                                  value={participant.email}
                                  onChange={(e) =>
                                    updateParticipant(
                                      participant.id,
                                      "email",
                                      e.target.value,
                                    )
                                  }
                                  required
                                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
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
                          "Submit Registration"
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}

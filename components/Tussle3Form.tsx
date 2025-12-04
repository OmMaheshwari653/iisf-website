"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface Participant {
  id: string;
  name: string;
  rollNo: string;
  gender: string;
  mobile: string;
  email: string;
}

interface Tussle3FormProps {
  eventName?: string;
}

export default function Tussle3Form({ eventName = "Event" }: Tussle3FormProps) {
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
    value: string
  ) => {
    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Prepare data in the format expected by the API
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
        `/api/v1/form/${encodeURIComponent(eventName)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: data.message || "Registration successful!",
        });
        // Reset form
        setRegistrationType(null);
        setTeamName("");
        setParticipants([
          { id: "1", name: "", rollNo: "", gender: "", mobile: "", email: "" },
        ]);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Registration failed",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="mb-10 text-center relative">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight inline-block relative">
                {eventName} Registration
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-orange-500 rounded-full opacity-80"></div>
              </h1>
              <p className="mt-4 text-gray-600">
                Register for the upcoming event.
              </p>
            </div>
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {message.text}
              </div>
            )}{" "}
            {!registrationType ? (
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center py-12">
                <button
                  onClick={() => handleTypeSelection("individual")}
                  className="flex flex-col items-center justify-center w-64 h-48 bg-white border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:shadow-lg transition-all group"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-500/10 transition-colors">
                    <svg
                      className="w-8 h-8 text-gray-500 group-hover:text-orange-500"
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
                  <span className="text-lg font-semibold text-gray-900 group-hover:text-orange-500">
                    Register as Individual
                  </span>
                </button>

                <button
                  onClick={() => handleTypeSelection("team")}
                  className="flex flex-col items-center justify-center w-64 h-48 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all group"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500/10 transition-colors">
                    <svg
                      className="w-8 h-8 text-gray-500 group-hover:text-blue-500"
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
                  <span className="text-lg font-semibold text-gray-900 group-hover:text-blue-500">
                    Register as Team
                  </span>
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <div className="flex justify-start">
                  <button
                    type="button"
                    onClick={() => setRegistrationType(null)}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    ← Back to selection
                  </button>
                </div>

                {registrationType === "team" && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                      Team Information
                    </h2>
                    <Input
                      label="Team Name"
                      placeholder="Enter your team name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {registrationType === "individual"
                        ? "Participant Details"
                        : "Team Members"}
                    </h2>
                    {registrationType === "team" && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addParticipant}
                        className="text-orange-500 border-orange-500 hover:bg-orange-500/10"
                      >
                        + Add Member
                      </Button>
                    )}
                  </div>

                  {participants.map((participant, index) => (
                    <div
                      key={participant.id}
                      className="p-6 bg-gray-50 rounded-xl border border-gray-200 relative transition-all hover:shadow-md"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-gray-900">
                          {registrationType === "individual"
                            ? "Participant Information"
                            : `Member ${index + 1}`}
                        </h3>
                        {registrationType === "team" &&
                          participants.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeParticipant(participant.id)}
                              className="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                              Remove
                            </button>
                          )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Full Name"
                          placeholder="John Doe"
                          value={participant.name}
                          onChange={(e) =>
                            updateParticipant(
                              participant.id,
                              "name",
                              e.target.value
                            )
                          }
                          required
                        />
                        <Input
                          label="Roll Number"
                          placeholder="e.g. 123456"
                          value={participant.rollNo}
                          onChange={(e) =>
                            updateParticipant(
                              participant.id,
                              "rollNo",
                              e.target.value
                            )
                          }
                          required
                        />

                        <div className="w-full">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gender
                          </label>
                          <select
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={participant.gender}
                            onChange={(e) =>
                              updateParticipant(
                                participant.id,
                                "gender",
                                e.target.value
                              )
                            }
                            required
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <Input
                          label="Mobile Number"
                          type="tel"
                          placeholder="9876543210"
                          value={participant.mobile}
                          onChange={(e) =>
                            updateParticipant(
                              participant.id,
                              "mobile",
                              e.target.value
                            )
                          }
                          required
                        />

                        <div className="md:col-span-2">
                          <Input
                            label="Email ID"
                            type="email"
                            placeholder="john@example.com"
                            value={participant.email}
                            onChange={(e) =>
                              updateParticipant(
                                participant.id,
                                "email",
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full md:w-auto md:min-w-[200px]"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Registration"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

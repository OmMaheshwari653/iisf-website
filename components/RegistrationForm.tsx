"use client";

import { useState } from "react";

interface TeamMember {
  name: string;
  gender: string;
  rollNumber: string;
  contactNumber: string;
  email: string;
}

interface RegistrationFormProps {
  eventName: string;
}

export default function RegistrationForm({ eventName }: RegistrationFormProps) {
  const [participationType, setParticipationType] = useState<"solo" | "team">(
    "solo"
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Team name state
  const [teamName, setTeamName] = useState("");

  // Leader/Solo participant state
  const [leaderName, setLeaderName] = useState("");
  const [leaderGender, setLeaderGender] = useState("");
  const [leaderRollNumber, setLeaderRollNumber] = useState("");
  const [leaderContactNumber, setLeaderContactNumber] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");

  // Team members state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const addTeamMember = () => {
    if (teamMembers.length < 3) {
      setTeamMembers([
        ...teamMembers,
        { name: "", gender: "", rollNumber: "", contactNumber: "", email: "" },
      ]);
    }
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const updateTeamMember = (
    index: number,
    field: keyof TeamMember,
    value: string
  ) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/v1/form/${encodeURIComponent(eventName)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            participationType,
            teamName: participationType === "team" ? teamName : undefined,
            leaderName,
            leaderGender,
            leaderRollNumber,
            leaderContactNumber,
            leaderEmail,
            teamMembers: participationType === "team" ? teamMembers : [],
          }),
        }
      );

      const data = await response.json();

      console.log("API Response:", data);

      if (data.success) {
        setMessage({ type: "success", text: data.message });
        // Reset form
        setTeamName("");
        setLeaderName("");
        setLeaderGender("");
        setLeaderRollNumber("");
        setLeaderContactNumber("");
        setLeaderEmail("");
        setTeamMembers([]);
        setParticipationType("solo");
      } else {
        const errorMessage = data.error || "Registration failed";
        const errorDetails = data.details ? ` - ${data.details}` : "";
        const errorHint = data.hint ? ` (${data.hint})` : "";
        setMessage({
          type: "error",
          text: errorMessage + errorDetails + errorHint,
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#1E293B]">
        Event Registration: <span className="text-[#1A4DB3]">{eventName}</span>
      </h1>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg border ${message.type === "success"
            ? "bg-green-50 text-green-800 border-green-200"
            : "bg-red-50 text-red-800 border-red-200"
            }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Participation Type */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <label className="block text-lg font-semibold mb-4 text-[#1E293B]">
            Participation Type
          </label>
          <div className="flex gap-8">
            <label className="flex items-center cursor-pointer group">
              <input
                type="radio"
                value="solo"
                checked={participationType === "solo"}
                onChange={() => {
                  setParticipationType("solo");
                  setTeamMembers([]);
                  setTeamName("");
                }}
                className="w-5 h-5 text-[#1A4DB3] accent-[#1A4DB3] focus:ring-[#1A4DB3]"
              />
              <span className="ml-3 text-[#1E293B] font-medium group-hover:text-[#1A4DB3] transition-colors">
                Solo Participation
              </span>
            </label>
            <label className="flex items-center cursor-pointer group">
              <input
                type="radio"
                value="team"
                checked={participationType === "team"}
                onChange={() => setParticipationType("team")}
                className="w-5 h-5 text-[#1A4DB3] accent-[#1A4DB3] focus:ring-[#1A4DB3]"
              />
              <span className="ml-3 text-[#1E293B] font-medium group-hover:text-[#1A4DB3] transition-colors">
                Team Participation
              </span>
            </label>
          </div>
        </div>

        {/* Team Name - Only for Team Participation */}
        {participationType === "team" && (
          <div className="bg-blue-50/30 p-6 rounded-xl border border-blue-100">
            <h2 className="text-xl font-semibold mb-4 text-[#1E293B]">
              Team Information
            </h2>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#64748B]">
                Team Name *
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required={participationType === "team"}
                placeholder="Enter your team name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4DB3] focus:border-transparent bg-white text-[#1E293B] placeholder-gray-400 transition-all shadow-sm"
              />
            </div>
          </div>
        )}

        {/* Leader/Participant Details */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 text-[#1E293B] border-b pb-2 border-gray-100">
            {participationType === "team"
              ? "Team Leader Details"
              : "Participant Details"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-[#64748B]">
                Name *
              </label>
              <input
                type="text"
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4DB3] focus:border-transparent bg-white text-[#1E293B] placeholder-gray-400 transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[#64748B]">
                Gender *
              </label>
              <select
                value={leaderGender}
                onChange={(e) => setLeaderGender(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4DB3] focus:border-transparent bg-white text-[#1E293B] transition-all shadow-sm"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[#64748B]">
                Roll Number *
              </label>
              <input
                type="text"
                value={leaderRollNumber}
                onChange={(e) => setLeaderRollNumber(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4DB3] focus:border-transparent bg-white text-[#1E293B] placeholder-gray-400 transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[#64748B]">
                Contact Number *
              </label>
              <input
                type="tel"
                pattern="[0-9]{10}"
                value={leaderContactNumber}
                onChange={(e) => setLeaderContactNumber(e.target.value)}
                required
                placeholder="10-digit number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4DB3] focus:border-transparent bg-white text-[#1E293B] placeholder-gray-400 transition-all shadow-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-[#64748B]">
                Email *
              </label>
              <input
                type="email"
                value={leaderEmail}
                onChange={(e) => setLeaderEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4DB3] focus:border-transparent bg-white text-[#1E293B] placeholder-gray-400 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Team Members */}
        {participationType === "team" && (
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#1E293B]">
                Team Members ({teamMembers.length}/3)
              </h2>
              <button
                type="button"
                onClick={addTeamMember}
                disabled={teamMembers.length >= 3}
                className="px-5 py-2 bg-[#1A4DB3] text-white font-semibold rounded-full hover:bg-[#F5A623] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                + Add Member
              </button>
            </div>

            {teamMembers.length === 0 && (
              <p className="text-[#64748B] text-sm mb-4 font-medium italic text-center">
                Add at least 1 member (Team size: 2-4 including leader)
              </p>
            )}

            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl mb-4 border border-gray-200 shadow-sm relative"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-[#1E293B]">
                    Member {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeTeamMember(index)}
                    className="text-red-500 hover:text-red-700 font-semibold text-sm transition-colors"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#64748B]">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) =>
                        updateTeamMember(index, "name", e.target.value)
                      }
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4DB3] focus:border-transparent bg-white text-[#1E293B] placeholder-gray-400 transition-all shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#64748B]">
                      Gender *
                    </label>
                    <select
                      value={member.gender}
                      onChange={(e) =>
                        updateTeamMember(index, "gender", e.target.value)
                      }
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4DB3] focus:border-transparent bg-white text-[#1E293B] transition-all shadow-sm"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#64748B]">
                      Roll Number *
                    </label>
                    <input
                      type="text"
                      value={member.rollNumber}
                      onChange={(e) =>
                        updateTeamMember(index, "rollNumber", e.target.value)
                      }
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4DB3] focus:border-transparent bg-white text-[#1E293B] placeholder-gray-400 transition-all shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#64748B]">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      pattern="[0-9]{10}"
                      value={member.contactNumber}
                      onChange={(e) =>
                        updateTeamMember(index, "contactNumber", e.target.value)
                      }
                      required
                      placeholder="10-digit number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4DB3] focus:border-transparent bg-white text-[#1E293B] placeholder-gray-400 transition-all shadow-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-[#64748B]">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={member.email}
                      onChange={(e) =>
                        updateTeamMember(index, "email", e.target.value)
                      }
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4DB3] focus:border-transparent bg-white text-[#1E293B] placeholder-gray-400 transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            loading || (participationType === "team" && teamMembers.length < 1)
          }
          className="w-full py-4 px-6 bg-[#1A4DB3] text-white font-bold rounded-full hover:bg-[#F5A623] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
        >
          {loading ? "Submitting..." : "Register"}
        </button>

        {participationType === "team" && teamMembers.length < 1 && (
          <p className="text-red-500 text-sm text-center font-medium">
            Please add at least 1 team member to register as a team
          </p>
        )}
      </form>
    </div>
  );
}

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
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Event Registration: {eventName}
      </h1>

      {message && (
        <div
          className={`mb-4 p-4 rounded ${message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
            }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Participation Type */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="block text-lg font-semibold mb-3 text-gray-800">
            Participation Type
          </label>
          <div className="flex gap-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="solo"
                checked={participationType === "solo"}
                onChange={() => {
                  setParticipationType("solo");
                  setTeamMembers([]);
                  setTeamName("");
                }}
                className="w-4 h-4 text-blue-600 accent-blue-600"
              />
              <span className="ml-2 text-gray-800 font-medium">
                Solo Participation
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="team"
                checked={participationType === "team"}
                onChange={() => setParticipationType("team")}
                className="w-4 h-4 text-blue-600 accent-blue-600"
              />
              <span className="ml-2 text-gray-800 font-medium">
                Team Participation
              </span>
            </label>
          </div>
        </div>

        {/* Team Name - Only for Team Participation */}
        {participationType === "team" && (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h2 className="text-xl font-semibold mb-3 text-gray-900">
              Team Information
            </h2>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Team Name *
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required={participationType === "team"}
                placeholder="Enter your team name"
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-black placeholder-gray-500"
              />
            </div>
          </div>
        )}

        {/* Leader/Participant Details */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            {participationType === "team"
              ? "Team Leader Details"
              : "Participant Details"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Name *
              </label>
              <input
                type="text"
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Gender *
              </label>
              <select
                value={leaderGender}
                onChange={(e) => setLeaderGender(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Roll Number *
              </label>
              <input
                type="text"
                value={leaderRollNumber}
                onChange={(e) => setLeaderRollNumber(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Contact Number *
              </label>
              <input
                type="tel"
                pattern="[0-9]{10}"
                value={leaderContactNumber}
                onChange={(e) => setLeaderContactNumber(e.target.value)}
                required
                placeholder="10-digit number"
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black placeholder-gray-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Email *
              </label>
              <input
                type="email"
                value={leaderEmail}
                onChange={(e) => setLeaderEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black placeholder-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Team Members */}
        {participationType === "team" && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Team Members ({teamMembers.length}/3)
              </h2>
              <button
                type="button"
                onClick={addTeamMember}
                disabled={teamMembers.length >= 3}
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                + Add Member
              </button>
            </div>

            {teamMembers.length === 0 && (
              <p className="text-gray-700 text-sm mb-4 font-medium">
                Add at least 1 member (Team size: 2-4 including leader)
              </p>
            )}

            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg mb-4 border-2 border-gray-300 shadow-sm"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900">
                    Member {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeTeamMember(index)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-800">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) =>
                        updateTeamMember(index, "name", e.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-800">
                      Gender *
                    </label>
                    <select
                      value={member.gender}
                      onChange={(e) =>
                        updateTeamMember(index, "gender", e.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-800">
                      Roll Number *
                    </label>
                    <input
                      type="text"
                      value={member.rollNumber}
                      onChange={(e) =>
                        updateTeamMember(index, "rollNumber", e.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-800">
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
                      className="w-full px-3 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black placeholder-gray-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1 text-gray-800">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={member.email}
                      onChange={(e) =>
                        updateTeamMember(index, "email", e.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black placeholder-gray-500"
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
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-lg"
        >
          {loading ? "Submitting..." : "Register"}
        </button>

        {participationType === "team" && teamMembers.length < 1 && (
          <p className="text-red-600 text-sm text-center">
            Please add at least 1 team member to register as a team
          </p>
        )}
      </form>
    </div>
  );
}

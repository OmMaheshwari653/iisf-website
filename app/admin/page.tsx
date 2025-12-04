"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

interface Event {
  _id: string;
  name: string;
  slug: string;
  description: string;
  date: string;
  isActive: boolean;
}

interface Participant {
  _id: string;
  name: string;
  email: string;
  rollNumber: string;
  contactNumber: string;
  gender: string;
  isLeader: boolean;
}

interface DetailedRegistration {
  _id: string;
  eventName: string;
  isTeam: boolean;
  teamName?: string;
  totalParticipants: number;
  participants: Participant[];
  createdAt: Date;
}

interface EventDetails {
  stats: {
    totalRegistrations: number;
    individualCount: number;
    teamCount: number;
    totalParticipants: number;
  };
  registrations: DetailedRegistration[];
}

interface EventStats {
  eventName: string;
  totalRegistrations: number;
  individualCount: number;
  teamCount: number;
  totalParticipants: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<EventStats[]>([]);
  const [eventDetails, setEventDetails] = useState<{
    [key: string]: EventDetails;
  }>({});
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, statsRes] = await Promise.all([
        fetch("/api/admin/events"),
        fetch("/api/admin/stats"),
      ]);

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData.data || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventDetails = async (eventName: string) => {
    try {
      const response = await fetch(
        `/api/admin/events/${encodeURIComponent(eventName)}`
      );
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setEventDetails((prev) => ({ ...prev, [eventName]: result.data }));
        }
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  const toggleEventExpanded = (eventName: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventName)) {
      newExpanded.delete(eventName);
    } else {
      newExpanded.add(eventName);
      if (!eventDetails[eventName]) {
        fetchEventDetails(eventName);
      }
    }
    setExpandedEvents(newExpanded);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin-login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-gray-600">
                Manage events and view analytics
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Events</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {events.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">
              Total Registrations
            </h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.reduce((sum, s) => sum + s.totalRegistrations, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">
              Total Participants
            </h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.reduce((sum, s) => sum + s.totalParticipants, 0)}
            </p>
          </div>
        </div>

        {/* Events Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Events</h2>
            <button
              onClick={() => setShowEventForm(true)}
              style={{ backgroundColor: "#2563eb" }}
              className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition font-medium"
            >
              + Add New Event
            </button>
          </div>

          <div className="p-6">
            {events.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No events yet. Create your first event!
              </p>
            ) : (
              <div className="space-y-4">
                {events.map((event) => {
                  const eventStat = stats.find(
                    (s) => s.eventName === event.name
                  );
                  return (
                    <div
                      key={event._id}
                      className="border rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {event.name}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded ${
                                event.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {event.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">
                            {event.description}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            📅 {event.date}
                          </p>
                        </div>
                        {eventStat && (
                          <div className="ml-4 text-right">
                            <p className="text-2xl font-bold text-blue-600">
                              {eventStat.totalRegistrations}
                            </p>
                            <p className="text-xs text-gray-500">
                              registrations
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {eventStat.individualCount} solo |{" "}
                              {eventStat.teamCount} teams
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Event Registration Details */}
        {stats.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                Detailed Registration Data
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Click on an event to view participant details
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden"
                  >
                    {/* Event Header - Clickable */}
                    <div
                      onClick={() => toggleEventExpanded(stat.eventName)}
                      className="bg-gray-50 px-6 py-4 cursor-pointer hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {expandedEvents.has(stat.eventName) ? "▼" : "▶"}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {stat.eventName}
                          </h3>
                        </div>
                        <div className="flex gap-6 text-sm">
                          <div className="text-center">
                            <p className="text-gray-600">Registrations</p>
                            <p className="font-bold text-blue-600">
                              {stat.totalRegistrations}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600">Participants</p>
                            <p className="font-bold text-orange-600">
                              {stat.totalParticipants}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600">Solo</p>
                            <p className="font-bold text-green-600">
                              {stat.individualCount}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600">Teams</p>
                            <p className="font-bold text-purple-600">
                              {stat.teamCount}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedEvents.has(stat.eventName) && (
                      <div className="p-6 bg-white">
                        {!eventDetails[stat.eventName] ? (
                          <div className="text-center py-8 text-gray-500">
                            Loading details...
                          </div>
                        ) : eventDetails[stat.eventName].registrations
                            .length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            No registrations yet
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {eventDetails[stat.eventName].registrations.map(
                              (reg, regIndex) => (
                                <div
                                  key={reg._id}
                                  className="border rounded-lg p-4 bg-gray-50"
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-900">
                                          {reg.isTeam ? (
                                            <>🏆 Team: {reg.teamName}</>
                                          ) : (
                                            <>👤 Individual Registration</>
                                          )}
                                        </span>
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                          {reg.participants.length} participant
                                          {reg.participants.length !== 1
                                            ? "s"
                                            : ""}
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-500 mt-1">
                                        Registered:{" "}
                                        {new Date(
                                          reg.createdAt
                                        ).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Participants Table */}
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                      <thead className="bg-gray-200">
                                        <tr>
                                          <th className="px-3 py-2 text-left font-medium text-gray-700">
                                            Name
                                          </th>
                                          <th className="px-3 py-2 text-left font-medium text-gray-700">
                                            Email
                                          </th>
                                          <th className="px-3 py-2 text-left font-medium text-gray-700">
                                            Roll No
                                          </th>
                                          <th className="px-3 py-2 text-left font-medium text-gray-700">
                                            Contact
                                          </th>
                                          <th className="px-3 py-2 text-left font-medium text-gray-700">
                                            Gender
                                          </th>
                                          <th className="px-3 py-2 text-left font-medium text-gray-700">
                                            Role
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="bg-white">
                                        {reg.participants.map(
                                          (participant, pIndex) => (
                                            <tr
                                              key={participant._id}
                                              className="border-t hover:bg-gray-50"
                                            >
                                              <td className="px-3 py-2 text-gray-900">
                                                {participant.name}
                                              </td>
                                              <td className="px-3 py-2 text-gray-700">
                                                {participant.email}
                                              </td>
                                              <td className="px-3 py-2 text-gray-700">
                                                {participant.rollNumber}
                                              </td>
                                              <td className="px-3 py-2 text-gray-700">
                                                {participant.contactNumber}
                                              </td>
                                              <td className="px-3 py-2 text-gray-700">
                                                {participant.gender}
                                              </td>
                                              <td className="px-3 py-2">
                                                {participant.isLeader ? (
                                                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-medium">
                                                    Leader
                                                  </span>
                                                ) : (
                                                  <span className="text-gray-500 text-xs">
                                                    Member
                                                  </span>
                                                )}
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Event Form Modal */}
      {showEventForm && (
        <EventFormModal
          onClose={() => {
            setShowEventForm(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

function EventFormModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    date: "",
    maxTeamSize: 4,
    minTeamSize: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onClose();
      } else {
        setError(data.error || "Failed to create event");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Add New Event</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  name: e.target.value,
                  slug: generateSlug(e.target.value),
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              URL: /register/{formData.slug}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="text"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              placeholder="e.g., January 15-17, 2025"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Team Size
              </label>
              <input
                type="number"
                value={formData.minTeamSize}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minTeamSize: parseInt(e.target.value),
                  })
                }
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Team Size
              </label>
              <input
                type="number"
                value={formData.maxTeamSize}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxTeamSize: parseInt(e.target.value),
                  })
                }
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: "#2563eb" }}
              className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 transition font-medium disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

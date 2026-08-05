"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Calendar, Trash2, Trophy, User, Camera } from "lucide-react";

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

interface DeleteDialogState {
  isOpen: boolean;
  type: "event" | "registration" | "participant" | null;
  title: string;
  message: string;
  itemId: string;
  eventName: string;
}

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<EventStats[]>([]);
  const [eventDetails, setEventDetails] = useState<{
    [key: string]: EventDetails;
  }>({});
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    isOpen: false,
    type: null,
    title: "",
    message: "",
    itemId: "",
    eventName: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, statsRes] = await Promise.all([
        fetch("/api/events"),
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
        `/api/events/${encodeURIComponent(eventName)}`,
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
    await fetch("/api/auth", { method: "DELETE" });
    toast.success("Logged out successfully");
    router.push("/admin-login");
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      type: null,
      title: "",
      message: "",
      itemId: "",
      eventName: "",
    });
  };

  const openDeleteEventDialog = (eventName: string) => {
    setDeleteDialog({
      isOpen: true,
      type: "event",
      title: "Delete Event",
      message: `Are you sure you want to delete "${eventName}"? This will permanently remove the event and all its registrations.`,
      itemId: eventName,
      eventName: eventName,
    });
  };

  const openDeleteRegistrationDialog = (
    registrationId: string,
    eventName: string,
    teamName?: string,
  ) => {
    setDeleteDialog({
      isOpen: true,
      type: "registration",
      title: "Delete Registration",
      message: teamName
        ? `Are you sure you want to delete team "${teamName}"? All team members will be removed.`
        : "Are you sure you want to delete this individual registration?",
      itemId: registrationId,
      eventName: eventName,
    });
  };

  const openDeleteParticipantDialog = (
    participantId: string,
    eventName: string,
    participantName: string,
  ) => {
    setDeleteDialog({
      isOpen: true,
      type: "participant",
      title: "Remove Team Member",
      message: `Are you sure you want to remove "${participantName}" from the team?`,
      itemId: participantId,
      eventName: eventName,
    });
  };

  const handleConfirmDelete = async () => {
    const { type, itemId, eventName } = deleteDialog;
    closeDeleteDialog();

    if (type === "event") {
      await executeDeleteEvent(itemId);
    } else if (type === "registration") {
      await executeDeleteRegistration(itemId, eventName);
    } else if (type === "participant") {
      await executeDeleteParticipant(itemId, eventName);
    }
  };

  const executeDeleteEvent = async (eventName: string) => {
    try {
      const response = await fetch(
        `/api/events/${encodeURIComponent(eventName)}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      const data = await response.json();

      if (data.success) {
        toast.success("Event deleted successfully!");
        fetchData();
        setExpandedEvents((prev) => {
          const newSet = new Set(prev);
          newSet.delete(eventName);
          return newSet;
        });
      } else {
        toast.error(data.error || "Failed to delete event");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
  };

  const executeDeleteRegistration = async (
    registrationId: string,
    eventName: string,
  ) => {
    try {
      const response = await fetch(
        `/api/admin/registrations/${registrationId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      const data = await response.json();

      if (data.success) {
        toast.success("Registration deleted successfully!");
        fetchEventDetails(eventName);
        fetchData();
      } else {
        toast.error(data.error || "Failed to delete registration");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
  };

  const executeDeleteParticipant = async (
    participantId: string,
    eventName: string,
  ) => {
    try {
      const response = await fetch(`/api/admin/participants/${participantId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Participant removed successfully!");
        fetchEventDetails(eventName);
        fetchData();
      } else {
        toast.error(data.error || "Failed to remove participant");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-slate-500">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      {/* Header */}
      <div className="border-b border-slate-200 bg-white shadow-sm pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <svg
                  className="w-6 h-6"
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
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Events & Registrations
                </h1>
                <p className="mt-1 text-slate-500">
                  Manage events and view participant details
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEventForm(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:opacity-90 transition font-medium text-sm"
              >
                + Add Event
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition font-medium text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-slate-500 text-xs font-medium">Total Events</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {events.length}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-slate-500 text-xs font-medium">Registrations</p>
            <p className="text-2xl font-bold text-orange-500 mt-1">
              {stats.reduce((sum, s) => sum + s.totalRegistrations, 0)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-slate-500 text-xs font-medium">Participants</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {stats.reduce((sum, s) => sum + s.totalParticipants, 0)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-slate-500 text-xs font-medium">Teams</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              {stats.reduce((sum, s) => sum + s.teamCount, 0)}
            </p>
          </div>
        </div>

        {/* Events List */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">All Events</h2>
          </div>

          <div className="p-6">
            {events.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                No events yet. Create your first event!
              </p>
            ) : (
              <div className="space-y-4">
                {events.map((event) => {
                  const eventStat = stats.find(
                    (s) => s.eventName === event.name,
                  );
                  return (
                    <div
                      key={event._id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-slate-300 transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-slate-900">
                              {event.name}
                            </h3>
                            <span
                              className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                event.isActive
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {event.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">
                            {event.description}
                          </p>
                          <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {event.date}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          {eventStat && (
                            <div className="text-right">
                              <p className="text-xl font-bold text-orange-500">
                                {eventStat.totalRegistrations}
                              </p>
                              <p className="text-xs text-slate-500">
                                registrations
                              </p>
                            </div>
                          )}
                          <button
                            onClick={() => openDeleteEventDialog(event.name)}
                            className="px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition text-sm font-medium flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Detailed Registration Data */}
        {stats.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">
                Detailed Registration Data
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Click on an event to view participant details
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 overflow-hidden"
                  >
                    <div
                      onClick={() => toggleEventExpanded(stat.eventName)}
                      className="bg-slate-50 px-4 py-4 cursor-pointer hover:bg-slate-100 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg text-orange-500">
                            {expandedEvents.has(stat.eventName) ? "▼" : "▶"}
                          </span>
                          <h3 className="font-semibold text-slate-900">
                            {stat.eventName}
                          </h3>
                        </div>
                        <div className="flex gap-6 text-sm">
                          <div className="text-center">
                            <p className="text-xs text-slate-500">Regs</p>
                            <p className="font-bold text-blue-600">
                              {stat.totalRegistrations}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-slate-500">Total</p>
                            <p className="font-bold text-orange-500">
                              {stat.totalParticipants}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-slate-500">Solo</p>
                            <p className="font-bold text-emerald-600">
                              {stat.individualCount}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-slate-500">Teams</p>
                            <p className="font-bold text-purple-600">
                              {stat.teamCount}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {expandedEvents.has(stat.eventName) && (
                      <div className="p-4 bg-slate-50">
                        {!eventDetails[stat.eventName] ? (
                          <div className="text-center py-8 text-slate-500">
                            Loading details...
                          </div>
                        ) : eventDetails[stat.eventName].registrations
                            .length === 0 ? (
                          <div className="text-center py-8 text-slate-500">
                            No registrations yet
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {eventDetails[stat.eventName].registrations.map(
                              (reg) => (
                                <div
                                  key={reg._id}
                                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                                >
                                  <div className="flex justify-between items-start mb-4">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-slate-900">
                                          {reg.isTeam ? (
                                            <><Trophy className="w-4 h-4 inline mr-1 text-amber-500" />Team: {reg.teamName}</>
                                          ) : (
                                            <><User className="w-4 h-4 inline mr-1 text-slate-400" />Individual</>
                                          )}
                                        </span>
                                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                          {reg.participants.length} participant
                                          {reg.participants.length !== 1
                                            ? "s"
                                            : ""}
                                        </span>
                                      </div>
                                      <p className="text-xs text-slate-500 mt-1">
                                        {new Date(
                                          reg.createdAt,
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() =>
                                        openDeleteRegistrationDialog(
                                          reg._id,
                                          stat.eventName,
                                          reg.teamName,
                                        )
                                      }
                                      className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition text-xs font-medium flex items-center gap-1"
                                    >
                                      <Trash2 className="w-3 h-3" /> Delete
                                    </button>
                                  </div>

                                  {/* Participants Table */}
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                      <thead className="bg-slate-50">
                                        <tr>
                                          <th className="px-3 py-2 text-left font-medium text-slate-500 text-xs">
                                            Name
                                          </th>
                                          <th className="px-3 py-2 text-left font-medium text-slate-500 text-xs">
                                            Email
                                          </th>
                                          <th className="px-3 py-2 text-left font-medium text-slate-500 text-xs">
                                            Roll No
                                          </th>
                                          <th className="px-3 py-2 text-left font-medium text-slate-500 text-xs">
                                            Contact
                                          </th>
                                          <th className="px-3 py-2 text-left font-medium text-slate-500 text-xs">
                                            Role
                                          </th>
                                          <th className="px-3 py-2 text-left font-medium text-slate-500 text-xs">
                                            Action
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="bg-white">
                                        {reg.participants.map((participant) => (
                                          <tr
                                            key={participant._id}
                                            className="border-t border-slate-200"
                                          >
                                            <td className="px-3 py-2 text-slate-900">
                                              {participant.name}
                                            </td>
                                            <td className="px-3 py-2 text-slate-600">
                                              {participant.email}
                                            </td>
                                            <td className="px-3 py-2 text-slate-600">
                                              {participant.rollNumber}
                                            </td>
                                            <td className="px-3 py-2 text-slate-600">
                                              {participant.contactNumber}
                                            </td>
                                            <td className="px-3 py-2">
                                              {participant.isLeader ? (
                                                <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full">
                                                  Leader
                                                </span>
                                              ) : (
                                                <span className="text-slate-500 text-xs">
                                                  Member
                                                </span>
                                              )}
                                            </td>
                                            <td className="px-3 py-2">
                                              {!participant.isLeader &&
                                              reg.isTeam &&
                                              reg.participants.length > 2 ? (
                                                <button
                                                  onClick={() =>
                                                    openDeleteParticipantDialog(
                                                      participant._id,
                                                      stat.eventName,
                                                      participant.name,
                                                    )
                                                  }
                                                  className="text-red-500 hover:text-red-700 text-xs font-medium"
                                                >
                                                  Remove
                                                </button>
                                              ) : (
                                                <span className="text-slate-400 text-xs">
                                                  -
                                                </span>
                                              )}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              ),
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title={deleteDialog.title}
        message={deleteDialog.message}
        confirmText={deleteDialog.type === "participant" ? "Remove" : "Delete"}
        variant={deleteDialog.type === "event" ? "danger" : "warning"}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteDialog}
      />
    </div>
  );
}

function EventFormModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    date: "",
    image: "",
    rulebook: "",
    whatsappLink: "",
    maxTeamSize: 4,
    minTeamSize: 1,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ image: base64, folder: "events" }),
        });
        const data = await response.json();
        if (data.success) {
          setFormData({ ...formData, image: data.data.url });
          toast.success("Image uploaded!");
        } else {
          toast.error(data.error || "Upload failed");
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Upload failed");
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Event created successfully!");
        onClose();
      } else {
        toast.error(data.error || "Failed to create event");
        setError(data.error || "Failed to create event");
      }
    } catch {
      toast.error("Network error. Please try again.");
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Add New Event</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Event Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                  slug: generateSlug(e.target.value),
                })
              }
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
              placeholder="Enter event name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              URL Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
              placeholder="event-url-slug"
              required
            />
            <p className="text-xs text-slate-500 mt-2">
              URL: /register/{formData.slug || "event-slug"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 resize-none"
              rows={3}
              placeholder="Describe your event..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Event Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Event Image
            </label>
            <div className="flex items-center gap-4">
              {formData.image ? (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                  <img
                    src={formData.image}
                    alt="Event"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: "" })}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl hover:border-orange-500 transition">
                    {uploading ? (
                      <span className="text-slate-500">Uploading...</span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-2">
                        <Camera className="w-4 h-4" /> Click to upload image
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Rules & Guidelines
            </label>
            <textarea
              value={formData.rulebook}
              onChange={(e) =>
                setFormData({ ...formData, rulebook: e.target.value })
              }
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 resize-none"
              rows={5}
              placeholder="Enter event rules and guidelines that will be shown to participants..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              WhatsApp Group Link
            </label>
            <input
              type="url"
              value={formData.whatsappLink}
              onChange={(e) =>
                setFormData({ ...formData, whatsappLink: e.target.value })
              }
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
              placeholder="https://chat.whatsapp.com/..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
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
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
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
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:opacity-90 transition font-medium disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Rocket, Mail, Phone, Calendar, Globe, Pencil, Lock, CheckCircle, Trash2, Camera } from "lucide-react";

interface Startup {
  _id: string;
  name: string;
  slug: string;
  email: string;
  mobileNumber: string;
  incubatedDate: string;
  incubationDetails?: string;
  status: "incubated" | "non-incubated";
  website?: string;
  image?: string;
  isActive: boolean;
}

interface DeleteDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  itemId: string;
}

export default function AdminStartupsPage() {
  const router = useRouter();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStartupForm, setShowStartupForm] = useState(false);
  const [editingStartup, setEditingStartup] = useState<Startup | null>(null);
  const [filter, setFilter] = useState<"all" | "incubated" | "non-incubated">(
    "all",
  );
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    isOpen: false,
    title: "",
    message: "",
    itemId: "",
  });

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    try {
      const response = await fetch("/api/startups?active=false");
      if (response.ok) {
        const data = await response.json();
        setStartups(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching startups:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    toast.success("Logged out successfully");
    router.push("/admin-login");
  };

  const openDeleteDialog = (startupId: string, startupName: string) => {
    setDeleteDialog({
      isOpen: true,
      title: "Delete Startup",
      message: `Are you sure you want to delete "${startupName}"? This action cannot be undone.`,
      itemId: startupId,
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, title: "", message: "", itemId: "" });
  };

  const handleConfirmDelete = async () => {
    const { itemId } = deleteDialog;
    closeDeleteDialog();

    try {
      const response = await fetch(`/api/admin/startups/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Startup deleted successfully!");
        fetchStartups();
      } else {
        toast.error(data.error || "Failed to delete startup");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
  };

  const toggleStartupActive = async (startup: Startup) => {
    try {
      const response = await fetch(`/api/admin/startups/${startup._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: !startup.isActive }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success(
          `Startup ${startup.isActive ? "deactivated" : "activated"} successfully!`,
        );
        fetchStartups();
      } else {
        toast.error(data.error || "Failed to update startup");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
  };

  const filteredStartups = startups.filter((s) => {
    if (filter === "all") return true;
    return s.status === filter;
  });

  const incubatedCount = startups.filter(
    (s) => s.status === "incubated",
  ).length;
  const nonIncubatedCount = startups.filter(
    (s) => s.status === "non-incubated",
  ).length;
  const activeCount = startups.filter((s) => s.isActive).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-slate-500">Loading startups...</p>
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
                  Incubated Startups
                </h1>
                <p className="mt-1 text-slate-500">
                  Manage your startup portfolio
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditingStartup(null);
                  setShowStartupForm(true);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:opacity-90 transition font-medium text-sm"
              >
                + Add Startup
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
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-slate-500 text-xs font-medium">Total Startups</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {startups.length}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-slate-500 text-xs font-medium">Incubated</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {incubatedCount}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-slate-500 text-xs font-medium">Non-Incubated</p>
            <p className="text-2xl font-bold text-orange-500 mt-1">
              {nonIncubatedCount}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-slate-500 text-xs font-medium">Active</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {activeCount}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "all", label: "All" },
            { key: "incubated", label: "Incubated" },
            { key: "non-incubated", label: "Non-Incubated" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition ${
                filter === tab.key
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Startups Grid */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">
              {filter === "all"
                ? "All Startups"
                : filter === "incubated"
                  ? "Incubated Startups"
                  : "Non-Incubated Startups"}
            </h2>
          </div>

          <div className="p-6">
            {filteredStartups.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                No startups found. Add your first startup!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStartups.map((startup) => (
                  <div
                    key={startup._id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-slate-300 transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                          <Rocket className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {startup.name}
                          </h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {startup.email}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          startup.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {startup.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          startup.status === "incubated"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {startup.status === "incubated"
                          ? "Incubated"
                          : "Non-Incubated"}
                      </span>
                      <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-full flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {startup.mobileNumber}
                      </span>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
                        <Calendar className="w-3 h-3" />{" "}
                        {startup.incubatedDate
                          ? new Date(startup.incubatedDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "N/A"}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                      {startup.incubationDetails || (
                        <span className="text-slate-400 italic">
                          Add Incubation Details
                        </span>
                      )}
                    </p>

                    {startup.website && (
                      <a
                        href={startup.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-orange-600 hover:text-orange-700 mb-3 block truncate flex items-center gap-1"
                      >
                        <Globe className="w-3 h-3" /> {startup.website}
                      </a>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setEditingStartup(startup);
                          setShowStartupForm(true);
                        }}
                        className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition flex items-center gap-1"
                      >
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => toggleStartupActive(startup)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1 ${
                          startup.isActive
                            ? "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                            : "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100"
                        }`}
                      >
                        {startup.isActive ? (
                          <><Lock className="w-3 h-3" /> Deactivate</>
                        ) : (
                          <><CheckCircle className="w-3 h-3" /> Activate</>
                        )}
                      </button>
                      <button
                        onClick={() =>
                          openDeleteDialog(startup._id, startup.name)
                        }
                        className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Startup Form Modal */}
      {showStartupForm && (
        <StartupFormModal
          startup={editingStartup}
          onClose={() => {
            setShowStartupForm(false);
            setEditingStartup(null);
            fetchStartups();
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title={deleteDialog.title}
        message={deleteDialog.message}
        confirmText="Delete"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteDialog}
      />
    </div>
  );
}

function StartupFormModal({
  startup,
  onClose,
}: {
  startup: Startup | null;
  onClose: () => void;
}) {
  const isEditing = !!startup;
  const [formData, setFormData] = useState({
    name: startup?.name || "",
    slug: startup?.slug || "",
    email: startup?.email || "",
    mobileNumber: startup?.mobileNumber || "",
    incubatedDate: startup?.incubatedDate
      ? new Date(startup.incubatedDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    incubationDetails: startup?.incubationDetails || "",
    status: startup?.status || "non-incubated",
    website: startup?.website || "",
    image: startup?.image || "",
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
          body: JSON.stringify({ image: base64, folder: "startups" }),
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
      const url = isEditing
        ? `/api/admin/startups/${startup._id}`
        : "/api/startups";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          isEditing
            ? "Startup updated successfully!"
            : "Startup created successfully!",
        );
        onClose();
      } else {
        toast.error(data.error || "Failed to save startup");
        setError(data.error || "Failed to save startup");
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
          <h2 className="text-xl font-bold text-slate-900">
            {isEditing ? "Edit Startup" : "Add New Startup"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Startup Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    slug: isEditing
                      ? formData.slug
                      : generateSlug(e.target.value),
                  })
                }
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                placeholder="Enter startup name"
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
                placeholder="startup-slug"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                placeholder="contact@startup.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mobile Number *
              </label>
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) =>
                  setFormData({ ...formData, mobileNumber: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                placeholder="10 digit number"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Incubated Date *
              </label>
              <input
                type="date"
                value={formData.incubatedDate}
                onChange={(e) =>
                  setFormData({ ...formData, incubatedDate: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "incubated" | "non-incubated",
                  })
                }
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                required
              >
                <option value="non-incubated">Non-Incubated</option>
                <option value="incubated">Incubated</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Incubation Details
            </label>
            <textarea
              value={formData.incubationDetails}
              onChange={(e) =>
                setFormData({ ...formData, incubationDetails: e.target.value })
              }
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 resize-none"
              rows={3}
              placeholder="Add incubation details..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Startup Logo/Image
            </label>
            <div className="flex items-center gap-4">
              {formData.image ? (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                  <img
                    src={formData.image}
                    alt="Startup"
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
                        <Camera className="w-4 h-4" /> Click to upload logo
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
              {loading
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                  ? "Update Startup"
                  : "Create Startup"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

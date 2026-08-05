"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Brain, Wrench, TrendingUp, Target, Monitor, Wallet, Building2, Mail, Phone, GraduationCap, School, Users, Search, CheckCircle, XCircle, Trash2, MousePointerClick } from "lucide-react";

interface IncubationApplication {
  _id: string;
  startupName: string;
  founderName: string;
  founderEmail: string;
  founderPhone: string;
  founderCollege: string;
  founderYear: string;
  founderBranch: string;
  teamSize: number;
  problemStatement: string;
  proposedSolution: string;
  uniqueSellingPoint: string;
  currentStage: "idea" | "mvp" | "early-traction";
  supportNeeded: string[];
  additionalInfo?: string;
  status: "pending" | "reviewing" | "approved" | "rejected";
  adminNotes?: string;
  createdAt: string;
}

interface DeleteDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  itemId: string;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  reviewing: "bg-blue-100 text-blue-700 border-blue-200",
  approved: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
};

const stageLabels = {
  idea: { label: "Idea Stage", Icon: Brain },
  mvp: { label: "MVP/Prototype", Icon: Wrench },
  "early-traction": { label: "Early Traction", Icon: TrendingUp },
};

const supportLabels = {
  mentorship: { label: "Mentorship", Icon: Target },
  technical: { label: "Technical", Icon: Monitor },
  funding: { label: "Funding", Icon: Wallet },
  coworking: { label: "Co-working", Icon: Building2 },
};

export default function AdminIncubationPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<IncubationApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "reviewing" | "approved" | "rejected"
  >("all");
  const [selectedApp, setSelectedApp] = useState<IncubationApplication | null>(
    null,
  );
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    isOpen: false,
    title: "",
    message: "",
    itemId: "",
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/incubation", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setApplications(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    toast.success("Logged out successfully");
    router.push("/admin-login");
  };

  const updateStatus = async (
    appId: string,
    status: string,
    adminNotes?: string,
  ) => {
    try {
      const response = await fetch(`/api/incubation/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status, adminNotes }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success(`Application ${status}!`);
        fetchApplications();
        if (selectedApp?._id === appId) {
          setSelectedApp({
            ...selectedApp,
            status: status as IncubationApplication["status"],
            adminNotes,
          });
        }
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
  };

  const openDeleteDialog = (appId: string, startupName: string) => {
    setDeleteDialog({
      isOpen: true,
      title: "Delete Application",
      message: `Are you sure you want to delete the application for "${startupName}"? This action cannot be undone.`,
      itemId: appId,
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, title: "", message: "", itemId: "" });
  };

  const handleConfirmDelete = async () => {
    const { itemId } = deleteDialog;
    closeDeleteDialog();

    try {
      const response = await fetch(`/api/incubation/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Application deleted successfully!");
        fetchApplications();
        if (selectedApp?._id === itemId) {
          setSelectedApp(null);
        }
      } else {
        toast.error(data.error || "Failed to delete application");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  const statusCounts = {
    pending: applications.filter((a) => a.status === "pending").length,
    reviewing: applications.filter((a) => a.status === "reviewing").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-slate-500">Loading applications...</p>
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
                  Incubation Applications
                </h1>
                <p className="mt-1 text-slate-500">
                  Review and manage applications
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition font-medium text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-slate-500 text-xs font-medium">Total</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {applications.length}
            </p>
          </div>
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm">
            <p className="text-yellow-700 text-xs font-medium">Pending</p>
            <p className="text-2xl font-bold text-yellow-700 mt-1">
              {statusCounts.pending}
            </p>
          </div>
          <div className="rounded-xl border border-green-200 bg-green-50 p-5 shadow-sm">
            <p className="text-green-700 text-xs font-medium">Approved</p>
            <p className="text-2xl font-bold text-green-700 mt-1">
              {statusCounts.approved}
            </p>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 shadow-sm">
            <p className="text-red-700 text-xs font-medium">Rejected</p>
            <p className="text-2xl font-bold text-red-700 mt-1">
              {statusCounts.rejected}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: "all", label: "All", count: applications.length },
            { key: "pending", label: "Pending", count: statusCounts.pending },
            {
              key: "reviewing",
              label: "Reviewing",
              count: statusCounts.reviewing,
            },
            {
              key: "approved",
              label: "Approved",
              count: statusCounts.approved,
            },
            {
              key: "rejected",
              label: "Rejected",
              count: statusCounts.rejected,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition whitespace-nowrap ${
                filter === tab.key
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications List */}
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Applications</h2>
            </div>

            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {filteredApplications.length === 0 ? (
                <p className="text-slate-500 text-center py-8">
                  No applications found.
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredApplications.map((app) => (
                    <div
                      key={app._id}
                      onClick={() => setSelectedApp(app)}
                      className={`rounded-xl border p-4 cursor-pointer transition hover:scale-[1.01] ${
                        selectedApp?._id === app._id
                          ? "border-orange-500 bg-orange-50"
                          : "border-slate-200 bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-slate-900 truncate">
                              {app.startupName}
                            </h3>
                            <span
                              className={`px-2 py-0.5 text-xs font-medium rounded-full border ${statusColors[app.status]}`}
                            >
                              {app.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">
                            {app.founderName}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {(() => { const StageIcon = stageLabels[app.currentStage].Icon; return <StageIcon className="w-3 h-3 inline mr-1" />; })()}{" "}
                            {stageLabels[app.currentStage].label} • <Users className="w-3 h-3 inline mx-1" />{" "}
                            {app.teamSize} members
                          </p>
                        </div>
                        <p className="text-xs text-slate-400 whitespace-nowrap">
                          {new Date(app.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Application Detail */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Details</h2>
            </div>

            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {selectedApp ? (
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {selectedApp.startupName}
                      </h3>
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border mt-1 ${statusColors[selectedApp.status]}`}
                      >
                        {selectedApp.status}
                      </span>
                    </div>
                  </div>

                  {/* Founder Info */}
                  <div className="bg-slate-50 rounded-lg p-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">
                      Founder
                    </h4>
                    <p className="font-medium text-slate-900">
                      {selectedApp.founderName}
                    </p>
                    <p className="text-sm text-slate-600">
                      <Mail className="w-3.5 h-3.5 inline mr-1 text-orange-500" /> {selectedApp.founderEmail}
                    </p>
                    <p className="text-sm text-slate-600">
                      <Phone className="w-3.5 h-3.5 inline mr-1 text-orange-500" /> {selectedApp.founderPhone}
                    </p>
                    <p className="text-sm text-slate-600">
                      <GraduationCap className="w-3.5 h-3.5 inline mr-1 text-orange-500" /> {selectedApp.founderYear}, {selectedApp.founderBranch}
                    </p>
                    <p className="text-sm text-slate-600">
                      <School className="w-3.5 h-3.5 inline mr-1 text-orange-500" /> {selectedApp.founderCollege}
                    </p>
                    <p className="text-sm text-slate-600">
                      <Users className="w-3.5 h-3.5 inline mr-1 text-orange-500" /> Team Size: {selectedApp.teamSize}
                    </p>
                  </div>

                  {/* Stage & Support */}
                  <div className="bg-slate-50 rounded-lg p-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">
                      Stage & Support
                    </h4>
                    <p className="text-sm text-slate-900 mb-2 flex items-center gap-1">
                      {(() => { const StageIcon = stageLabels[selectedApp.currentStage].Icon; return <StageIcon className="w-4 h-4 text-orange-500" />; })()}{" "}
                      {stageLabels[selectedApp.currentStage].label}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {selectedApp.supportNeeded.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full flex items-center gap-1"
                        >
                          {(() => { const SupportIcon = supportLabels[s as keyof typeof supportLabels]?.Icon; return SupportIcon ? <SupportIcon className="w-3 h-3" /> : null; })()}{" "}
                          {
                            supportLabels[s as keyof typeof supportLabels]
                              ?.label
                          }
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Problem & Solution */}
                  <div className="space-y-3">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">
                        Problem
                      </h4>
                      <p className="text-sm text-slate-700">
                        {selectedApp.problemStatement}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">
                        Solution
                      </h4>
                      <p className="text-sm text-slate-700">
                        {selectedApp.proposedSolution}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">
                        USP
                      </h4>
                      <p className="text-sm text-slate-700">
                        {selectedApp.uniqueSellingPoint}
                      </p>
                    </div>
                    {selectedApp.additionalInfo && (
                      <div className="bg-slate-50 rounded-lg p-3">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">
                          Additional Info
                        </h4>
                        <p className="text-sm text-slate-700">
                          {selectedApp.additionalInfo}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase">
                      Actions
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedApp.status !== "reviewing" && (
                        <button
                          onClick={() =>
                            updateStatus(selectedApp._id, "reviewing")
                          }
                          className="px-3 py-2 text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition flex items-center gap-1"
                        >
                          <Search className="w-3 h-3" /> Review
                        </button>
                      )}
                      {selectedApp.status !== "approved" && (
                        <button
                          onClick={() =>
                            updateStatus(selectedApp._id, "approved")
                          }
                          className="px-3 py-2 text-xs font-medium bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 transition flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" /> Approve
                        </button>
                      )}
                      {selectedApp.status !== "rejected" && (
                        <button
                          onClick={() =>
                            updateStatus(selectedApp._id, "rejected")
                          }
                          className="px-3 py-2 text-xs font-medium bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition flex items-center gap-1"
                        >
                          <XCircle className="w-3 h-3" /> Reject
                        </button>
                      )}
                      <button
                        onClick={() =>
                          openDeleteDialog(
                            selectedApp._id,
                            selectedApp.startupName,
                          )
                        }
                        className="px-3 py-2 text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 transition flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <MousePointerClick className="w-10 h-10 mb-2 text-slate-300" />
                  <p className="text-sm">
                    Select an application to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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

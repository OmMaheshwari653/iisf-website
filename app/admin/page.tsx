"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { Calendar, ClipboardList, Users, Rocket, Lightbulb } from "lucide-react";

interface EventStats {
  eventName: string;
  totalRegistrations: number;
  individualCount: number;
  teamCount: number;
  totalParticipants: number;
}

interface IncubationStats {
  totalApplications: number;
  byStatus: {
    pending: number;
    reviewing: number;
    approved: number;
    rejected: number;
  };
  byStage: {
    idea: number;
    mvp: number;
    earlyTraction: number;
  };
  supportDistribution: {
    mentorship: number;
    technical: number;
    funding: number;
    coworking: number;
  };
}

interface DashboardData {
  eventsCount: number;
  startupsCount: number;
  totalRegistrations: number;
  totalParticipants: number;
  incubationApplications: number;
  eventStats: EventStats[];
  incubationStats: IncubationStats | null;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    eventsCount: 0,
    startupsCount: 0,
    totalRegistrations: 0,
    totalParticipants: 0,
    incubationApplications: 0,
    eventStats: [],
    incubationStats: null,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [eventsRes, statsRes, startupsRes, incubationStatsRes] =
        await Promise.all([
          fetch("/api/events"),
          fetch("/api/admin/stats"),
          fetch("/api/startups?active=false"),
          fetch("/api/admin/incubation/stats"),
        ]);

      let eventsCount = 0;
      let startupsCount = 0;
      let eventStats: EventStats[] = [];
      let incubationStats: IncubationStats | null = null;

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        eventsCount = eventsData.data?.length || 0;
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        eventStats = statsData.data || [];
      }

      if (startupsRes.ok) {
        const startupsData = await startupsRes.json();
        startupsCount = startupsData.data?.length || 0;
      }

      if (incubationStatsRes.ok) {
        const incubationData = await incubationStatsRes.json();
        incubationStats = incubationData.data || null;
      }

      const totalRegistrations = eventStats.reduce(
        (sum, s) => sum + s.totalRegistrations,
        0,
      );
      const totalParticipants = eventStats.reduce(
        (sum, s) => sum + s.totalParticipants,
        0,
      );

      setData({
        eventsCount,
        startupsCount,
        totalRegistrations,
        totalParticipants,
        incubationApplications: incubationStats?.totalApplications || 0,
        eventStats,
        incubationStats,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    toast.success("Logged out successfully");
    router.push("/admin-login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const dashboardCards = [
    {
      title: "Total Events",
      value: data.eventsCount,
      Icon: Calendar,
      color: "from-blue-500 to-indigo-500",
      link: "/admin/events",
    },
    {
      title: "Registrations",
      value: data.totalRegistrations,
      Icon: ClipboardList,
      color: "from-orange-500 to-amber-500",
      link: "/admin/events",
    },
    {
      title: "Participants",
      value: data.totalParticipants,
      Icon: Users,
      color: "from-green-500 to-emerald-500",
      link: "/admin/events",
    },
    {
      title: "Startups",
      value: data.startupsCount,
      Icon: Rocket,
      color: "from-purple-500 to-violet-500",
      link: "/admin/startups",
    },
    {
      title: "Incubation Apps",
      value: data.incubationApplications,
      Icon: Lightbulb,
      color: "from-pink-500 to-rose-500",
      link: "/admin/incubation",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <div className="border-b border-slate-200 bg-white shadow-sm pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-slate-500">Overview of all activities</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition font-medium text-sm w-full sm:w-auto"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link href="/admin/events">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] transition cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Events & Registrations</h3>
                  <p className="text-white/80 text-sm mt-1">
                    Manage events and view registrations
                  </p>
                </div>
                <Calendar className="w-10 h-10 text-white/80" />
              </div>
            </div>
          </Link>

          <Link href="/admin/startups">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] transition cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Incubated Startups</h3>
                  <p className="text-white/80 text-sm mt-1">
                    Manage startup portfolio
                  </p>
                </div>
                <Rocket className="w-10 h-10 text-white/80" />
              </div>
            </div>
          </Link>

          <Link href="/admin/incubation">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-[1.02] transition cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Incubation Applications</h3>
                  <p className="text-white/80 text-sm mt-1">
                    Review new applications
                  </p>
                </div>
                <Lightbulb className="w-10 h-10 text-white/80" />
              </div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
          {dashboardCards.map((card) => (
            <Link key={card.title} href={card.link}>
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                    <card.Icon className="w-5 h-5 text-white" />
                  </div>
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.color} opacity-20`}
                  />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {card.value}
                </p>
                <p className="text-xs text-slate-500 mt-1">{card.title}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Event Statistics
            </h3>
            {data.eventStats.length > 0 ? (
              <div className="space-y-4">
                {data.eventStats.map((stat, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-slate-900 truncate max-w-[60%]">
                        {stat.eventName}
                      </span>
                      <span className="text-orange-600 font-bold">
                        {stat.totalParticipants} participants
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-slate-600">
                      <span>Individual: {stat.individualCount}</span>
                      <span>Teams: {stat.teamCount}</span>
                    </div>
                    <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                        style={{
                          width: `${Math.min((stat.totalParticipants / Math.max(...data.eventStats.map((s) => s.totalParticipants))) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-400">
                No event data available
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Application Status
            </h3>
            {data.incubationStats &&
            data.incubationStats.totalApplications > 0 ? (
              <div className="space-y-4">
                {[
                  {
                    label: "Pending",
                    value: data.incubationStats.byStatus.pending,
                    color: "bg-yellow-500",
                  },
                  {
                    label: "Reviewing",
                    value: data.incubationStats.byStatus.reviewing,
                    color: "bg-blue-500",
                  },
                  {
                    label: "Approved",
                    value: data.incubationStats.byStatus.approved,
                    color: "bg-green-500",
                  },
                  {
                    label: "Rejected",
                    value: data.incubationStats.byStatus.rejected,
                    color: "bg-red-500",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="flex-1 text-slate-600">{item.label}</span>
                    <span className="font-bold text-slate-900">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-400">
                No applications yet
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Startup Stages
            </h3>
            {data.incubationStats ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Idea Stage</span>
                    <span className="font-bold text-slate-900">
                      {data.incubationStats.byStage.idea}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                      style={{
                        width: `${
                          data.incubationStats.totalApplications > 0
                            ? (data.incubationStats.byStage.idea /
                                data.incubationStats.totalApplications) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">MVP/Prototype</span>
                    <span className="font-bold text-slate-900">
                      {data.incubationStats.byStage.mvp}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                      style={{
                        width: `${
                          data.incubationStats.totalApplications > 0
                            ? (data.incubationStats.byStage.mvp /
                                data.incubationStats.totalApplications) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Early Traction</span>
                    <span className="font-bold text-slate-900">
                      {data.incubationStats.byStage.earlyTraction}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                      style={{
                        width: `${
                          data.incubationStats.totalApplications > 0
                            ? (data.incubationStats.byStage.earlyTraction /
                                data.incubationStats.totalApplications) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-slate-400">
                No stage data available
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Support Requested
            </h3>
            {data.incubationStats ? (
              <div className="space-y-4">
                {[
                  {
                    key: "mentorship",
                    label: "Mentorship",
                    color: "from-orange-500 to-amber-500",
                  },
                  {
                    key: "technical",
                    label: "Technical",
                    color: "from-blue-500 to-indigo-500",
                  },
                  {
                    key: "funding",
                    label: "Funding",
                    color: "from-green-500 to-emerald-500",
                  },
                  {
                    key: "coworking",
                    label: "Co-working",
                    color: "from-purple-500 to-violet-500",
                  },
                ].map((item) => (
                  <div key={item.key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="font-bold text-slate-900">
                        {data.incubationStats?.supportDistribution[
                          item.key as keyof typeof data.incubationStats.supportDistribution
                        ] || 0}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                        style={{
                          width: `${
                            data.incubationStats &&
                            data.incubationStats.totalApplications > 0
                              ? ((data.incubationStats.supportDistribution[
                                  item.key as keyof typeof data.incubationStats.supportDistribution
                                ] || 0) /
                                  data.incubationStats.totalApplications) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-slate-400">
                No support data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ title, value, trend, trendUp, icon, accentClass, bgClass }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e2e8f0] flex flex-col gap-4 hover:shadow-md transition-shadow duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#64748b] uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-[#0f172a] mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass} transition-transform duration-200 group-hover:scale-110`}>
          <span className={`text-xl ${accentClass}`}>{icon}</span>
        </div>
      </div>
      <div className={`flex items-center gap-1.5 text-xs font-medium ${trendUp ? "text-emerald-600" : "text-[#dc2626]"}`}>
        <span>{trendUp ? "▲" : "▼"}</span>
        <span>{trend}</span>
      </div>
    </div>
  );
}

// ─── Quick Action Button ────────────────────────────────────────────────────────
function ActionBtn({ label, icon, color }) {
  const colorMap = {
    blue: "bg-[#1D4ED8] hover:bg-[#1e40af] text-white shadow-blue-200",
    red: "bg-[#DC2626] hover:bg-[#b91c1c] text-white shadow-red-200",
    emerald: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200",
    violet: "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-200",
    amber: "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200",
    slate: "bg-[#0f172a] hover:bg-slate-800 text-white shadow-slate-200",
  };
  return (
    <button
      className={`flex items-center gap-3 px-5 py-3.5 rounded-xl font-semibold text-sm shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${colorMap[color]}`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );
}

// ─── Status Badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    Upcoming: "bg-blue-100 text-blue-700 border-blue-200",
    Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Completed: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${map[status] || map.Upcoming}`}>
      {status}
    </span>
  );
}

// ─── Main Dashboard ─────────────────────────────────────────────────────────────
export default function Dashboard({ user, pendingUsers, onApprove, onReject, statusUpdateResult }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (d) =>
    d.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const formatTime = (d) =>
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const stats = [
    {
      title: "Total Tournaments",
      value: "12",
      trend: "+2 this month",
      trendUp: true,
      icon: "🏆",
      accentClass: "text-blue-600",
      bgClass: "bg-blue-50",
    },
    {
      title: "Registered Participants",
      value: "1,284",
      trend: "+148 this week",
      trendUp: true,
      icon: "🥋",
      accentClass: "text-red-600",
      bgClass: "bg-red-50",
    },
    {
      title: "Pending Approvals",
      value: String(pendingUsers.length || 0),
      trend: pendingUsers.length > 0 ? "Needs attention" : "All clear",
      trendUp: pendingUsers.length === 0,
      icon: "⏳",
      accentClass: "text-amber-600",
      bgClass: "bg-amber-50",
    },
    {
      title: "Matches Scheduled",
      value: "87",
      trend: "+12 this week",
      trendUp: true,
      icon: "⚡",
      accentClass: "text-violet-600",
      bgClass: "bg-violet-50",
    },
  ];

  const tournaments = [
    { name: "National Open Championship 2026", date: "Jul 15 – 17, 2026", location: "Kathmandu, NP", registrations: 320, status: "Upcoming" },
    { name: "Provincial Qualifier – Bagmati", date: "Jun 22 – 23, 2026", location: "Lalitpur, NP", registrations: 158, status: "Active" },
    { name: "Club League Season 3", date: "May 10 – 12, 2026", location: "Pokhara, NP", registrations: 94, status: "Completed" },
  ];

  const recentActivity = [
    { type: "registration", text: "New participant registered — Aarav Sharma", time: "2 min ago", dot: "bg-blue-500" },
    { type: "approval", text: "User approved — Sita Rai (Instructor)", time: "14 min ago", dot: "bg-emerald-500" },
    { type: "tournament", text: "Tournament created — Bagmati Qualifier", time: "1 hr ago", dot: "bg-violet-500" },
    { type: "match", text: "Match scheduled — Semi-final, Bantam Male", time: "3 hr ago", dot: "bg-amber-500" },
    { type: "registration", text: "8 new registrations — National Open", time: "5 hr ago", dot: "bg-blue-500" },
    { type: "approval", text: "User rejected — Invalid credentials", time: "6 hr ago", dot: "bg-red-500" },
  ];

  return (
    <div className="flex flex-col gap-8 p-8 bg-[#F8FAFC] min-h-screen">

      {/* ── Welcome Banner ── */}
      <div className="relative bg-gradient-to-br from-[#1D4ED8] via-[#1e40af] to-[#1e3a8a] rounded-2xl p-8 overflow-hidden shadow-xl">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5"></div>
        <div className="absolute top-6 right-24 w-24 h-24 rounded-full bg-white/5"></div>
        <div className="absolute -bottom-8 right-8 w-36 h-36 rounded-full bg-[#DC2626]/20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-blue-200 text-xs font-medium uppercase tracking-widest">System Online</span>
            </div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, <span className="text-blue-200">{user?.name?.split(" ")[0] || "Admin"}</span> 👋
            </h1>
            <p className="text-blue-300 mt-1 text-sm">
              {user?.role === "ADMIN" ? "Super Administrator" : user?.role} — Full access granted
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white tabular-nums">{formatTime(now)}</p>
            <p className="text-blue-300 text-sm mt-1">{formatDate(now)}</p>
          </div>
        </div>

        {/* Quick summary strip */}
        <div className="relative z-10 mt-6 flex flex-wrap gap-4">
          {[
            { label: "Active Tournaments", val: "3" },
            { label: "Open Registrations", val: "2" },
            { label: "Pending Approvals", val: String(pendingUsers.length) },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 flex items-center gap-3">
              <span className="text-white font-bold text-xl">{s.val}</span>
              <span className="text-blue-200 text-xs font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e2e8f0]">
        <h2 className="text-base font-bold text-[#0f172a] mb-5 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-[#1D4ED8] inline-block"></span>
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <ActionBtn label="Create Tournament" icon="➕" color="blue" />
          <ActionBtn label="Manage Categories" icon="🏷️" color="slate" />
          <ActionBtn label="Generate Draw" icon="🎲" color="violet" />
          <ActionBtn label="View Registrations" icon="📋" color="emerald" />
          <ActionBtn label="Approve Users" icon="✅" color="amber" />
          <ActionBtn label="Match Scheduling" icon="⚡" color="red" />
        </div>
      </div>

      {/* ── Middle Row: Activity + Pending Approvals ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent Activity */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-[#e2e8f0] flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
            <h2 className="text-base font-bold text-[#0f172a] flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-[#1D4ED8] inline-block"></span>
              Recent Activity
            </h2>
            <button className="text-xs text-[#1D4ED8] font-semibold hover:underline">View All</button>
          </div>
          <div className="divide-y divide-[#f1f5f9]">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-4 px-6 py-4 hover:bg-[#f8fafc] transition-colors">
                <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${a.dot}`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#0f172a] font-medium">{a.text}</p>
                </div>
                <span className="text-xs text-[#94a3b8] shrink-0 whitespace-nowrap">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals Widget */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
            <h2 className="text-base font-bold text-[#0f172a] flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-amber-500 inline-block"></span>
              Pending Approvals
            </h2>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${pendingUsers.length > 0 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
              {pendingUsers.length}
            </span>
          </div>

          {/* Status message */}
          {statusUpdateResult?.message && (
            <div className={`mx-4 mt-3 px-4 py-2 rounded-lg text-sm text-center font-medium ${statusUpdateResult.success ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {statusUpdateResult.message}
            </div>
          )}

          <div className="flex-1 overflow-y-auto divide-y divide-[#f1f5f9]">
            {pendingUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3">
                  <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-[#0f172a]">All caught up!</p>
                <p className="text-xs text-[#94a3b8] mt-1">No pending user approvals.</p>
              </div>
            ) : (
              pendingUsers.map((u) => (
                <div key={u.id} className="px-5 py-4 hover:bg-[#f8fafc] transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-[#1D4ED8] flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {u.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0f172a] truncate">{u.name}</p>
                      <p className="text-xs text-[#64748b] truncate">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onApprove(u.email)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors active:scale-95"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => onReject(u.email)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold py-2 rounded-lg border border-red-200 transition-colors active:scale-95"
                    >
                      ✗ Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Tournament Overview ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
          <h2 className="text-base font-bold text-[#0f172a] flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-[#DC2626] inline-block"></span>
            Tournament Overview
          </h2>
          <button className="text-xs text-[#1D4ED8] font-semibold hover:underline">Manage All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#f1f5f9]">
          {tournaments.map((t) => (
            <div key={t.name} className="p-6 hover:bg-[#f8fafc] transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1D4ED8] to-[#1e3a8a] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <span className="text-lg">🏆</span>
                </div>
                <StatusBadge status={t.status} />
              </div>
              <h3 className="text-sm font-bold text-[#0f172a] leading-snug mb-1">{t.name}</h3>
              <p className="text-xs text-[#64748b] mb-0.5">📅 {t.date}</p>
              <p className="text-xs text-[#64748b] mb-3">📍 {t.location}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-[#0f172a]">{t.registrations}</span>
                  <span className="text-xs text-[#64748b]">registered</span>
                </div>
                <button className="text-xs text-[#1D4ED8] font-semibold hover:underline">View →</button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

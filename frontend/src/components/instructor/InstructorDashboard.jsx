import { useState, useEffect } from "react";

// ─── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({ title, value, sub, icon, bgClass, accentClass }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e2e8f0] flex flex-col gap-4 hover:shadow-md transition-shadow duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[#64748b] uppercase tracking-widest">{title}</p>
          <p className="text-3xl font-bold text-[#0f172a] mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass} transition-transform duration-200 group-hover:scale-110`}>
          <span className={`text-xl ${accentClass}`}>{icon}</span>
        </div>
      </div>
      <p className="text-xs text-[#64748b] font-medium">{sub}</p>
    </div>
  );
}

// ─── Tournament Card ────────────────────────────────────────────────────────────
function UpcomingTournamentCard({ tournament, onRegister }) {
  const { name, date, venue, deadline, categories, organizer } = tournament;
  const deadlineDate = new Date(deadline);
  const isUrgent = (deadlineDate - new Date()) / (1000 * 60 * 60 * 24) < 7;

  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Top accent */}
      <div className="h-1.5 bg-gradient-to-r from-[#1D4ED8] to-[#3b82f6]" />
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">🏆</div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">Open</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#0f172a] leading-tight mb-0.5 group-hover:text-[#1D4ED8] transition-colors">{name}</h3>
          <p className="text-xs text-[#64748b]">by {organizer}</p>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-[#64748b]">
            <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {date}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#64748b]">
            <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {venue}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`font-medium ${isUrgent ? "text-red-600" : "text-[#64748b]"}`}>
              Deadline: {new Date(deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              {isUrgent && " ⚠️"}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {categories.slice(0, 3).map((cat) => (
            <span key={cat} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{cat}</span>
          ))}
          {categories.length > 3 && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">+{categories.length - 3} more</span>
          )}
        </div>
      </div>
      <div className="px-5 pb-5">
        <button
          onClick={() => onRegister(tournament)}
          className="w-full py-2.5 bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-md hover:shadow-blue-200 active:scale-95"
        >
          Register Athlete
        </button>
      </div>
    </div>
  );
}

// ─── Notification Item ──────────────────────────────────────────────────────────
function NotifItem({ icon, text, time, type }) {
  const typeColors = {
    success: "bg-emerald-100 text-emerald-600",
    info: "bg-blue-100 text-blue-600",
    warning: "bg-amber-100 text-amber-600",
    error: "bg-red-100 text-red-600",
  };
  return (
    <div className="flex items-start gap-3 px-6 py-3.5 hover:bg-[#f8fafc] transition-colors">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 mt-0.5 ${typeColors[type] || typeColors.info}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#0f172a] font-medium leading-snug">{text}</p>
        <p className="text-xs text-[#94a3b8] mt-0.5">{time}</p>
      </div>
    </div>
  );
}

// ─── Main Instructor Dashboard ──────────────────────────────────────────────────
export default function InstructorDashboard({ user, setActivePage }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d) =>
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const formatDate = (d) =>
    d.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const stats = [
    { title: "Total Students", value: "12", sub: "4 active this month", icon: "👥", bgClass: "bg-blue-50", accentClass: "text-blue-600" },
    { title: "Registered Athletes", value: "8", sub: "Across 3 tournaments", icon: "🥋", bgClass: "bg-violet-50", accentClass: "text-violet-600" },
    { title: "Upcoming Matches", value: "5", sub: "Next: Jul 15 @ Ring 3", icon: "⚡", bgClass: "bg-amber-50", accentClass: "text-amber-600" },
    { title: "Medals Won", value: "14", sub: "3 Gold · 5 Silver · 6 Bronze", icon: "🏅", bgClass: "bg-emerald-50", accentClass: "text-emerald-600" },
  ];

  const upcomingTournaments = [
    {
      id: 1,
      name: "National Open Championship 2026",
      organizer: "Nepal Taekwondo Association",
      date: "Jul 15 – 17, 2026",
      venue: "Dasharath Stadium, Kathmandu",
      deadline: "2026-07-05",
      categories: ["U-12 Male", "U-15 Female", "U-18 Male", "Senior Male", "Senior Female"],
    },
    {
      id: 2,
      name: "Provincial Qualifier – Bagmati",
      organizer: "Bagmati Province TKD",
      date: "Aug 2 – 3, 2026",
      venue: "Lalitpur Sports Complex",
      deadline: "2026-07-25",
      categories: ["U-12 Male", "U-12 Female", "U-15 Male", "U-15 Female"],
    },
    {
      id: 3,
      name: "Youth Championship Cup",
      organizer: "Nepal Youth Sports Board",
      date: "Aug 20 – 21, 2026",
      venue: "ANFA Complex, Satdobato",
      deadline: "2026-08-08",
      categories: ["U-10 Male", "U-10 Female", "U-12 Male", "U-12 Female", "U-15 Male"],
    },
  ];

  const notifications = [
    { icon: "✅", text: "Registration approved — Aarav Sharma for National Open", time: "2 hours ago", type: "success" },
    { icon: "📅", text: "Match schedule released for Bagmati Qualifier", time: "5 hours ago", type: "info" },
    { icon: "⚖️", text: "Weigh-in reminder — Priya Tamang (U-15F) tomorrow 8 AM", time: "Yesterday", type: "warning" },
    { icon: "🏆", text: "Tournament results published — Club League Season 3", time: "2 days ago", type: "info" },
    { icon: "❌", text: "Registration rejected — Rajan KC (incomplete documents)", time: "3 days ago", type: "error" },
  ];

  const handleRegister = (tournament) => {
    setActivePage("tournament-registration");
  };

  return (
    <div className="flex flex-col gap-8 p-8 bg-[#F8FAFC] min-h-screen">

      {/* ── Welcome Banner ── */}
      <div className="relative bg-gradient-to-br from-[#1D4ED8] via-[#1e40af] to-[#1e3a8a] rounded-2xl p-8 overflow-hidden shadow-xl">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute top-6 right-24 w-24 h-24 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 right-8 w-36 h-36 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-white/[0.03]" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-blue-200 text-xs font-medium uppercase tracking-widest">Instructor Portal</span>
            </div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, <span className="text-blue-200">{user?.name?.split(" ")[0] || "Coach"}</span> 👋
            </h1>
            <p className="text-blue-300 mt-1 text-sm">
              Manage your team, track registrations & monitor match results
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white tabular-nums">{formatTime(now)}</p>
            <p className="text-blue-300 text-sm mt-1">{formatDate(now)}</p>
          </div>
        </div>

        {/* Quick summary strip */}
        <div className="relative z-10 mt-6 flex flex-wrap gap-3">
          {[
            { label: "Active Students", val: "12" },
            { label: "Open Registrations", val: "8" },
            { label: "Pending Results", val: "2" },
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
          <span className="w-1 h-5 rounded-full bg-[#1D4ED8] inline-block" />
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Add Student", icon: "👤", page: "students", color: "bg-[#1D4ED8] hover:bg-[#1e40af] text-white shadow-blue-100" },
            { label: "Register Athlete", icon: "🏆", page: "tournament-registration", color: "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-100" },
            { label: "View Schedule", icon: "📅", page: "match-schedule", color: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100" },
            { label: "Check Results", icon: "🏅", page: "results", color: "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-100" },
            { label: "My Registrations", icon: "📋", page: "my-registrations", color: "bg-[#0f172a] hover:bg-slate-800 text-white shadow-slate-100" },
          ].map((a) => (
            <button
              key={a.label}
              onClick={() => setActivePage(a.page)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${a.color}`}
            >
              <span>{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Bottom Row: Upcoming Tournaments + Notifications ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Upcoming Tournaments */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0f172a] flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-[#1D4ED8] inline-block" />
              Upcoming Tournaments
            </h2>
            <button
              onClick={() => setActivePage("tournament-registration")}
              className="text-xs text-[#1D4ED8] font-semibold hover:underline"
            >
              View All →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {upcomingTournaments.map((t) => (
              <UpcomingTournamentCard key={t.id} tournament={t} onRegister={handleRegister} />
            ))}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
            <h2 className="text-base font-bold text-[#0f172a] flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-amber-500 inline-block" />
              Notifications
            </h2>
            <span className="text-xs bg-[#1D4ED8] text-white font-bold px-2 py-0.5 rounded-full">
              {notifications.filter((_, i) => i < 2).length} new
            </span>
          </div>
          <div className="flex-1 divide-y divide-[#f1f5f9] overflow-y-auto">
            {notifications.map((n, i) => (
              <NotifItem key={i} {...n} />
            ))}
          </div>
          <div className="px-6 py-3 border-t border-[#f1f5f9]">
            <button className="text-xs text-[#1D4ED8] font-semibold hover:underline w-full text-center">
              View all notifications
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

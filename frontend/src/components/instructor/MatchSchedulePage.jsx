import { useState } from "react";

// ─── Status Badge ──────────────────────────────────────────────────────────────
function MatchStatusBadge({ status }) {
  const map = {
    Upcoming: "bg-blue-100 text-blue-700 border-blue-200",
    Completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Walkover: "bg-slate-100 text-slate-600 border-slate-200",
    Live: "bg-red-100 text-red-700 border-red-200 animate-pulse",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${map[status] || map.Upcoming}`}>
      {status === "Live" ? "🔴 Live" : status}
    </span>
  );
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_MATCHES = [
  { id: 1, student: "Aarav Sharma", opponent: "Rohan Thapa", category: "U-12 Male Light", tournament: "National Open Championship 2026", ring: 3, time: "2026-07-15T09:30:00", round: "Quarter Final", status: "Upcoming" },
  { id: 2, student: "Priya Tamang", opponent: "Nita Shrestha", category: "U-15 Female Light", tournament: "National Open Championship 2026", ring: 1, time: "2026-07-15T10:15:00", round: "Quarter Final", status: "Upcoming" },
  { id: 3, student: "Sunita Rai", opponent: "Maya Gurung", category: "U-15 Female Middle", tournament: "Provincial Qualifier – Bagmati", ring: 2, time: "2026-07-02T11:00:00", round: "Semi Final", status: "Upcoming" },
  { id: 4, student: "Bikash Gurung", opponent: "Sagar Limbu", category: "Senior Male Heavy", tournament: "Club League Season 3", ring: 1, time: "2026-05-12T14:30:00", round: "Final", status: "Completed" },
  { id: 5, student: "Rajan KC", opponent: "Amir Bhattarai", category: "U-12 Mixed Light", tournament: "District Cup 2026", ring: 4, time: "2026-04-20T09:00:00", round: "Round 1", status: "Completed" },
  { id: 6, student: "Anita Thapa", opponent: "BYE", category: "U-10 Female", tournament: "Youth Championship Cup", ring: 2, time: "2026-08-20T09:00:00", round: "Round 1", status: "Upcoming" },
  { id: 7, student: "Roshan Magar", opponent: "Withdrawn", category: "Senior Male Middle", tournament: "Club League Season 4", ring: 1, time: "2026-06-01T15:00:00", round: "Quarter Final", status: "Walkover" },
];

// ─── Match Card (List View) ────────────────────────────────────────────────────
function MatchCard({ match }) {
  const matchDate = new Date(match.time);
  const isUpcoming = match.status === "Upcoming";

  return (
    <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${isUpcoming ? "border-[#e2e8f0]" : "border-[#f1f5f9]"}`}>
      {/* Top bar */}
      <div className={`h-1 ${isUpcoming ? "bg-gradient-to-r from-[#1D4ED8] to-[#3b82f6]" : match.status === "Completed" ? "bg-gradient-to-r from-emerald-400 to-emerald-600" : "bg-slate-200"}`} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{match.tournament}</p>
            <p className="text-xs text-slate-500">{match.category}</p>
          </div>
          <MatchStatusBadge status={match.status} />
        </div>

        {/* Vs Section */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100">
            <div className="w-10 h-10 rounded-xl bg-[#1D4ED8] flex items-center justify-center text-white font-bold text-sm">
              {match.student.charAt(0)}
            </div>
            <p className="text-xs font-bold text-[#0f172a] text-center">{match.student}</p>
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">My Athlete</span>
          </div>
          <div className="flex flex-col items-center gap-1 shrink-0">
            <span className="text-lg font-black text-slate-400">VS</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-slate-400 flex items-center justify-center text-white font-bold text-sm">
              {match.opponent.charAt(0)}
            </div>
            <p className="text-xs font-bold text-[#0f172a] text-center">{match.opponent}</p>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Opponent</span>
          </div>
        </div>

        {/* Match Info */}
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { icon: "🔔", label: "Ring", val: `Ring ${match.ring}` },
            { icon: "🏅", label: "Round", val: match.round },
            { icon: "⏰", label: "Time", val: matchDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) },
          ].map((d) => (
            <div key={d.label} className="bg-[#f8fafc] rounded-xl p-2.5">
              <p className="text-base mb-0.5">{d.icon}</p>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{d.label}</p>
              <p className="text-xs font-bold text-[#0f172a]">{d.val}</p>
            </div>
          ))}
        </div>

        {/* Date */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {matchDate.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
        </div>
      </div>
    </div>
  );
}

// ─── Calendar View ─────────────────────────────────────────────────────────────
function CalendarView({ matches }) {
  const grouped = matches.reduce((acc, m) => {
    const day = new Date(m.time).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    if (!acc[day]) acc[day] = [];
    acc[day].push(m);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([day, dayMatches]) => (
        <div key={day}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#1D4ED8] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-[#0f172a]">{day}</p>
              <p className="text-xs text-slate-500">{dayMatches.length} match{dayMatches.length !== 1 ? "es" : ""}</p>
            </div>
          </div>
          <div className="pl-11 space-y-2">
            {dayMatches.sort((a, b) => new Date(a.time) - new Date(b.time)).map((m) => (
              <div key={m.id} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
                <div className="text-center shrink-0 w-12">
                  <p className="text-sm font-bold text-[#1D4ED8]">{new Date(m.time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>
                  <p className="text-[10px] text-slate-400">Ring {m.ring}</p>
                </div>
                <div className="w-px h-8 bg-[#e2e8f0]" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#0f172a] truncate">{m.student} vs {m.opponent}</p>
                  <p className="text-xs text-slate-500 truncate">{m.category} · {m.round}</p>
                </div>
                <MatchStatusBadge status={m.status} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function MatchSchedulePage() {
  const [viewMode, setViewMode] = useState("list"); // "list" | "calendar"
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = MOCK_MATCHES.filter((m) => {
    const matchSearch = m.student.toLowerCase().includes(search.toLowerCase()) ||
      m.opponent.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const upcoming = MOCK_MATCHES.filter((m) => m.status === "Upcoming").length;
  const completed = MOCK_MATCHES.filter((m) => m.status === "Completed").length;

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Match Schedule</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track upcoming and past matches for your athletes</p>
        </div>
        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-white border border-[#e2e8f0] rounded-xl p-1 shadow-sm">
          {[
            { id: "list", icon: "☰", label: "List" },
            { id: "calendar", icon: "📅", label: "Calendar" },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setViewMode(v.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === v.id ? "bg-[#1D4ED8] text-white shadow-sm" : "text-slate-500 hover:text-[#0f172a]"}`}
            >
              <span>{v.icon}</span>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Matches", val: MOCK_MATCHES.length, icon: "⚔️", bg: "bg-white", text: "text-[#0f172a]" },
          { label: "Upcoming", val: upcoming, icon: "⏳", bg: "bg-blue-50", text: "text-blue-700" },
          { label: "Completed", val: completed, icon: "✅", bg: "bg-emerald-50", text: "text-emerald-700" },
          { label: "Walkovers", val: MOCK_MATCHES.filter((m) => m.status === "Walkover").length, icon: "🔄", bg: "bg-slate-50", text: "text-slate-600" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl border border-[#e2e8f0] p-5 shadow-sm`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{s.icon}</span>
            </div>
            <p className={`text-2xl font-bold ${s.text}`}>{s.val}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by athlete, opponent, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8]"
          />
        </div>
        <div className="flex gap-1.5">
          {["All", "Upcoming", "Completed", "Walkover"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === s ? "bg-[#1D4ED8] text-white" : "text-slate-500 hover:bg-slate-100"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] py-16 text-center">
          <p className="text-4xl mb-3">⚔️</p>
          <p className="text-base font-bold text-[#0f172a]">No matches found</p>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filter</p>
        </div>
      ) : viewMode === "list" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((m) => <MatchCard key={m.id} match={m} />)}
        </div>
      ) : (
        <CalendarView matches={filtered} />
      )}
    </div>
  );
}

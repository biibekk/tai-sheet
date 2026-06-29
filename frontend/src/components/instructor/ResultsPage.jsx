import { useState } from "react";

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_RESULTS = [
  { id: 1, student: "Bikash Gurung", opponent: "Sagar Limbu", category: "Senior Male Heavy", tournament: "Club League Season 3", score: "7 – 3", winner: "Bikash Gurung", isWin: true, medal: "Gold", date: "2026-05-12" },
  { id: 2, student: "Rajan KC", opponent: "Amir Bhattarai", category: "U-12 Mixed Light", tournament: "District Cup 2026", score: "4 – 6", winner: "Amir Bhattarai", isWin: false, medal: null, date: "2026-04-20" },
  { id: 3, student: "Sunita Rai", opponent: "Maya Gurung", category: "U-15 Female", tournament: "School TKD Meet 2026", score: "8 – 2", winner: "Sunita Rai", isWin: true, medal: "Gold", date: "2026-03-15" },
  { id: 4, student: "Priya Tamang", opponent: "Nita Shrestha", category: "U-15 Female Light", tournament: "Bagmati Open 2025", score: "5 – 5 (KO)", winner: "Priya Tamang", isWin: true, medal: "Silver", date: "2025-12-10" },
  { id: 5, student: "Bikash Gurung", opponent: "Ram Maharjan", category: "Senior Male Heavy", tournament: "Bagmati Open 2025", score: "9 – 1", winner: "Bikash Gurung", isWin: true, medal: "Gold", date: "2025-12-09" },
  { id: 6, student: "Aarav Sharma", opponent: "Saurav Rana", category: "U-12 Male Light", tournament: "District Cup 2026", score: "3 – 5", winner: "Saurav Rana", isWin: false, medal: null, date: "2026-04-19" },
  { id: 7, student: "Sunita Rai", opponent: "BYE", category: "U-15 Female", tournament: "School TKD Meet 2026", score: "W/O", winner: "Sunita Rai", isWin: true, medal: null, date: "2026-03-14" },
  { id: 8, student: "Bikash Gurung", opponent: "Sagar Limbu", category: "Senior Male Heavy", tournament: "Bagmati Open 2025", score: "11 – 4", winner: "Bikash Gurung", isWin: true, medal: null, date: "2025-12-08" },
  { id: 9, student: "Priya Tamang", opponent: "Gita KC", category: "U-15 Female Light", tournament: "Bagmati Open 2025", score: "6 – 3", winner: "Priya Tamang", isWin: true, medal: null, date: "2025-12-08" },
  { id: 10, student: "Sunita Rai", opponent: "Sita Rai", category: "U-15 Female", tournament: "Bagmati Open 2025", score: "2 – 7", winner: "Sita Rai", isWin: false, medal: "Bronze", date: "2025-12-07" },
];

// ─── Medal Icon ────────────────────────────────────────────────────────────────
function MedalIcon({ medal }) {
  if (!medal) return null;
  const config = {
    Gold: { bg: "bg-yellow-50 border-yellow-200", text: "text-yellow-700", emoji: "🥇" },
    Silver: { bg: "bg-slate-50 border-slate-300", text: "text-slate-600", emoji: "🥈" },
    Bronze: { bg: "bg-orange-50 border-orange-200", text: "text-orange-700", emoji: "🥉" },
  };
  const c = config[medal] || config.Bronze;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${c.bg} ${c.text}`}>
      {c.emoji} {medal}
    </span>
  );
}

// ─── Result Card ───────────────────────────────────────────────────────────────
function ResultCard({ result }) {
  return (
    <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${result.isWin ? "border-emerald-200" : "border-[#e2e8f0]"}`}>
      <div className={`h-1 ${result.isWin ? "bg-gradient-to-r from-emerald-400 to-emerald-600" : "bg-gradient-to-r from-red-300 to-red-400"}`} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{result.tournament}</p>
            <p className="text-xs text-slate-500 mt-0.5">{result.category}</p>
          </div>
          {result.medal ? <MedalIcon medal={result.medal} /> : (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${result.isWin ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-red-100 text-red-700 border border-red-200"}`}>
              {result.isWin ? "Win" : "Loss"}
            </span>
          )}
        </div>

        {/* VS Section */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl ${result.isWin ? "bg-emerald-50 border border-emerald-100" : "bg-red-50 border border-red-100"}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm ${result.isWin ? "bg-emerald-500" : "bg-red-400"}`}>
              {result.student.charAt(0)}
            </div>
            <p className="text-xs font-bold text-[#0f172a] text-center">{result.student}</p>
          </div>
          <div className="shrink-0 flex flex-col items-center">
            <p className="text-base font-black text-[#0f172a] tabular-nums">{result.score}</p>
          </div>
          <div className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl ${!result.isWin ? "bg-emerald-50 border border-emerald-100" : "bg-slate-50 border border-slate-200"}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm ${!result.isWin ? "bg-emerald-500" : "bg-slate-400"}`}>
              {result.opponent.charAt(0)}
            </div>
            <p className="text-xs font-bold text-[#0f172a] text-center">{result.opponent}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Winner: <span className="font-semibold text-[#0f172a]">{result.winner}</span></span>
          <span>{new Date(result.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Mini Donut Chart ──────────────────────────────────────────────────────────
function DonutChart({ wins, losses }) {
  const total = wins + losses;
  if (total === 0) return null;
  const winPct = Math.round((wins / total) * 100);
  const r = 40;
  const circ = 2 * Math.PI * r;
  const winDash = (wins / total) * circ;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="rotate-[-90deg] w-24 h-24">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#f1f5f9" strokeWidth="12" />
          <circle
            cx="50" cy="50" r={r}
            fill="none"
            stroke="#10b981"
            strokeWidth="12"
            strokeDasharray={`${winDash} ${circ}`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-[#0f172a]">{winPct}%</span>
        </div>
      </div>
      <p className="text-xs font-semibold text-slate-500">Win Rate</p>
    </div>
  );
}

// ─── Medal Bar Chart ───────────────────────────────────────────────────────────
function MedalBarChart({ gold, silver, bronze }) {
  const max = Math.max(gold, silver, bronze, 1);
  const bars = [
    { label: "Gold", count: gold, color: "bg-yellow-400", textColor: "text-yellow-700" },
    { label: "Silver", count: silver, color: "bg-slate-300", textColor: "text-slate-600" },
    { label: "Bronze", count: bronze, color: "bg-orange-400", textColor: "text-orange-700" },
  ];
  return (
    <div className="space-y-3">
      {bars.map((b) => (
        <div key={b.label} className="flex items-center gap-3">
          <span className="text-xs font-semibold w-12 text-slate-500">{b.label}</span>
          <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${b.color} rounded-full transition-all duration-700`}
              style={{ width: `${(b.count / max) * 100}%` }}
            />
          </div>
          <span className={`text-sm font-bold w-6 text-right ${b.textColor}`}>{b.count}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Results Page ─────────────────────────────────────────────────────────
export default function ResultsPage() {
  const [filter, setFilter] = useState("All"); // All | Wins | Losses
  const [search, setSearch] = useState("");

  const wins = MOCK_RESULTS.filter((r) => r.isWin).length;
  const losses = MOCK_RESULTS.filter((r) => !r.isWin).length;
  const gold = MOCK_RESULTS.filter((r) => r.medal === "Gold").length;
  const silver = MOCK_RESULTS.filter((r) => r.medal === "Silver").length;
  const bronze = MOCK_RESULTS.filter((r) => r.medal === "Bronze").length;

  const filtered = MOCK_RESULTS.filter((r) => {
    const matchSearch = r.student.toLowerCase().includes(search.toLowerCase()) ||
      r.opponent.toLowerCase().includes(search.toLowerCase()) ||
      r.tournament.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || (filter === "Wins" && r.isWin) || (filter === "Losses" && !r.isWin);
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Results</h1>
        <p className="text-sm text-slate-500 mt-0.5">Review completed match results and team statistics</p>
      </div>

      {/* Stats + Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* Summary Stats */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6">
          <h2 className="text-sm font-bold text-[#0f172a] mb-5 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-[#1D4ED8] inline-block" />
            Team Stats
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total Matches", val: MOCK_RESULTS.length, color: "text-[#0f172a]" },
              { label: "Total Wins", val: wins, color: "text-emerald-600" },
              { label: "Total Losses", val: losses, color: "text-red-500" },
              { label: "Total Medals", val: gold + silver + bronze, color: "text-amber-600" },
            ].map((s) => (
              <div key={s.label} className="bg-[#f8fafc] rounded-xl p-3 text-center border border-[#e2e8f0]">
                <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5 uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Win Rate Donut */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6 flex flex-col items-center justify-center gap-4">
          <h2 className="text-sm font-bold text-[#0f172a] self-start flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-emerald-500 inline-block" />
            Win Rate
          </h2>
          <DonutChart wins={wins} losses={losses} />
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-600 font-medium">{wins} Wins</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <span className="text-slate-600 font-medium">{losses} Losses</span>
            </div>
          </div>
        </div>

        {/* Medal Distribution */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6">
          <h2 className="text-sm font-bold text-[#0f172a] mb-5 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-amber-400 inline-block" />
            Medal Distribution
          </h2>
          <div className="flex justify-center gap-6 mb-5">
            {[
              { emoji: "🥇", count: gold, label: "Gold" },
              { emoji: "🥈", count: silver, label: "Silver" },
              { emoji: "🥉", count: bronze, label: "Bronze" },
            ].map((m) => (
              <div key={m.label} className="flex flex-col items-center gap-1">
                <span className="text-3xl">{m.emoji}</span>
                <span className="text-xl font-bold text-[#0f172a]">{m.count}</span>
                <span className="text-xs text-slate-500">{m.label}</span>
              </div>
            ))}
          </div>
          <MedalBarChart gold={gold} silver={silver} bronze={bronze} />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by athlete, opponent, or tournament..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8]"
          />
        </div>
        <div className="flex gap-1.5">
          {["All", "Wins", "Losses"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f ? "bg-[#1D4ED8] text-white" : "text-slate-500 hover:bg-slate-100"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Result Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((r) => <ResultCard key={r.id} result={r} />)}
      </div>
    </div>
  );
}

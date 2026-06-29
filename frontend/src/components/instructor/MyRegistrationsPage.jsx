import { useState } from "react";

// ─── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    Approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Rejected: "bg-red-100 text-red-700 border-red-200",
    Withdrawn: "bg-slate-100 text-slate-600 border-slate-200",
  };
  const dots = {
    Pending: "bg-amber-500",
    Approved: "bg-emerald-500",
    Rejected: "bg-red-500",
    Withdrawn: "bg-slate-400",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${map[status] || map.Pending}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || dots.Pending}`} />
      {status}
    </span>
  );
}

// ─── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_REGISTRATIONS = [
  { id: 1, student: "Aarav Sharma", tournament: "National Open Championship 2026", category: "U-12 Male Light (27–33kg)", regDate: "2026-06-25", status: "Approved", deadline: "2026-07-05", canWithdraw: true },
  { id: 2, student: "Priya Tamang", tournament: "National Open Championship 2026", category: "U-15 Female Light (Under 42kg)", regDate: "2026-06-25", status: "Pending", deadline: "2026-07-05", canWithdraw: true },
  { id: 3, student: "Sunita Rai", tournament: "Provincial Qualifier – Bagmati", category: "U-15 Female Middle (42–50kg)", regDate: "2026-06-20", status: "Approved", deadline: "2026-07-25", canWithdraw: true },
  { id: 4, student: "Bikash Gurung", tournament: "National Open Championship 2026", category: "Senior Male Heavy (Over 80kg)", regDate: "2026-06-22", status: "Rejected", deadline: "2026-07-05", canWithdraw: false },
  { id: 5, student: "Rajan KC", tournament: "Youth Championship Cup", category: "U-12 Mixed Light", regDate: "2026-06-28", status: "Pending", deadline: "2026-08-08", canWithdraw: true },
  { id: 6, student: "Anita Thapa", tournament: "Youth Championship Cup", category: "U-10 Female (Under 23kg)", regDate: "2026-06-27", status: "Approved", deadline: "2026-08-08", canWithdraw: true },
  { id: 7, student: "Roshan Magar", tournament: "Club League Season 4", category: "Senior Male Middle (68–80kg)", regDate: "2026-05-10", status: "Withdrawn", deadline: "2026-05-01", canWithdraw: false },
];

// ─── View Detail Modal ─────────────────────────────────────────────────────────
function DetailModal({ reg, onClose, onWithdraw }) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-[#e2e8f0] animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-[#e2e8f0] bg-[#f8fafc] flex justify-between items-center rounded-t-3xl">
          <h2 className="text-base font-bold text-[#0f172a]">Registration Details</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-[#0f172a] p-1.5 rounded-lg hover:bg-[#e2e8f0]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-3">
          <div className="flex justify-center mb-4">
            <StatusBadge status={reg.status} />
          </div>
          {[
            { label: "Student", val: reg.student },
            { label: "Tournament", val: reg.tournament },
            { label: "Category", val: reg.category },
            { label: "Registered On", val: new Date(reg.regDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
            { label: "Reg. Deadline", val: new Date(reg.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
          ].map((d) => (
            <div key={d.label} className="flex justify-between items-start py-2 border-b border-[#f1f5f9]">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{d.label}</span>
              <span className="text-sm font-medium text-[#0f172a] text-right max-w-[60%]">{d.val}</span>
            </div>
          ))}
        </div>
        <div className="px-6 pb-6 flex gap-3">
          {reg.canWithdraw && reg.status !== "Withdrawn" && (
            <button
              onClick={() => { onWithdraw(reg.id); onClose(); }}
              className="flex-1 px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl text-sm font-semibold transition-all active:scale-95"
            >
              Withdraw
            </button>
          )}
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-[#1D4ED8] text-white rounded-xl text-sm font-semibold hover:bg-[#1e40af] transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function MyRegistrationsPage() {
  const [registrations, setRegistrations] = useState(MOCK_REGISTRATIONS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewReg, setViewReg] = useState(null);

  const statuses = ["All", "Pending", "Approved", "Rejected", "Withdrawn"];

  const filtered = registrations.filter((r) => {
    const matchSearch = r.student.toLowerCase().includes(search.toLowerCase()) ||
      r.tournament.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleWithdraw = (id) => {
    setRegistrations((prev) => prev.map((r) => r.id === id ? { ...r, status: "Withdrawn", canWithdraw: false } : r));
  };

  const counts = {
    Pending: registrations.filter((r) => r.status === "Pending").length,
    Approved: registrations.filter((r) => r.status === "Approved").length,
    Rejected: registrations.filter((r) => r.status === "Rejected").length,
    Withdrawn: registrations.filter((r) => r.status === "Withdrawn").length,
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">My Registrations</h1>
        <p className="text-sm text-slate-500 mt-0.5">Track all your athletes' tournament registrations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Pending", count: counts.Pending, bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: "⏳" },
          { label: "Approved", count: counts.Approved, bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: "✅" },
          { label: "Rejected", count: counts.Rejected, bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: "❌" },
          { label: "Withdrawn", count: counts.Withdrawn, bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", icon: "↩️" },
        ].map((c) => (
          <div key={c.label} className={`${c.bg} border ${c.border} rounded-2xl p-5 flex flex-col gap-1`}>
            <span className="text-2xl">{c.icon}</span>
            <p className={`text-2xl font-bold ${c.text}`}>{c.count}</p>
            <p className={`text-xs font-semibold ${c.text}`}>{c.label}</p>
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
            placeholder="Search by student or tournament..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8]"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {statuses.map((s) => (
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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                {["Student", "Tournament", "Category", "Reg. Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-400 text-sm">No registrations found</td>
                </tr>
              ) : filtered.map((r) => (
                <tr key={r.id} className="hover:bg-[#f8fafc] transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1D4ED8] to-[#1e3a8a] flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {r.student.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-[#0f172a]">{r.student}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 max-w-[180px]">
                    <p className="truncate font-medium text-[#0f172a]">{r.tournament}</p>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-600 max-w-[160px]">
                    <p className="truncate">{r.category}</p>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                    {new Date(r.regDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={r.status} /></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setViewReg(r)}
                        className="px-3 py-1.5 text-xs font-semibold text-[#1D4ED8] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        View
                      </button>
                      {r.canWithdraw && r.status !== "Withdrawn" && (
                        <button
                          onClick={() => handleWithdraw(r.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {viewReg && (
        <DetailModal reg={viewReg} onClose={() => setViewReg(null)} onWithdraw={handleWithdraw} />
      )}
    </div>
  );
}

import { useState, useEffect } from "react";

// ─── Status Badge Component ───────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    DRAFT: "bg-slate-100 text-slate-700 border-slate-200",
    OPEN: "bg-blue-100 text-blue-700 border-blue-200",
    CLOSED: "bg-red-100 text-red-700 border-red-200",
    ONGOING: "bg-emerald-100 text-emerald-700 border-emerald-200",
    COMPLETED: "bg-purple-100 text-purple-700 border-purple-200",
  };

  const label = status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "Draft";

  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${map[status?.toUpperCase()] || map.DRAFT}`}>
      {label}
    </span>
  );
}

// ─── Tournament Card Component ─────────────────────────────────────────────────
function TournamentCard({ tournament }) {
  const { name, location, start_date, end_date, registration_deadline, status } = tournament;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
            🥋
          </div>
          <StatusBadge status={status} />
        </div>
        <h3 className="text-lg font-bold text-[#0f172a] mb-2 leading-tight group-hover:text-[#1D4ED8] transition-colors">
          {name}
        </h3>
        <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-4">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location || "Online"}
        </p>
      </div>

      <div className="border-t border-[#f1f5f9] pt-4 mt-2 flex flex-col gap-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Event Date:</span>
          <span className="font-medium text-[#0f172a]">
            {formatDate(start_date)} - {formatDate(end_date)}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Reg. Deadline:</span>
          <span className={`font-medium ${registration_deadline && new Date(registration_deadline) < new Date() ? "text-red-500" : "text-[#0f172a]"}`}>
            {formatDate(registration_deadline)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Tournament Page Component ──────────────────────────────────────────
export default function TournamentPage({ setActivePage, user }) {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    start_date: "",
    end_date: "",
    registration_deadline: "",
    status: "DRAFT",
  });

  const fetchTournaments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:4000/tournaments");
      if (!response.ok) {
        throw new Error("Failed to load tournaments");
      }
      const data = await response.json();
      setTournaments(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError("");

    // Validate dates
    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      setFormError("Start date cannot be after end date.");
      setFormSubmitting(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/tournaments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to create tournament");
      }

      // Refresh list, close modal, reset form
      await fetchTournaments();
      setIsModalOpen(false);
      setFormData({
        name: "",
        location: "",
        start_date: "",
        end_date: "",
        registration_deadline: "",
        status: "DRAFT",
      });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Filtered Tournaments
  const filteredTournaments = tournaments.filter((t) => {
    const matchesSearch =
      (t.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (t.location?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const matchesFilter =
      statusFilter === "ALL" || t.status?.toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesFilter;
  });

  const filterTabs = [
    { label: "All Tournaments", value: "ALL" },
    { label: "Drafts", value: "DRAFT" },
    { label: "Open", value: "OPEN" },
    { label: "Ongoing", value: "ONGOING" },
    { label: "Closed", value: "CLOSED" },
    { label: "Completed", value: "COMPLETED" },
  ];

  return (
    <div className="p-6 sm:p-8 md:p-10 animate-in slide-in-from-top-4 fade-in duration-500 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setActivePage("dashboard")}
              className="text-slate-500 hover:text-[#1D4ED8] transition-colors p-1 rounded-lg hover:bg-slate-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a]">Championships</h1>
          </div>
          <p className="text-sm text-slate-500">Manage and browse your Taekwondo leagues & tournaments</p>
        </div>

        {user?.role === "ADMIN" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1D4ED8] text-white rounded-xl font-semibold hover:bg-[#1e40af] transition-all hover:shadow-lg hover:shadow-blue-200 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Tournament
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#e2e8f0] shadow-sm mb-8 flex flex-col md:flex-row justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                statusFilter === tab.value
                  ? "bg-[#1D4ED8] text-white shadow-sm"
                  : "text-slate-500 hover:text-[#0f172a] hover:bg-[#f8fafc]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[280px]">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8]"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-10 h-10 border-4 border-[#1D4ED8] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Loading tournaments...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-700 max-w-md mx-auto my-12">
          <p className="font-semibold mb-2">Something went wrong</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchTournaments}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : filteredTournaments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] py-16 px-6 text-center max-w-lg mx-auto w-full">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-lg font-bold text-[#0f172a] mb-1">No Tournaments Found</h3>
          <p className="text-sm text-slate-500 mb-6">
            We couldn't find any tournaments matching your query or filter parameters.
          </p>
          {user?.role === "ADMIN" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-[#1D4ED8] text-white rounded-xl text-sm font-semibold hover:bg-[#1e40af]"
            >
              Add Your First Tournament
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((t) => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-[#e2e8f0] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-[#e2e8f0] flex justify-between items-center bg-[#f8fafc]">
              <h2 className="text-lg font-bold text-[#0f172a]">Create New Tournament</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-[#0f172a] transition-colors p-1 rounded-lg hover:bg-[#e2e8f0]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-sm font-medium">
                  ⚠️ {formError}
                </div>
              )}

              {/* Tournament Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Tournament Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. National Taekwondo League 2026"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8]"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Kathmandu, Nepal"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8]"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    required
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    required
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8]"
                  />
                </div>
              </div>

              {/* Deadline & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Reg. Deadline
                  </label>
                  <input
                    type="date"
                    name="registration_deadline"
                    value={formData.registration_deadline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm bg-white focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8]"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="OPEN">Open (Registrations)</option>
                    <option value="ONGOING">Ongoing (Active)</option>
                    <option value="CLOSED">Closed (Reg. Closed)</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-[#e2e8f0] text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2.5 bg-[#1D4ED8] text-white rounded-xl text-sm font-semibold hover:bg-[#1e40af] active:scale-95 transition-all shadow-md shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {formSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";

// ─── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_STUDENTS = [
  { id: 1, name: "Aarav Sharma", dob: "2012-03-15", gender: "Male", belt: "Blue", weight: 45.2, experience: "Intermediate" },
  { id: 2, name: "Priya Tamang", dob: "2011-07-22", gender: "Female", belt: "Green", weight: 38.5, experience: "Intermediate" },
  { id: 3, name: "Rajan KC", dob: "2013-01-10", gender: "Male", belt: "Yellow", weight: 32.0, experience: "Beginner" },
  { id: 4, name: "Sunita Rai", dob: "2010-11-05", gender: "Female", belt: "Red", weight: 52.0, experience: "Advanced" },
  { id: 5, name: "Bikash Gurung", dob: "2009-06-18", gender: "Male", belt: "Black", weight: 68.5, experience: "Elite" },
  { id: 6, name: "Anita Thapa", dob: "2014-09-30", gender: "Female", belt: "White", weight: 28.0, experience: "Beginner" },
];

const MOCK_TOURNAMENTS = [
  {
    id: 1,
    name: "National Open Championship 2026",
    organizer: "Nepal Taekwondo Association",
    venue: "Dasharath Stadium, Kathmandu",
    date: "Jul 15 – 17, 2026",
    deadline: "2026-07-05",
    categories: [
      { id: "c1", name: "U-12 Male Fin (Under 27kg)", gender: "Male", minAge: 8, maxAge: 12, minWeight: 0, maxWeight: 27, belts: ["White","Yellow","Orange","Green"] },
      { id: "c2", name: "U-12 Male Light (27–33kg)", gender: "Male", minAge: 8, maxAge: 12, minWeight: 27, maxWeight: 33, belts: ["White","Yellow","Orange","Green"] },
      { id: "c3", name: "U-12 Female Fin (Under 25kg)", gender: "Female", minAge: 8, maxAge: 12, minWeight: 0, maxWeight: 25, belts: ["White","Yellow","Orange","Green"] },
      { id: "c4", name: "U-15 Male Light (Under 45kg)", gender: "Male", minAge: 12, maxAge: 15, minWeight: 0, maxWeight: 45, belts: ["Yellow","Orange","Green","Blue"] },
      { id: "c5", name: "U-15 Male Welter (45–55kg)", gender: "Male", minAge: 12, maxAge: 15, minWeight: 45, maxWeight: 55, belts: ["Yellow","Orange","Green","Blue"] },
      { id: "c6", name: "U-15 Female Light (Under 42kg)", gender: "Female", minAge: 12, maxAge: 15, minWeight: 0, maxWeight: 42, belts: ["Yellow","Orange","Green","Blue"] },
      { id: "c7", name: "U-18 Male Middle (Under 63kg)", gender: "Male", minAge: 15, maxAge: 18, minWeight: 0, maxWeight: 63, belts: ["Green","Blue","Red","Black"] },
      { id: "c8", name: "Senior Male Heavy (Over 80kg)", gender: "Male", minAge: 17, maxAge: 99, minWeight: 80, maxWeight: 999, belts: ["Blue","Red","Black"] },
    ],
  },
  {
    id: 2,
    name: "Provincial Qualifier – Bagmati",
    organizer: "Bagmati Province TKD",
    venue: "Lalitpur Sports Complex",
    date: "Aug 2 – 3, 2026",
    deadline: "2026-07-25",
    categories: [
      { id: "b1", name: "U-12 Male All (Under 35kg)", gender: "Male", minAge: 8, maxAge: 12, minWeight: 0, maxWeight: 35, belts: ["White","Yellow","Orange","Green"] },
      { id: "b2", name: "U-15 Female Middle (42–50kg)", gender: "Female", minAge: 12, maxAge: 15, minWeight: 42, maxWeight: 50, belts: ["Green","Blue","Red"] },
    ],
  },
  {
    id: 3,
    name: "Youth Championship Cup",
    organizer: "Nepal Youth Sports Board",
    venue: "ANFA Complex, Satdobato",
    date: "Aug 20 – 21, 2026",
    deadline: "2026-08-08",
    categories: [
      { id: "y1", name: "U-10 Male (Under 25kg)", gender: "Male", minAge: 6, maxAge: 10, minWeight: 0, maxWeight: 25, belts: ["White","Yellow"] },
      { id: "y2", name: "U-10 Female (Under 23kg)", gender: "Female", minAge: 6, maxAge: 10, minWeight: 0, maxWeight: 23, belts: ["White","Yellow"] },
      { id: "y3", name: "U-12 Mixed Light", gender: "Male", minAge: 10, maxAge: 12, minWeight: 25, maxWeight: 33, belts: ["Yellow","Orange","Green"] },
    ],
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
const getAge = (dob) => {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const getEligibleCategories = (student, tournament) => {
  if (!student || !tournament) return [];
  const age = getAge(student.dob);
  return tournament.categories.filter((cat) => {
    const ageOk = age >= cat.minAge && age <= cat.maxAge;
    const weightOk = student.weight >= cat.minWeight && student.weight <= cat.maxWeight;
    const genderOk = cat.gender === student.gender || cat.gender === "Any";
    const beltOk = cat.belts.includes(student.belt);
    return ageOk && weightOk && genderOk && beltOk;
  });
};

// ─── Step Indicator ────────────────────────────────────────────────────────────
function StepIndicator({ step }) {
  const steps = ["Select Athlete", "Choose Category", "Review & Submit"];
  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = step > idx;
        const active = step === idx;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${done ? "bg-emerald-500 text-white" : active ? "bg-[#1D4ED8] text-white ring-4 ring-blue-100" : "bg-slate-100 text-slate-400"}`}>
                {done ? "✓" : idx}
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap ${active ? "text-[#1D4ED8]" : done ? "text-emerald-600" : "text-slate-400"}`}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-16 h-0.5 mb-4 mx-1 transition-all duration-300 ${done ? "bg-emerald-400" : "bg-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Registration Modal ────────────────────────────────────────────────────────
function RegisterModal({ tournament, onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const eligibleCategories = selectedStudent ? getEligibleCategories(selectedStudent, tournament) : [];

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      onSubmit({ student: selectedStudent, category: selectedCategory, tournament });
      onClose();
      setSubmitting(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-[#e2e8f0] animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#e2e8f0] bg-[#f8fafc] shrink-0 rounded-t-3xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-bold text-[#0f172a]">Register Athlete</h2>
              <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{tournament.name}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-[#0f172a] p-1.5 rounded-lg hover:bg-[#e2e8f0]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <StepIndicator step={step} />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Select Student */}
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-[#0f172a] mb-4">Select an athlete from your roster:</p>
              {MOCK_STUDENTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedStudent(s); setSelectedCategory(null); }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${selectedStudent?.id === s.id ? "border-[#1D4ED8] bg-blue-50" : "border-[#e2e8f0] hover:border-slate-300 hover:bg-slate-50"}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1D4ED8] to-[#1e3a8a] flex items-center justify-center text-white font-bold shrink-0">
                    {s.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#0f172a]">{s.name}</p>
                    <p className="text-xs text-slate-500">Age {getAge(s.dob)} · {s.gender} · {s.belt} belt · {s.weight}kg</p>
                  </div>
                  {selectedStudent?.id === s.id && (
                    <div className="w-5 h-5 rounded-full bg-[#1D4ED8] flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Choose Category */}
          {step === 2 && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#1D4ED8] flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {selectedStudent?.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0f172a]">{selectedStudent?.name}</p>
                  <p className="text-xs text-slate-500">Age {getAge(selectedStudent?.dob)} · {selectedStudent?.gender} · {selectedStudent?.belt} belt · {selectedStudent?.weight}kg</p>
                </div>
              </div>

              {eligibleCategories.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🚫</div>
                  <p className="text-sm font-semibold text-[#0f172a]">No eligible categories</p>
                  <p className="text-xs text-slate-500 mt-1">This athlete doesn't meet the criteria for any available category in this tournament.</p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-slate-500 mb-3 font-medium">
                    {eligibleCategories.length} eligible {eligibleCategories.length === 1 ? "category" : "categories"} found based on age, weight, belt & gender:
                  </p>
                  {eligibleCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${selectedCategory?.id === cat.id ? "border-[#1D4ED8] bg-blue-50" : "border-[#e2e8f0] hover:border-slate-300 hover:bg-slate-50"}`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 text-lg shrink-0">🥋</div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#0f172a]">{cat.name}</p>
                        <p className="text-xs text-slate-500">{cat.gender} · Age {cat.minAge}–{cat.maxAge} · Weight {cat.minWeight === 0 ? "Under" : cat.minWeight + "–"}{cat.maxWeight}kg</p>
                      </div>
                      {selectedCategory?.id === cat.id && (
                        <div className="w-5 h-5 rounded-full bg-[#1D4ED8] flex items-center justify-center shrink-0">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-[#0f172a]">Review your registration before submitting:</p>
              <div className="bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] divide-y divide-[#e2e8f0]">
                {[
                  { label: "Tournament", val: tournament.name },
                  { label: "Venue", val: tournament.venue },
                  { label: "Date", val: tournament.date },
                  { label: "Deadline", val: new Date(tournament.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
                  { label: "Athlete", val: selectedStudent?.name },
                  { label: "Category", val: selectedCategory?.name },
                  { label: "Weight Class", val: `${selectedCategory?.minWeight === 0 ? "Under " : selectedCategory?.minWeight + "–"}${selectedCategory?.maxWeight}kg` },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between items-center px-5 py-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{r.label}</span>
                    <span className="text-sm font-medium text-[#0f172a] text-right max-w-[60%]">{r.val}</span>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-700">
                <p className="font-semibold mb-1">📋 Note</p>
                <p>Registration will be submitted for review. You'll receive a notification once it's approved by the tournament organizer.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#e2e8f0] bg-[#f8fafc] shrink-0 flex justify-between gap-3 rounded-b-3xl">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="px-5 py-2.5 border border-[#e2e8f0] text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-all">
              ← Back
            </button>
          ) : (
            <button onClick={onClose} className="px-5 py-2.5 border border-[#e2e8f0] text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-all">
              Cancel
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={(step === 1 && !selectedStudent) || (step === 2 && !selectedCategory)}
              className="px-5 py-2.5 bg-[#1D4ED8] text-white rounded-xl text-sm font-semibold hover:bg-[#1e40af] transition-all active:scale-95 shadow-md shadow-blue-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all active:scale-95 shadow-md shadow-emerald-100 disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting...</>
              ) : (
                "✓ Submit Registration"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tournament Card ───────────────────────────────────────────────────────────
function TournamentCard({ tournament, onRegister }) {
  const deadlineDate = new Date(tournament.deadline);
  const isUrgent = (deadlineDate - new Date()) / (1000 * 60 * 60 * 24) < 7;
  const isPast = deadlineDate < new Date();

  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col overflow-hidden group">
      <div className="h-1.5 bg-gradient-to-r from-[#1D4ED8] to-[#3b82f6]" />
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">🏆</div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-[#0f172a] leading-tight group-hover:text-[#1D4ED8] transition-colors">{tournament.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{tournament.organizer}</p>
          </div>
        </div>
        <div className="space-y-1.5 text-xs text-[#64748b]">
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {tournament.date}
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {tournament.venue}
          </div>
          <div className={`flex items-center gap-2 font-medium ${isPast ? "text-red-500" : isUrgent ? "text-orange-600" : "text-slate-600"}`}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Deadline: {deadlineDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            {isUrgent && !isPast && " · Closing soon!"}
            {isPast && " · Closed"}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">{tournament.categories.length} Categories Available</p>
          <div className="flex flex-wrap gap-1">
            {tournament.categories.slice(0, 3).map((c) => (
              <span key={c.id} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{c.name.split(" ").slice(0, 3).join(" ")}</span>
            ))}
            {tournament.categories.length > 3 && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">+{tournament.categories.length - 3}</span>
            )}
          </div>
        </div>
      </div>
      <div className="px-5 pb-5">
        <button
          onClick={() => !isPast && onRegister(tournament)}
          disabled={isPast}
          className="w-full py-2.5 bg-[#1D4ED8] hover:bg-[#1e40af] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-md hover:shadow-blue-200 active:scale-95"
        >
          {isPast ? "Registration Closed" : "Register Athlete"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function TournamentRegistrationPage() {
  const [search, setSearch] = useState("");
  const [activeTournament, setActiveTournament] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const filtered = MOCK_TOURNAMENTS.filter(
    (t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.venue.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = ({ student, category, tournament }) => {
    setSuccessMsg(`✅ ${student.name} registered for "${category.name}" in ${tournament.name}!`);
    setTimeout(() => setSuccessMsg(""), 5000);
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Tournament Registration</h1>
          <p className="text-sm text-slate-500 mt-0.5">Browse open tournaments and register your athletes</p>
        </div>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="mb-6 flex items-center gap-3 px-5 py-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-sm font-medium animate-in fade-in duration-300">
          <span className="text-lg">🎉</span>
          {successMsg}
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-4 mb-8">
        <div className="relative max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search tournaments by name or venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8]"
          />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((t) => (
          <TournamentCard key={t.id} tournament={t} onRegister={setActiveTournament} />
        ))}
      </div>

      {/* Registration Modal */}
      {activeTournament && (
        <RegisterModal
          tournament={activeTournament}
          onClose={() => setActiveTournament(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

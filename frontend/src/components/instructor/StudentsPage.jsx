import { useState, useEffect } from "react";

// ─── Belt Badge ────────────────────────────────────────────────────────────────
function BeltBadge({ belt }) {
  const beltColors = {
    "White": "bg-slate-100 text-slate-700 border-slate-300",
    "Yellow": "bg-yellow-100 text-yellow-800 border-yellow-300",
    "Orange": "bg-orange-100 text-orange-700 border-orange-300",
    "Green": "bg-green-100 text-green-700 border-green-300",
    "Blue": "bg-blue-100 text-blue-700 border-blue-300",
    "Red": "bg-red-100 text-red-700 border-red-300",
    "Black": "bg-slate-900 text-white border-slate-700",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${beltColors[belt] || beltColors["White"]}`}>
      {belt}
    </span>
  );
}

// ─── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    "Active": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Inactive": "bg-slate-100 text-slate-600 border-slate-200",
    "Injured": "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${map[status] || map["Active"]}`}>
      {status}
    </span>
  );
}

// ─── Add/Edit Student Modal ────────────────────────────────────────────────────
function StudentModal({ student, onClose, onSave }) {
  const [form, setForm] = useState(student || {
    name: "", dob: "", gender: "Male", belt: "White",
    weight: "", experience: "Beginner", medicalNotes: "",
    emergencyContact: "", status: "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const inputClass = "w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8]";
  const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-[#e2e8f0] animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#e2e8f0] flex justify-between items-center bg-[#f8fafc] shrink-0">
          <div>
            <h2 className="text-lg font-bold text-[#0f172a]">{student ? "Edit Student" : "Add New Student"}</h2>
            <p className="text-xs text-slate-500 mt-0.5">Fill in the student's details below</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-[#0f172a] transition-colors p-1.5 rounded-lg hover:bg-[#e2e8f0]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto">
          {/* Name + DOB */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
              <input name="name" required value={form.name} onChange={handleChange} placeholder="e.g. Aarav Sharma" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Date of Birth <span className="text-red-500">*</span></label>
              <input name="dob" type="date" required value={form.dob} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {/* Gender + Belt */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Gender <span className="text-red-500">*</span></label>
              <select name="gender" value={form.gender} onChange={handleChange} className={`${inputClass} bg-white`}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Belt Rank <span className="text-red-500">*</span></label>
              <select name="belt" value={form.belt} onChange={handleChange} className={`${inputClass} bg-white`}>
                {["White", "Yellow", "Orange", "Green", "Blue", "Red", "Black"].map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Weight + Experience */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Weight (kg) <span className="text-red-500">*</span></label>
              <input name="weight" type="number" step="0.1" required value={form.weight} onChange={handleChange} placeholder="e.g. 45.5" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Experience Level</label>
              <select name="experience" value={form.experience} onChange={handleChange} className={`${inputClass} bg-white`}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Elite</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className={labelClass}>Status</label>
            <select name="status" value={form.status} onChange={handleChange} className={`${inputClass} bg-white`}>
              <option>Active</option>
              <option>Inactive</option>
              <option>Injured</option>
            </select>
          </div>

          {/* Medical Notes */}
          <div>
            <label className={labelClass}>Medical Notes</label>
            <textarea
              name="medicalNotes"
              value={form.medicalNotes}
              onChange={handleChange}
              rows={2}
              placeholder="Any medical conditions, allergies, or special notes..."
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Emergency Contact */}
          <div>
            <label className={labelClass}>Emergency Contact</label>
            <input name="emergencyContact" value={form.emergencyContact} onChange={handleChange} placeholder="e.g. Parent: +977-98XXXXXXXX" className={inputClass} />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-[#e2e8f0] text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 active:scale-95 transition-all">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 bg-[#1D4ED8] text-white rounded-xl text-sm font-semibold hover:bg-[#1e40af] active:scale-95 transition-all shadow-md shadow-blue-100">
              {student ? "Save Changes" : "Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteModal({ student, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-[#e2e8f0] animate-in zoom-in-95 duration-200 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-[#0f172a] mb-1">Remove Student?</h3>
        <p className="text-sm text-slate-500 mb-6">
          Are you sure you want to remove <span className="font-semibold text-[#0f172a]">{student.name}</span> from your roster? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-[#e2e8f0] text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all">Cancel</button>
          <button onClick={() => { onConfirm(student.id); onClose(); }} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-all active:scale-95">
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Initial student data ──────────────────────────────────────────────────────
const INITIAL_STUDENTS = [
  { id: 1, name: "Aarav Sharma", dob: "2012-03-15", gender: "Male", belt: "Blue", weight: 45.2, experience: "Intermediate", status: "Active", medicalNotes: "", emergencyContact: "Father: +977-9841000001" },
  { id: 2, name: "Priya Tamang", dob: "2011-07-22", gender: "Female", belt: "Green", weight: 38.5, experience: "Intermediate", status: "Active", medicalNotes: "Mild asthma", emergencyContact: "Mother: +977-9841000002" },
  { id: 3, name: "Rajan KC", dob: "2013-01-10", gender: "Male", belt: "Yellow", weight: 32.0, experience: "Beginner", status: "Active", medicalNotes: "", emergencyContact: "Father: +977-9841000003" },
  { id: 4, name: "Sunita Rai", dob: "2010-11-05", gender: "Female", belt: "Red", weight: 52.0, experience: "Advanced", status: "Active", medicalNotes: "", emergencyContact: "Guardian: +977-9841000004" },
  { id: 5, name: "Bikash Gurung", dob: "2009-06-18", gender: "Male", belt: "Black", weight: 68.5, experience: "Elite", status: "Active", medicalNotes: "Previous knee injury — 2024", emergencyContact: "Mother: +977-9841000005" },
  { id: 6, name: "Anita Thapa", dob: "2014-09-30", gender: "Female", belt: "White", weight: 28.0, experience: "Beginner", status: "Active", medicalNotes: "", emergencyContact: "Father: +977-9841000006" },
  { id: 7, name: "Roshan Magar", dob: "2008-04-12", gender: "Male", belt: "Black", weight: 74.0, experience: "Elite", status: "Injured", medicalNotes: "Sprained ankle — rest 4 weeks", emergencyContact: "Father: +977-9841000007" },
  { id: 8, name: "Kabita Lama", dob: "2012-12-01", gender: "Female", belt: "Orange", weight: 36.5, experience: "Beginner", status: "Active", medicalNotes: "", emergencyContact: "Mother: +977-9841000008" },
  { id: 9, name: "Suresh Limbu", dob: "2011-08-14", gender: "Male", belt: "Blue", weight: 48.0, experience: "Intermediate", status: "Inactive", medicalNotes: "", emergencyContact: "Guardian: +977-9841000009" },
  { id: 10, name: "Nisha Shrestha", dob: "2013-05-27", gender: "Female", belt: "Yellow", weight: 30.5, experience: "Beginner", status: "Active", medicalNotes: "", emergencyContact: "Mother: +977-9841000010" },
];

// ─── Helper: age from DOB ──────────────────────────────────────────────────────
const getAge = (dob) => {
  if (!dob) return "—";
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

// ─── Main Students Page ────────────────────────────────────────────────────────
export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [beltFilter, setBeltFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modal, setModal] = useState(null); // null | { type: "add" | "edit" | "delete", data }
  const [viewStudent, setViewStudent] = useState(null);

  const belts = ["All", "White", "Yellow", "Orange", "Green", "Blue", "Red", "Black"];
  const statuses = ["All", "Active", "Inactive", "Injured"];

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("http://localhost:4000/students", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        const formatted = data.message.map((s) => {
          const rawBelt = s.current_belt || s.belt || 'White';
          const formattedBelt = rawBelt.charAt(0).toUpperCase() + rawBelt.slice(1).toLowerCase();
          return {
            id: s.id,
            name: s.name || `${s.first_name} ${s.last_name || ''}`.trim(),
            dob: s.date_of_birth ? new Date(s.date_of_birth).toISOString().split('T')[0] : '',
            gender: s.gender ? s.gender.charAt(0).toUpperCase() + s.gender.slice(1).toLowerCase() : 'Male',
            belt: formattedBelt,
            weight: s.current_weight ? parseFloat(s.current_weight) : (s.weight ? parseFloat(s.weight) : 0),
            experience: s.fight_experience === 'FRESHER' ? 'Beginner' : 'Intermediate',
            status: s.is_active === false ? 'Inactive' : 'Active',
            medicalNotes: s.medicalNotes || '',
            emergencyContact: s.emergencyContact || '',
          };
        });
        setStudents(formatted);
      } else {
        setError(data.message || "Failed to fetch students");
      }
    } catch (err) {
      console.error(err);
      setError("Network error fetching students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.belt.toLowerCase().includes(search.toLowerCase());
    const matchBelt = beltFilter === "All" || s.belt === beltFilter;
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    return matchSearch && matchBelt && matchStatus;
  });

  const handleSave = async (form) => {
    try {
      if (modal?.type === "edit") {
        setStudents((prev) => prev.map((s) => s.id === form.id ? { ...form } : s));
      } else {
        const response = await fetch("http://localhost:4000/students/addStudent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(form),
        });
        const data = await response.json();
        if (data.success) {
          fetchStudents();
        } else {
          alert(data.message || "Failed to add student to database");
        }
      }
    } catch (err) {
      console.error("Save student error:", err);
      alert("Failed to connect to backend to save student");
    }
  };

  const handleDelete = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">My Students</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your athlete roster — {students.length} students enrolled</p>
        </div>
        <button
          onClick={() => setModal({ type: "add" })}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1D4ED8] text-white rounded-xl font-semibold text-sm hover:bg-[#1e40af] transition-all hover:shadow-lg hover:shadow-blue-200 active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or belt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8]"
          />
        </div>
        {/* Belt Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Belt:</span>
          <select
            value={beltFilter}
            onChange={(e) => setBeltFilter(e.target.value)}
            className="px-3 py-2 border border-[#e2e8f0] rounded-xl text-sm bg-white focus:outline-none focus:border-[#1D4ED8]"
          >
            {belts.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-[#e2e8f0] rounded-xl text-sm bg-white focus:outline-none focus:border-[#1D4ED8]"
          >
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <span className="text-xs text-slate-400 ml-auto">{filtered.length} of {students.length} students</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                {["Name", "Age", "Gender", "Belt", "Weight", "Experience", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-slate-500 text-sm">
                    <div className="flex flex-col items-center gap-2 justify-center">
                      <div className="w-8 h-8 border-4 border-[#1D4ED8] border-t-transparent rounded-full animate-spin" />
                      <span>Loading students...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-red-500 text-sm font-semibold">
                    ⚠️ {error}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-slate-400 text-sm">
                    No students found matching your search
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-[#f8fafc] transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1D4ED8] to-[#1e3a8a] flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0f172a]">{s.name}</p>
                          <p className="text-xs text-slate-400">{s.emergencyContact ? s.emergencyContact.split(":")[0] : "No contact"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#0f172a] font-medium">{getAge(s.dob)}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{s.gender}</td>
                    <td className="px-5 py-4"><BeltBadge belt={s.belt} /></td>
                    <td className="px-5 py-4 text-sm text-[#0f172a] font-medium">{s.weight} kg</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{s.experience}</td>
                    <td className="px-5 py-4"><StatusBadge status={s.status} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setViewStudent(s)}
                          title="View Details"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#1D4ED8] hover:bg-blue-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setModal({ type: "edit", data: s })}
                          title="Edit Student"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setModal({ type: "delete", data: s })}
                          title="Delete Student"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {modal?.type === "add" && (
        <StudentModal onClose={() => setModal(null)} onSave={handleSave} />
      )}
      {modal?.type === "edit" && (
        <StudentModal student={modal.data} onClose={() => setModal(null)} onSave={handleSave} />
      )}
      {modal?.type === "delete" && (
        <DeleteModal student={modal.data} onClose={() => setModal(null)} onConfirm={handleDelete} />
      )}

      {/* View Detail Drawer */}
      {viewStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-end">
          <div className="bg-white h-full w-full max-w-sm shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="px-6 py-5 border-b border-[#e2e8f0] flex justify-between items-center bg-[#f8fafc]">
              <h2 className="text-base font-bold text-[#0f172a]">Student Details</h2>
              <button onClick={() => setViewStudent(null)} className="text-slate-400 hover:text-[#0f172a] p-1.5 rounded-lg hover:bg-[#e2e8f0]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1D4ED8] to-[#1e3a8a] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {viewStudent.name.charAt(0)}
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-[#0f172a]">{viewStudent.name}</p>
                  <p className="text-sm text-slate-500">Age {getAge(viewStudent.dob)} · {viewStudent.gender}</p>
                </div>
                <div className="flex gap-2">
                  <BeltBadge belt={viewStudent.belt} />
                  <StatusBadge status={viewStudent.status} />
                </div>
              </div>

              {/* Details */}
              {[
                { label: "Date of Birth", val: viewStudent.dob ? new Date(viewStudent.dob).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—" },
                { label: "Weight", val: `${viewStudent.weight} kg` },
                { label: "Experience Level", val: viewStudent.experience },
                { label: "Emergency Contact", val: viewStudent.emergencyContact || "—" },
              ].map((d) => (
                <div key={d.label} className="flex justify-between items-center py-2 border-b border-[#f1f5f9]">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{d.label}</span>
                  <span className="text-sm font-medium text-[#0f172a] text-right">{d.val}</span>
                </div>
              ))}

              {viewStudent.medicalNotes && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">⚠️ Medical Notes</p>
                  <p className="text-sm text-amber-900">{viewStudent.medicalNotes}</p>
                </div>
              )}
            </div>
            <div className="p-5 border-t border-[#e2e8f0] flex gap-3">
              <button
                onClick={() => { setModal({ type: "edit", data: viewStudent }); setViewStudent(null); }}
                className="flex-1 px-4 py-2.5 bg-[#1D4ED8] text-white rounded-xl text-sm font-semibold hover:bg-[#1e40af] transition-all"
              >
                Edit
              </button>
              <button onClick={() => setViewStudent(null)} className="flex-1 px-4 py-2.5 border border-[#e2e8f0] text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

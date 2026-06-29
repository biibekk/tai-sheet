import { useState } from "react";

// ─── Input Field ───────────────────────────────────────────────────────────────
function InputField({ label, type = "text", value, onChange, name, placeholder, disabled }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8] disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
      />
    </div>
  );
}

// ─── Change Password Modal ─────────────────────────────────────────────────────
function ChangePasswordModal({ onClose }) {
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.newPass.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (form.newPass !== form.confirm) { setError("Passwords do not match"); return; }
    setError("");
    setSuccess(true);
    setTimeout(onClose, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-[#e2e8f0] animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-[#e2e8f0] bg-[#f8fafc] flex justify-between items-center rounded-t-3xl">
          <h2 className="text-base font-bold text-[#0f172a]">Change Password</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-[#0f172a] p-1.5 rounded-lg hover:bg-[#e2e8f0]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {success ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-emerald-700">Password changed successfully!</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm text-red-600 font-medium">{error}</div>
              )}
              <InputField label="Current Password" type="password" name="current" value={form.current} onChange={handleChange} placeholder="••••••••" />
              <InputField label="New Password" type="password" name="newPass" value={form.newPass} onChange={handleChange} placeholder="Min. 8 characters" />
              <InputField label="Confirm New Password" type="password" name="confirm" value={form.confirm} onChange={handleChange} placeholder="••••••••" />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-[#e2e8f0] text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-[#1D4ED8] text-white rounded-xl text-sm font-semibold hover:bg-[#1e40af] transition-all active:scale-95">
                  Update
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

// ─── Main Profile Page ─────────────────────────────────────────────────────────
export default function InstructorProfile({ user }) {
  const [editing, setEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || "Ramesh Pradhan",
    email: user?.email || "ramesh.pradhan@tkd.np",
    phone: "+977-9841234567",
    academy: "Kathmandu Taekwondo Academy",
    belt: "Black (3rd Dan)",
    experience: "12 years",
    bio: "Certified Taekwondo instructor with 12 years of coaching experience. Specializing in youth development and competitive training.",
    city: "Kathmandu, Nepal",
  });
  const [form, setForm] = useState(profile);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    setProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const initials = profile.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">My Profile</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your instructor information and account settings</p>
      </div>

      {/* Success Toast */}
      {saved && (
        <div className="mb-6 flex items-center gap-3 px-5 py-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-sm font-medium animate-in fade-in duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Profile updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left: Avatar + Quick Info */}
        <div className="md:col-span-1 flex flex-col gap-5">

          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6 flex flex-col items-center gap-4 text-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#1D4ED8] to-[#1e3a8a] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-lg font-bold text-[#0f172a]">{profile.name}</p>
              <p className="text-sm text-slate-500">Taekwondo Instructor</p>
              <p className="text-xs text-[#1D4ED8] font-medium mt-1">{profile.academy}</p>
            </div>
            <div className="w-full pt-3 border-t border-[#f1f5f9] space-y-2">
              {[
                { icon: "🥋", label: profile.belt },
                { icon: "📍", label: profile.city },
                { icon: "⏱️", label: `${profile.experience} coaching` },
              ].map((d) => (
                <div key={d.label} className="flex items-center gap-2 text-xs text-slate-600">
                  <span>{d.icon}</span>
                  <span>{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Account</h3>
            <div className="space-y-2">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 border border-[#e2e8f0] transition-all text-left"
              >
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Change Password
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 border border-[#e2e8f0] transition-all text-left">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Notification Settings
              </button>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">Season Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: "12", label: "Students", color: "text-[#1D4ED8]" },
                { val: "8", label: "Registered", color: "text-violet-600" },
                { val: "14", label: "Medals", color: "text-amber-600" },
                { val: "68%", label: "Win Rate", color: "text-emerald-600" },
              ].map((s) => (
                <div key={s.label} className="bg-[#f8fafc] rounded-xl p-3 text-center border border-[#e2e8f0]">
                  <p className={`text-xl font-bold ${s.color}`}>{s.val}</p>
                  <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Profile Edit Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e2e8f0] bg-[#f8fafc]">
              <div>
                <h2 className="text-base font-bold text-[#0f172a]">Profile Information</h2>
                <p className="text-xs text-slate-500 mt-0.5">Update your personal and academy details</p>
              </div>
              {!editing && (
                <button
                  onClick={() => { setEditing(true); setForm(profile); }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1D4ED8] text-white rounded-xl text-sm font-semibold hover:bg-[#1e40af] transition-all active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleSave} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField label="Full Name" name="name" value={editing ? form.name : profile.name} onChange={handleChange} placeholder="Your full name" disabled={!editing} />
              <InputField label="Email Address" name="email" type="email" value={editing ? form.email : profile.email} onChange={handleChange} placeholder="your@email.com" disabled={!editing} />
              <InputField label="Phone Number" name="phone" value={editing ? form.phone : profile.phone} onChange={handleChange} placeholder="+977-98XXXXXXXX" disabled={!editing} />
              <InputField label="Academy / Club" name="academy" value={editing ? form.academy : profile.academy} onChange={handleChange} placeholder="Academy name" disabled={!editing} />
              <InputField label="Belt Rank" name="belt" value={editing ? form.belt : profile.belt} onChange={handleChange} placeholder="e.g. Black (3rd Dan)" disabled={!editing} />
              <InputField label="City / Location" name="city" value={editing ? form.city : profile.city} onChange={handleChange} placeholder="City, Country" disabled={!editing} />
              <InputField label="Years of Experience" name="experience" value={editing ? form.experience : profile.experience} onChange={handleChange} placeholder="e.g. 12 years" disabled={!editing} />

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Bio</label>
                <textarea
                  name="bio"
                  value={editing ? form.bio : profile.bio}
                  onChange={handleChange}
                  disabled={!editing}
                  rows={3}
                  placeholder="Brief description about yourself..."
                  className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8] resize-none disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                />
              </div>

              {editing && (
                <div className="sm:col-span-2 flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-5 py-2.5 border border-[#e2e8f0] text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all active:scale-95"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#1D4ED8] text-white rounded-xl text-sm font-semibold hover:bg-[#1e40af] transition-all active:scale-95 shadow-md shadow-blue-100"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
    </div>
  );
}

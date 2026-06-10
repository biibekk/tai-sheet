import { useState } from "react";

export default function TopBar({ user, onLogout }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifications = [
    { text: "3 new user registrations pending approval", time: "5 min ago", unread: true },
    { text: "National Open Championship draw generated", time: "1 hr ago", unread: true },
    { text: "Match schedule updated for Bagmati Qualifier", time: "3 hr ago", unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "AD";

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#e2e8f0] px-6 py-3 flex items-center justify-between gap-4 shadow-sm">

      {/* Left — Page breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs text-[#94a3b8] font-medium hidden sm:block">TaiSheet</span>
        <svg className="w-3 h-3 text-[#cbd5e1] hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-sm font-semibold text-[#0f172a]">Dashboard</span>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2 relative">

        {/* Search pill */}
        <div className="hidden md:flex items-center gap-2 bg-[#f1f5f9] rounded-xl px-3 py-2 text-sm text-[#94a3b8] hover:bg-[#e2e8f0] transition-colors cursor-pointer select-none w-44">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Quick search…</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            id="notifications-btn"
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#f1f5f9] transition-colors text-[#64748b] hover:text-[#0f172a]"
            aria-label="Notifications"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#DC2626] ring-2 ring-white"></span>
            )}
          </button>

          {/* Notif Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-[#e2e8f0] overflow-hidden z-50 animate-[fadeSlide_0.15s_ease]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#f1f5f9]">
                <p className="text-sm font-bold text-[#0f172a]">Notifications</p>
                <span className="text-xs bg-[#DC2626] text-white font-bold px-2 py-0.5 rounded-full">{unreadCount} new</span>
              </div>
              {notifications.map((n, i) => (
                <div key={i} className={`flex items-start gap-3 px-4 py-3 hover:bg-[#f8fafc] transition-colors cursor-pointer ${n.unread ? "bg-blue-50/50" : ""}`}>
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${n.unread ? "bg-[#1D4ED8]" : "bg-[#e2e8f0]"}`}></div>
                  <div>
                    <p className="text-xs text-[#0f172a] font-medium leading-snug">{n.text}</p>
                    <p className="text-xs text-[#94a3b8] mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
              <div className="px-4 py-3 border-t border-[#f1f5f9]">
                <button className="text-xs text-[#1D4ED8] font-semibold hover:underline w-full text-center">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-[#e2e8f0] mx-1"></div>

        {/* Profile */}
        <div className="relative">
          <button
            id="profile-btn"
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-[#f1f5f9] transition-colors"
            aria-label="Profile menu"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1D4ED8] to-[#1e3a8a] flex items-center justify-center text-white text-xs font-bold shadow">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-[#0f172a] leading-none">{user?.name || "Admin"}</p>
              <p className="text-xs text-[#64748b] mt-0.5 capitalize">{user?.role?.toLowerCase() || "admin"}</p>
            </div>
            <svg className="w-3.5 h-3.5 text-[#94a3b8] hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-[#e2e8f0] overflow-hidden z-50 animate-[fadeSlide_0.15s_ease]">
              <div className="px-4 py-3 border-b border-[#f1f5f9]">
                <p className="text-sm font-bold text-[#0f172a]">{user?.name || "Admin"}</p>
                <p className="text-xs text-[#64748b] truncate">{user?.email || ""}</p>
              </div>
              {[
                { icon: "👤", label: "My Profile" },
                { icon: "⚙️", label: "Settings" },
                { icon: "🔒", label: "Change Password" },
              ].map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#f8fafc] transition-colors"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              ))}
              <div className="border-t border-[#f1f5f9]">
                <button
                  id="logout-btn"
                  onClick={() => { setProfileOpen(false); onLogout(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#DC2626] hover:bg-red-50 transition-colors font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

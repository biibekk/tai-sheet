import { useState, useEffect } from "react";
import AuthPage from "./authentication";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import Dashboard from "./Dashboard";

function Home({ isLoggedIn, setIsLoggedIn, setPage }) {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [statusUpdateResult, setStatusUpdateResult] = useState({});
    const [activePage, setActivePage] = useState("dashboard");

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchPendingUsers = async () => {
            try {
                const response = await fetch("http://localhost:4000/admin/fetch-pending", {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await response.json();
                if (data.success) setPendingUsers(data.users);
            } catch (error) {
                console.log(error);
            }
        };
        if (isLoggedIn && user?.role === "ADMIN") fetchPendingUsers();
    }, [isLoggedIn]);

    const handleAcceptReject = async (email, status) => {
        try {
            const response = await fetch("http://localhost:4000/admin/approval", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, approval_status: status }),
            });
            const data = await response.json();
            if (data.success) {
                setStatusUpdateResult(data);
                setTimeout(() => setStatusUpdateResult({}), 3000);
                setPendingUsers((prev) => prev.filter((u) => u.email !== email));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
    };

    // ─── Not logged in → show auth page ──────────────────────────────────────────
    if (!isLoggedIn) {
        return <AuthPage setIsLoggedIn={setIsLoggedIn} setPage={setPage} />;
    }

    // ─── Logged in → show full dashboard shell ────────────────────────────────────
    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">

            {/* Left Sidebar */}
            <Sidebar activePage={activePage} setActivePage={setActivePage} />

            {/* Main area */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Top navigation bar */}
                <TopBar user={user} onLogout={handleLogout} />

                {/* Scrollable content area */}
                <main className="flex-1 overflow-y-auto">
                    {activePage === "dashboard" && (
                        <Dashboard
                            user={user}
                            pendingUsers={pendingUsers}
                            onApprove={(email) => handleAcceptReject(email, "APPROVED")}
                            onReject={(email) => handleAcceptReject(email, "REJECTED")}
                            statusUpdateResult={statusUpdateResult}
                        />
                    )}

                    {/* Placeholder pages for other sidebar items */}
                    {activePage !== "dashboard" && (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-12">
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#1D4ED8] to-[#1e3a8a] flex items-center justify-center shadow-xl">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-[#0f172a] capitalize">{activePage}</h2>
                                <p className="text-[#64748b] mt-2 text-sm max-w-xs">
                                    This section is coming soon. The <span className="font-semibold capitalize">{activePage}</span> module
                                    is currently under development.
                                </p>
                            </div>
                            <button
                                onClick={() => setActivePage("dashboard")}
                                className="mt-2 px-5 py-2.5 bg-[#1D4ED8] text-white rounded-xl text-sm font-semibold hover:bg-[#1e40af] transition-colors shadow-md"
                            >
                                ← Back to Dashboard
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Home;
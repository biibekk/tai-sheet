import AuthPage from "./authentication";
import { useState, useEffect } from "react";

function Home({ isLoggedIn, setIsLoggedIn, setPage }) {
    const [pendingUsers, setPendingUsers] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const [statusUpdateResult, setStatusUpdateResult] = useState({});

    useEffect(() => {
        const fetchPendingUsers = async () => {
            try {
                const response = await fetch("http://localhost:4000/admin/fetch-pending", {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await response.json();
                // console.log(data);
                if (data.success) setPendingUsers(data.users);
            } catch (error) {
                console.log(error);
            }
        }
        // Optional chaining (?.) lets you safely access properties or call methods on objects that might be null or undefined without causing an error.
        // when user not logged in and accessing home page, user is null and user?.role will be undefined so it will not throw an error
        if (isLoggedIn && user?.role === 'ADMIN') fetchPendingUsers();
    }, [isLoggedIn]);

    const handleAcceptReject = async (email, status) => {
        // console.log(email, status);
        const response = await fetch("http://localhost:4000/admin/approval", {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                approval_status: status
            })
        })
        const data = await response.json();
        // console.log(data);

        if (data.success) {
            setStatusUpdateResult(data);
            setTimeout(() => {
                setStatusUpdateResult({});
            }, 3000);
            // alert(data.message);
            // setPendingUsers(pendingUsers.filter(user => user.email !== email));
            setPendingUsers(prev =>
                prev.filter(user =>
                    user.email !== email
                )
            );
        }
    }

    if (!isLoggedIn) {
        return <AuthPage setIsLoggedIn={setIsLoggedIn} setPage={setPage} />;
    }

    return (
        <>
            <div className="welcomeMsg block w-1/2 mx-auto my-10 text-center shadow-2xl bg-slate-300 p-5 rounded-3xl">
                <h1 className="text-2xl font-semibold text-slate-500">WELCOME {user?.role} {user?.name?.toUpperCase()}</h1>
                {/* <p>Select an option from the navbar.</p> */}
            </div>

            {user?.role === "ADMIN" && (
                <div className="pendingUsers block mx-auto bg-slate-200 flex-col items-center p-3 m-3 w-8/10 rounded-2xl">
                    {pendingUsers.length === 0 &&
                        <h2 className="block mx-auto w-1/2 text-center p-2 rounded-xl bg-green-100 text-green-700 border border-green-400">No Pending Users for Approval !</h2>
                    }
                    {statusUpdateResult.message &&
                        <h2 className={`block mx-auto w-1/2 my-5 text-center p-2 rounded-xl ${statusUpdateResult.success
                            ? "bg-green-100 text-green-700 border border-green-400"
                            : "bg-red-100 text-red-700 border border-red-400"}`}>{statusUpdateResult.message}</h2>
                    }
                    {pendingUsers.length !== 0 && pendingUsers.map(user => (
                        <div key={user.id} className="flex justify-around items-center p-3">
                            <ol className="border border-gray-300 p-4 m-2 w-3/4">
                                {/* {Object.entries(user).map(([key, value]) => (
                                <li key={key}>
                                    <b>{key}:</b> {String(value)}
                                </li>
                            ))} */}
                                <li>{user.name}</li>
                                <li>{user.email}</li>
                            </ol>
                            <button
                                className="bg-green-100 text-green-700 rounded-xl p-2"
                                onClick={() => handleAcceptReject(user.email, "APPROVED")}
                            >
                                Approve
                            </button>
                            <button
                                className="bg-red-100 text-red-700 rounded-xl p-2"
                                onClick={() => handleAcceptReject(user.email, "REJECTED")}
                            >
                                Reject
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default Home;
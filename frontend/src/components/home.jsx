import AuthPage from "./authentication";
import { useState, useEffect } from "react";

function Home({ isLoggedIn, setIsLoggedIn, setPage }) {
    const [pendingUsers, setPendingUsers] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));


    useEffect(() => {
        const fetchPendingUsers = async () => {
            try {
                const response = await fetch("http://localhost:4000/admin/approval", {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "user": JSON.stringify(user)
                    },
                });
                const data = await response.json();
                // console.log(data);
                if (data.success) setPendingUsers(data.users);
            } catch (error) {
                console.log(error);
            }
        }
        fetchPendingUsers();
    }, []);

    if (!isLoggedIn) {
        return <AuthPage setIsLoggedIn={setIsLoggedIn} setPage={setPage} />;
    }

    return (
        <>
            <div className="welcomeMsg block w-1/2 mx-auto my-10 text-center shadow-2xl bg-slate-300 p-5 rounded-xl">
                <h1 className="text-2xl font-semibold text-slate-500">WELCOME {user.role} {user.name.toUpperCase()}</h1>
                {/* <p>Select an option from the navbar.</p> */}
            </div>

            <div className="pendingUsers">
                {pendingUsers.map(user => (
                    <ol key={user.id} className="border border-gray-300 p-4 m-2">
                        {Object.entries(user).map(([key, value]) => (
                            <li key={key}>
                                <b>{key}:</b> {String(value)}
                            </li>
                        ))}
                    </ol>
                ))}
            </div>
        </>
    );
}

export default Home;
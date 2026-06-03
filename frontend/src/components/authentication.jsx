import { useState, useEffect } from "react";

export default function AuthPage({ setIsLoggedIn, setPage }) {
    const [activeTab, setActiveTab] = useState("login");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => {
            setMessage("");
            setMessageType("");
        }, 2000);

        return () => clearTimeout(timer);
    }, [message]);

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const [registerData, setRegisterData] = useState({
        fullName: "",
        email: "",
        phone: "",
        beltRank: "",
        academyName: "",
        city: "",
        password: "",
        confirmPassword: "",
    });

    const handleLogin = async (e) => {
        e.preventDefault();

        const res = await fetch("http://localhost:4000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        });

        const data = await res.json();
        // console.log(data)
        if (data.success == true) {
            // console.log(data);
            setMessage("Logged in successfully");
            setMessageType("success");

            const token = data.token;
            const user = data.user;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            setIsLoggedIn(true);

            setPage("home");
        }
        else {
            // console.log(`logged in: ${data.success}, msg: ${data.message}`)
            setMessage(data.message);
            setMessageType("error");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (
            registerData.password !==
            registerData.confirmPassword
        ) {
            setMessage("Passwords do not match");
            setMessageType("error");
            return;
        }

        const res = await fetch("http://localhost:4000/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registerData)
        });

        const data = await res.json();
        if (data.success) {
            // console.log("Registered.");
            setMessage("Registered successfully");
            setMessageType("success");

            setRegisterData({
                fullName: "",
                email: "",
                phone: "",
                beltRank: "",
                academyName: "",
                city: "",
                password: "",
                confirmPassword: "",
            });

            setActiveTab("login");
        } else {
            // console.log(`Registered: ${data.success}, msg: ${data.message}`)
            setMessage(data.message);
            setMessageType("error");
        }

    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">

                {/* Header */}
                <div className="bg-blue-600 text-white p-6 text-center">
                    <h1 className="text-2xl font-bold">
                        Tournament Management
                    </h1>
                    <p className="text-blue-100 mt-1">
                        Admin & Instructor Portal
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab("login")}
                        className={`flex-1 py-3 font-medium ${activeTab === "login"
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-500"
                            }`}
                    >
                        Login
                    </button>

                    <button
                        onClick={() => setActiveTab("register")}
                        className={`flex-1 py-3 font-medium ${activeTab === "register"
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-500"
                            }`}
                    >
                        Register
                    </button>
                </div>

                {/* <div className="display-login-register-result text-center mt-4">h</div> */}
                {message && (
                    <div
                        className={`mx-auto text-center w-1/2 mt-2 p-1 rounded ${messageType === "success"
                            ? "bg-green-100 text-green-700 border border-green-400"
                            : "bg-red-100 text-red-700 border border-red-400"
                            }`}
                    >
                        {message}
                    </div>
                )}

                {/* 
                    Equivalent - if (activeTab === "login") return <form>Login Form</form>;
                    {activeTab === "login" && <LoginForm />} 
                    I can create a const LoginForm = () => {return (<form></form>)}
                */}
                {/* Login */}
                {activeTab === "login" && (
                    <form onSubmit={handleLogin} className="p-5 space-y-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={loginData.email}
                                onChange={(e) =>
                                    setLoginData({
                                        ...loginData,
                                        email: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={loginData.password}
                                onChange={(e) =>
                                    setLoginData({
                                        ...loginData,
                                        password: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <button
                            type="submit"
                            className="block w-1/3 mx-auto bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
                        >
                            Login
                        </button>
                    </form>
                )}

                {/* Register */}
                {activeTab === "register" && (
                    <form
                        onSubmit={handleRegister}
                        className="p-6 space-y-6"
                    >
                        {/* Instructor Details */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">
                                Instructor Details
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border rounded-lg px-4 py-2"
                                        value={registerData.fullName}
                                        onChange={(e) =>
                                            setRegisterData({
                                                ...registerData,
                                                fullName: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="flex justify-between gap-3">
                                    <div className="w-2/3">
                                        <label className="block mb-1 text-sm font-medium">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full border rounded-lg px-4 py-2"
                                            value={registerData.email}
                                            onChange={(e) =>
                                                setRegisterData({
                                                    ...registerData,
                                                    email: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="w-1/3">
                                        <label className="block mb-1 text-sm font-medium">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            maxLength={10}
                                            pattern="[0-9]{10}"
                                            title="Phone number must be exactly 10 digits"
                                            className="w-full border rounded-lg px-4 py-2"
                                            value={registerData.phone}
                                            onChange={(e) =>
                                                setRegisterData({
                                                    ...registerData,
                                                    phone: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="w-1/2">
                                    <label className="block mb-1 text-sm font-medium">
                                        Belt Rank
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. 1st Dan Black Belt"
                                        className="w-full border rounded-lg px-4 py-2"
                                        value={registerData.beltRank}
                                        onChange={(e) =>
                                            setRegisterData({
                                                ...registerData,
                                                beltRank: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="flex justify-between gap-3">
                                    <div className="w-1/2">
                                        <label className="block mb-1 text-sm font-medium">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            className="w-full border rounded-lg px-4 py-2"
                                            value={registerData.password}
                                            onChange={(e) =>
                                                setRegisterData({
                                                    ...registerData,
                                                    password: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="w-1/2">
                                        <label className="block mb-1 text-sm font-medium">
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            className="w-full border rounded-lg px-4 py-2"
                                            value={registerData.confirmPassword}
                                            onChange={(e) =>
                                                setRegisterData({
                                                    ...registerData,
                                                    confirmPassword: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dojo Details */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">
                                Dojo / Academy Details
                            </h3>

                            <div className="space-y-4 flex justify-between gap-3">
                                <div className="w-2/3">
                                    <label className="mb-1 text-sm font-medium">
                                        Academy Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border rounded-lg px-4 py-2"
                                        value={registerData.academyName}
                                        onChange={(e) =>
                                            setRegisterData({
                                                ...registerData,
                                                academyName: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="w-1/3">
                                    <label className="mb-1 text-sm font-medium">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border rounded-lg px-4 py-2"
                                        value={registerData.city}
                                        onChange={(e) =>
                                            setRegisterData({
                                                ...registerData,
                                                city: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="block w-1/3 mx-auto bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium"
                        >
                            Register Instructor
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
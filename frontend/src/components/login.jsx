import { useState } from "react";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    phone: "",
    academy: "",
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
    if(data.success == true) console.log("logged in");
    else console.log(`logged in: ${data.success}`)
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      registerData.password !==
      registerData.confirmPassword
    ) {
      alert("Passwords do not match");
      return;
    }

    // API Call
    console.log(registerData);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">

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
            className={`flex-1 py-3 font-medium ${
              activeTab === "login"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-3 font-medium ${
              activeTab === "register"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Register
          </button>
        </div>

        {/* Login */}
        {activeTab === "login" && (
          <form
            onSubmit={handleLogin}
            className="p-6 space-y-4"
          >
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
            >
              Login
            </button>
          </form>
        )}

        {/* Register */}
        {activeTab === "register" && (
          <form
            onSubmit={handleRegister}
            className="p-6 space-y-4"
          >
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

            <div>
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

            <div>
              <label className="block mb-1 text-sm font-medium">
                Phone
              </label>
              <input
                type="text"
                required
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

            <div>
              <label className="block mb-1 text-sm font-medium">
                Academy / Club Name
              </label>
              <input
                type="text"
                required
                className="w-full border rounded-lg px-4 py-2"
                value={registerData.academy}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    academy: e.target.value,
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

            <div>
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

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium"
            >
              Create Instructor Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
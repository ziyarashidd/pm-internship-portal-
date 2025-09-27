import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// No more "./formpage.css" import!

function SignUpPage() {
  const [step, setStep] = useState("role");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false); // For initial animation
  const navigate = useNavigate();

  // Trigger initial animation on mount
  useEffect(() => {
    setIsAnimatingIn(true);
  }, []);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    // Trigger step transition (add class for fade-out, then switch step)
    document.body.classList.add("step-transition"); // Apply to body for global effect
    setTimeout(() => {
      setStep("account");
      document.body.classList.remove("step-transition");
    }, 300);
  };

  const handleNext = () => {
    if (!username || !password) {
      alert("Enter username and password");
      return;
    }
    handleSignup();
  };

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await res.json();
      console.log("Signup response:", data);

      if (res.ok) {
        alert("Signup successful! Please login.");
        navigate("/login");
      } else {
        alert(data.msg || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong during signup");
    } finally {
      setIsLoading(false);
    }
  };

  const isInputFilled = (value) => value.length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500">
      <div
        className={`w-full max-w-md transition-all duration-300 ease-out ${
          isAnimatingIn ? "opacity-100 translate-y-0 animate-fade-in-up" : "opacity-0 translate-y-5"
        }`}
      >
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20 overflow-hidden relative">
          {/* Top gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

          {step === "role" && (
            <>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Select Your Role
              </h2>
              <p className="text-gray-600 mb-8 text-sm sm:text-base">Choose the type of account you'd like to create</p>
              <div className="space-y-3 mb-8">
                <button
                  className="w-full flex items-center justify-center gap-3 p-4 rounded-xl font-semibold text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md active:scale-95"
                  onClick={() => handleRoleSelect("Student")}
                >
                  <span className="text-xl">🎓</span>
                  Student
                </button>
                <button
                  className="w-full flex items-center justify-center gap-3 p-4 rounded-xl font-semibold text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md active:scale-95"
                  onClick={() => handleRoleSelect("Admin")}
                >
                  <span className="text-xl">🛠️</span>
                  Admin
                </button>
                <button
                  className="w-full flex items-center justify-center gap-3 p-4 rounded-xl font-semibold text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md active:scale-95"
                  onClick={() => handleRoleSelect("Employer")}
                >
                  <span className="text-xl">🏢</span>
                  Employer
                </button>
              </div>
              <p className="text-gray-500 text-sm text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-indigo-600 hover:text-purple-600 font-medium transition-colors duration-200 underline-offset-2">
                  Login here
                </Link>
              </p>
            </>
          )}

          {step === "account" && (
            <>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {role} Signup
              </h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">Create your account securely</p>
              <form className="space-y-4 mb-6">
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    className="peer w-full p-4 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:scale-[1.02] transition-all duration-300 outline-none text-base"
                    placeholder=" "
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoFocus
                    required
                  />
                  <label
                    htmlFor="username"
                    className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-all duration-300 peer-focus:text-xs peer-focus:top-2 peer-focus:left-3 peer-focus:text-indigo-600 peer-focus:bg-white peer-focus:px-1 peer-focus:rounded ${
                      isInputFilled(username) ? "text-xs top-2 left-3 text-indigo-600 bg-white px-1 rounded" : ""
                    }`}
                  >
                    Username
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    className="peer w-full p-4 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:scale-[1.02] transition-all duration-300 outline-none text-base"
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label
                    htmlFor="password"
                    className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-all duration-300 peer-focus:text-xs peer-focus:top-2 peer-focus:left-3 peer-focus:text-indigo-600 peer-focus:bg-white peer-focus:px-1 peer-focus:rounded ${
                      isInputFilled(password) ? "text-xs top-2 left-3 text-indigo-600 bg-white px-1 rounded" : ""
                    }`}
                  >
                    Password
                  </label>
                </div>
                <button
                  type="button"
                  className={`w-full p-4 rounded-xl font-semibold text-base transition-all duration-300 ${
                    isLoading
                      ? "bg-indigo-500 text-transparent relative"
                      : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:-translate-y-1 hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg"
                  } disabled:opacity-50`}
                  onClick={handleNext}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 rounded-full border-t-white animate-spin"></div>
                    </div>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </form>
              <p className="text-gray-500 text-sm text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-indigo-600 hover:text-purple-600 font-medium transition-colors duration-200 underline-offset-2">
                  Login here
                </Link>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Global step transition style (applied to body) */}
      <style jsx>{`
        body.step-transition .min-h-screen {
          animation: fadeOutSlide 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default SignUpPage;
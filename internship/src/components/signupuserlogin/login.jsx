import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added Link for signup navigation
import { motion } from "framer-motion"; // Added for subtle animations (optional; install framer-motion if needed)

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState({ visible: false, message: "", type: "" }); // Enhanced alert state
  const navigate = useNavigate();

  const showCustomAlert = (message, type = "error") => {
    setShowAlert({ visible: true, message, type });
    setTimeout(() => setShowAlert({ visible: false, message: "", type: "" }), 3000);
  };

  const handleLogin = async () => {
    if (!username || !password) {
      showCustomAlert("Enter both username and password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log("Login API response:", data);

      if (res.ok && data.token) {
        // Save login info in localStorage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", data.username);
        localStorage.setItem("token", data.token);

        showCustomAlert("Login successful! Redirecting...", "success");

        // Navigate based on role after a short delay
        setTimeout(() => {
          switch (data.role) {
            case "Student":
              navigate("/dashboard");
              break;
            case "Admin":
              navigate("/dashboard1");
              break;
            case "Employer":
              navigate("/employer-dashboard");
              break;
            default:
              navigate("/");
          }
        }, 1500);
      } else {
        showCustomAlert(data.msg || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      showCustomAlert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isInputFilled = (value) => value.length > 0;

  // Animation variants for subtle enhancements
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: "0 0 0 4px rgba(99, 102, 241, 0.2)",
      borderColor: "#6366f1",
      transition: { duration: 0.3 },
    },
    filled: {
      borderColor: "#6366f1",
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Subtle animated background elements for depth */}
      <motion.div
        className="absolute inset-0 opacity-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-pink-400/20 to-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </motion.div>

      {/* Enhanced Custom Alert (Toast) */}
      {showAlert.visible && (
        <motion.div
          className={`fixed top-6 right-6 z-50 p-4 rounded-2xl shadow-2xl text-white font-semibold text-sm max-w-sm border border-white/20 backdrop-blur-sm ${
            showAlert.type === "success"
              ? "bg-gradient-to-r from-green-500 to-emerald-600"
              : "bg-gradient-to-r from-red-500 to-rose-600"
          }`}
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-3">
            {showAlert.type === "success" ? (
              <span className="text-xl">✓</span>
            ) : (
              <span className="text-xl">!</span>
            )}
            <span>{showAlert.message}</span>
          </div>
        </motion.div>
      )}

      <motion.div
        className="w-full max-w-md relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-white/95 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/40 overflow-hidden relative"
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          initial={{ boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
          animate={{ boxShadow: "0 25px 50px rgba(0,0,0,0.15)" }}
        >
          {/* Top gradient accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-t-3xl"></div>

          {/* Inner glow border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 -m-px"></div>

          <div className="relative z-10">
            <motion.h2
              className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent tracking-wide text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Welcome Back
            </motion.h2>

            <motion.p
              className="text-gray-600 mb-8 text-center text-lg font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Sign in to your account
            </motion.p>

            <form className="space-y-6">
              {/* Username Input */}
              <motion.div
                className="relative"
                variants={inputVariants}
                whileFocus="focus"
                initial={false}
              >
                <motion.input
                  type="text"
                  placeholder=" "
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="peer w-full p-4 border-2 border-gray-200 rounded-2xl bg-white/90 text-gray-900 placeholder-transparent focus:outline-none text-lg backdrop-blur-md transition-all duration-300 shadow-md hover:shadow-lg peer-valid:border-indigo-500"
                  required
                  animate={isInputFilled(username) ? "filled" : undefined}
                />
                <motion.label
                  htmlFor="username"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base font-semibold bg-white/90 px-2 rounded-lg transition-all duration-300 peer-focus:text-sm peer-focus:top-2 peer-focus:left-3 peer-focus:text-indigo-600 peer-focus:bg-white peer-focus:shadow-md pointer-events-none"
                  initial={{ y: 0 }}
                  animate={isInputFilled(username) ? { y: -20, scale: 0.85 } : { y: 0, scale: 1 }}
                >
                  👤 Username
                </motion.label>
              </motion.div>

              {/* Password Input */}
              <motion.div
                className="relative"
                variants={inputVariants}
                whileFocus="focus"
                initial={false}
              >
                <motion.input
                  type="password"
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer w-full p-4 border-2 border-gray-200 rounded-2xl bg-white/90 text-gray-900 placeholder-transparent focus:outline-none text-lg backdrop-blur-md transition-all duration-300 shadow-md hover:shadow-lg peer-valid:border-indigo-500"
                  required
                  animate={isInputFilled(password) ? "filled" : undefined}
                />
                <motion.label
                  htmlFor="password"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base font-semibold bg-white/90 px-2 rounded-lg transition-all duration-300 peer-focus:text-sm peer-focus:top-2 peer-focus:left-3 peer-focus:text-indigo-600 peer-focus:bg-white peer-focus:shadow-md pointer-events-none"
                  initial={{ y: 0 }}
                  animate={isInputFilled(password) ? { y: -20, scale: 0.85 } : { y: 0, scale: 1 }}
                >
                  🔒 Password
                </motion.label>
              </motion.div>

              {/* Login Button */}
              <motion.button
                type="button"
                className="w-full relative overflow-hidden p-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white shadow-xl transition-all duration-300 hover:brightness-110 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleLogin}
                disabled={loading}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 rounded-full border-t-white animate-spin"></div>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </motion.button>
            </form>

            {/* Signup Link */}
            <motion.p
              className="text-center mt-6 text-gray-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-indigo-600 hover:text-purple-600 font-semibold transition-all duration-300 underline underline-offset-2 decoration-2 hover:decoration-purple-500 hover:underline-offset-4"
              >
                Sign up here
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LoginPage;
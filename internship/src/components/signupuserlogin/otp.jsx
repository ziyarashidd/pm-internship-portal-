import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./formpage.css";

function OTPVerification({ role, username, password }) {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = () => {
    if (!mobile || mobile.length !== 10) {
      alert("Enter valid 10-digit mobile number");
      return;
    }
    setSent(true);
    alert(`OTP sent to +91 ${mobile}`);
  };

  const handleVerifyOTP = () => {
    if (otp === "1234") { // For demo, OTP is 1234
      // Save user details
      localStorage.setItem("signupRole", role);
      localStorage.setItem("signupUser", username);
      localStorage.setItem("signupPass", password);
      alert("Mobile verified! Please login.");
      navigate("/login");
    } else {
      alert("Invalid OTP. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Mobile Verification</h2>
        {!sent ? (
          <>
            <input
              type="text"
              placeholder="Enter Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="auth-input"
            />
            <button className="auth-btn primary" onClick={handleSendOTP}>
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="auth-input"
            />
            <button className="auth-btn primary" onClick={handleVerifyOTP}>
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default OTPVerification;

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Navbar from "./components/navbar/nav";
import Navbar1 from "./components/nav1/nav";
import HomePage from "./components/homeslide/homeslide";
import About from "./components/eligible/eligible";
import Gallery from "./components/gallery/gallery";
import PlaystorePage from "./components/playstore/playstore";
import Footer from "./components/FOOTER/footer";
import LoginPage from "./components/signupuserlogin/login";
import SignUpPage from "./components/signupuserlogin/signup";
import StudentDashboard from "./components/student/studentdashboard";
import AdminDashboard from "./components/Admin/admindashboard";

// ✅ Import sub-pages for student dashboard
import Home from "./components/student/Home";
import MyApplications from "./components/student/myapplicaton";
import Recommended from "./components/student/recommended";
import Profile from "./components/student/profile";

// ✅ Import Employer Dashboard
import EmployerDashboard from "./components/employer/EmployerDashboard";



// Protected Route
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Home Page */}
        <Route
          path="/"
          element={
            <div>
              {/* <Navbar /> */}
              <Navbar1 />
              <HomePage />
              <About />
              <Gallery />
              <PlaystorePage />
              <Footer />
            </div>
          }
        />

        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Student Dashboard with nested routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="applications" element={<MyApplications />} />
          <Route path="recommended" element={<Recommended />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin Dashboard */}
        <Route
          path="/dashboard1"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* // Employer Dashboard */}
        <Route
          path="/employer-dashboard"
          element={
            <ProtectedRoute>
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />



      </Routes>
    </Router>
  );
}

export default App;

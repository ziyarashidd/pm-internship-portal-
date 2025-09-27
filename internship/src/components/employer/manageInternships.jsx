import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBriefcase,
  FaEdit,
  FaPause,
  FaPlay,
  FaTimes,
  FaEye,
  FaSearch,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBuilding,
  FaCalendarAlt,
  FaUsers,
  FaClock,
  FaPlus, // ✅ This line fixes the "FaPlus is not defined" error
} from "react-icons/fa";


const ManageInternships = () => {
  const [internships, setInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdating, setIsUpdating] = useState({}); // Track updating status per internship
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, paused, closed
  const navigate = useNavigate();

  // Protected route check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "Employer") {
      navigate("/login");
    } else {
      fetchInternships();
    }
  }, [navigate]);

  // Fetch internships
  const fetchInternships = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/employer/internships", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch internships');
      const data = await res.json();
      setInternships(data);
    } catch (err) {
      console.error("Error fetching internships:", err);
      setError("Failed to load internships. Please refresh or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update internship status
  const updateStatus = async (id, newStatus) => {
    try {
      setIsUpdating(prev => ({ ...prev, [id]: true }));
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/employer/internships/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      // Refresh list
      fetchInternships();
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update internship status. Please try again.");
    } finally {
      setIsUpdating(prev => ({ ...prev, [id]: false }));
    }
  };

  // Pause/Resume
  const togglePause = (id, currentStatus) => {
    if (currentStatus === "active") {
      if (window.confirm("Are you sure you want to pause this internship?")) {
        updateStatus(id, "paused");
      }
    } else if (currentStatus === "paused") {
      if (window.confirm("Are you sure you want to resume this internship?")) {
        updateStatus(id, "active");
      }
    }
  };

  // Close internship
  const closeInternship = (id) => {
    if (window.confirm("Are you sure you want to close this internship? This action cannot be undone.")) {
      updateStatus(id, "closed");
    }
  };

  // View applications
  const viewApplications = (id) => {
    navigate(`/employer/applications/${id}`); // Assuming a route for detailed applications
  };

  // Edit internship (navigate to edit page)
  const editInternship = (id) => {
    navigate(`/employer/edit-internship/${id}`); // Assuming edit route
  };

  // Filter and search internships
  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || internship.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-4 md:p-6 animate-pulse">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 animate-[fade-in-up_0.6s_ease-out]">
            <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-[slide-down_0.5s_ease-out]">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-full animate-pulse-glow">
              <FaBriefcase className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 bg-gradient-to-r from-green-600 to-blue-700 bg-clip-text text-transparent">
                Manage Internships
              </h1>
              <p className="text-gray-600 mt-1">View, edit, pause, or close your posted opportunities</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/employer/add-internship")}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg animate-[fade-in-up_0.6s_ease-out]"
          >
            <FaPlus className="mr-2" />
            Post New
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 animate-shake">
            {error} <button onClick={() => setError(null)} className="underline ml-2">Dismiss</button>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 animate-[fade-in-up_0.8s_ease-out]">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex space-x-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="closed">Closed</option>
              </select>
              <button
                onClick={fetchInternships}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
              >
                Refresh
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Showing {filteredInternships.length} of {internships.length} internships
          </p>
        </div>

        {/* Internships Grid */}
        {filteredInternships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-[fade-in-up_1s_ease-out]">
            {filteredInternships.map((internship) => (
              <div
                key={internship.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-green-500 animate-[slide-up_0.6s_ease-out]"
                style={{ animationDelay: `${Math.random() * 0.3}s` }}
              >
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <FaBriefcase className="mr-2 text-green-600" />
                      {internship.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        internship.status === "active"
                          ? "bg-green-100 text-green-800"
                          : internship.status === "paused"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {internship.status.charAt(0).toUpperCase() + internship.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <FaCalendarAlt className="mr-2 text-green-500" />
                      {new Date(internship.startDate).toLocaleDateString()} - {new Date(internship.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaClock className="mr-2 text-green-500" />
                      {internship.duration}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaUsers className="mr-2 text-green-500" />
                      {internship.applicationsCount || 0} Applications
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaBuilding className="mr-2 text-green-500" />
                      {internship.location}
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm line-clamp-3">
                    {internship.description}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => editInternship(internship.id)}
                      className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all duration-300"
                    >
                      <FaEdit className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => togglePause(internship.id, internship.status)}
                      disabled={isUpdating[internship.id] || internship.status === "closed"}
                      className={`flex items-center px-3 py-1 text-sm rounded-lg transition-all duration-300 ${
                        internship.status === "active"
                          ? "bg-yellow-600 text-white hover:bg-yellow-700"
                          : internship.status === "paused"
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-400 text-white cursor-not-allowed"
                      }`}
                    >
                      {isUpdating[internship.id] ? (
                        <FaSpinner className="mr-1 animate-spin" />
                      ) : internship.status === "active" ? (
                        <>
                          <FaPause className="mr-1" />
                          Pause
                        </>
                      ) : internship.status === "paused" ? (
                        <>
                          <FaPlay className="mr-1" />
                          Resume
                        </>
                      ) : null}
                    </button>
                    <button
                      onClick={() => viewApplications(internship.id)}
                      className="flex items-center px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-all duration-300"
                    >
                      <FaEye className="mr-1" />
                      View Applications
                    </button>
                    {internship.status !== "closed" && (
                      <button
                        onClick={() => closeInternship(internship.id)}
                        className="flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-all duration-300"
                      >
                        <FaTimes className="mr-1" />
                        Close
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-md animate-[fade-in-up_1s_ease-out]">
            <FaBriefcase className="mx-auto text-6xl text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Internships Found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== "all" ? "Try adjusting your search or filter." : "Post your first internship to get started!"}
            </p>
            <button
              onClick={() => navigate("/employer/add-internship")}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
            >
              Post New Internship
            </button>
          </div>
        )}
      </div>

      {/* Custom CSS for Animations */}
      <style jsx>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.6); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-slide-down { animation: slide-down 0.5s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
        .animate-pulse-glow { animation: pulse-glow 2s infinite; }
        .animate-shake { animation: shake 0.5s ease-out forwards; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ManageInternships;
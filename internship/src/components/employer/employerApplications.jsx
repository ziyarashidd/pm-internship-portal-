import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSpinner,
  FaCheck,
  FaTimesCircle,
  FaEye,
  FaDownload,
  FaUserGraduate,
  FaFileAlt,
  FaClock,
  FaSearch,
  FaSyncAlt,        // Added missing import
  FaBriefcase,      // Added missing import
  FaClipboardList,  // Added missing import
} from "react-icons/fa";

function ApplicationsReview() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, accepted, rejected
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState({}); // Track updating status for each application
  const navigate = useNavigate();

  // Protected route check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "Employer") {
      navigate("/login");
      return;
    }
    fetchApplications();
  }, [navigate]);

  // Fetch all applications for employer's internships
  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/employer/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch applications');
      const data = await res.json();
      setApplications(data.applications || []); // Assume backend returns array of applications with internship details (e.g., internshipTitle, company, duration)
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications. Please check backend or refresh.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle accept/reject application
  const updateApplicationStatus = async (applicationId, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this application?`)) return;
    try {
      setIsUpdating(prev => ({ ...prev, [applicationId]: true }));
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/employer/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      // Refresh applications
      fetchApplications();
      // Show success message (you can add toast here)
      alert(`${status.charAt(0).toUpperCase() + status.slice(1)} successfully!`);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setIsUpdating(prev => ({ ...prev, [applicationId]: false }));
    }
  };

  // View resume (download or open in new tab)
  const viewResume = (resumeUrl) => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    } else {
      alert("Resume URL not available.");
    }
  };

  // Filtered applications
  const filteredApplications = applications.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch = app.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.internshipTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Group applications by internshipId (or fallback to internshipTitle if no ID)
  const groupedApplications = filteredApplications.reduce((acc, app) => {
    const internshipKey = app.internshipId || app.internshipTitle || 'unknown';
    if (!acc[internshipKey]) {
      acc[internshipKey] = [];
    }
    acc[internshipKey].push(app);
    return acc;
  }, {});

  // Manual refresh
  const handleRefresh = () => {
    fetchApplications();
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-4 md:p-6 animate-slide-down">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Review Applications</h1>
          <div className="animate-pulse bg-gray-300 h-8 w-32 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-6 animate-slide-down">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 bg-gradient-to-r from-green-600 to-blue-700 bg-clip-text text-transparent animate-[fade-in-up_0.8s_ease-out]">
          Review Applications
        </h1>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-glow"
        >
          <FaSyncAlt className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 animate-shake">
          {error} <button onClick={handleRefresh} className="underline ml-2">Retry</button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 mb-6 animate-[fade-in-up_0.6s_ease-out]">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 md:flex-none">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student name or internship title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Showing {filteredApplications.length} of {applications.length} applications
        </p>
      </div>

      {/* Applications List - Grouped by Internship */}
      {Object.keys(groupedApplications).length === 0 ? (
        <div className="text-center py-12 animate-[fade-in-up_0.6s_ease-out]">
          <FaClipboardList className="mx-auto text-6xl text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Applications Found</h3>
          <p className="text-gray-500">Post some internships or check back later.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedApplications).map(([internshipKey, apps]) => {
            // Use data from the first application in the group (assume backend populates internship details in each app)
            const firstApp = apps[0];
            const internshipTitle = firstApp.internshipTitle || 'Unknown Internship';
            const company = firstApp.company || 'Unknown Company';
            const duration = firstApp.duration || 'N/A';

            return (
              <div key={internshipKey} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden animate-[fade-in-up_0.6s_ease-out]">
                {/* Internship Header */}
                <div className="bg-gradient-to-r from-green-600 to-blue-700 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold flex items-center">
                        <FaBriefcase className="mr-2" />
                        {internshipTitle}
                      </h2>
                      <p className="text-blue-100 text-sm">{company} | {duration} | {apps.length} Applications</p>
                    </div>
                    <FaClock className="text-lg" />
                  </div>
                </div>

                {/* Applications for this internship */}
                <div className="divide-y divide-gray-200">
                  {apps.map((app, index) => (
                    <div key={app._id} className={`p-4 hover:bg-gray-50 transition-all duration-300 ${index % 2 === 0 ? 'animate-slide-up' : ''}`} style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Student Info */}
                        <div className="flex-1">
                          <div className="flex items-center">
                            <FaUser Graduate className="text-2xl text-green-600 mr-3" /> {/* Fixed: Removed space in icon name */}
                            <div>
                              <h4 className="font-semibold text-gray-800">{app.studentName}</h4>
                              <p className="text-sm text-gray-600">{app.studentEmail} | {app.studentCollege}</p>
                              {app.coverLetter && (
                                <p className="text-sm text-gray-500 mt-1 italic">"{app.coverLetter.substring(0, 100)}..."</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${
                          app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {app.status === 'pending' && <FaSpinner className="animate-spin" />}
                          {app.status === 'accepted' && <FaCheck />}
                          {app.status === 'rejected' && <FaTimesCircle />}
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => viewResume(app.resumeUrl)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-300 transform hover:scale-110"
                            title="View Resume"
                          >
                            <FaEye />
                          </button>
                          {app.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateApplicationStatus(app._id, 'accepted')}
                                disabled={isUpdating[app._id]}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                              >
                                {isUpdating[app._id] ? <FaSpinner className="animate-spin" /> : 'Accept'}
                              </button>
                              <button
                                onClick={() => updateApplicationStatus(app._id, 'rejected')}
                                disabled={isUpdating[app._id]}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                              >
                                {isUpdating[app._id] ? <FaSpinner className="animate-spin" /> : 'Reject'}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.6); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }
        .animate-[fade-in-up_0.6s_ease-out] { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-shake { animation: shake 0.5s ease-out; }
        .animate-pulse-glow { animation: pulse-glow 2s infinite; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
      `}</style>
    </div>
  );
}

export default ApplicationsReview;
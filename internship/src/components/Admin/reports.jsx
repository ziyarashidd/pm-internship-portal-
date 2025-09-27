import React, { useEffect, useState } from "react";
import { FaClipboardList, FaSpinner, FaCheck, FaTimes, FaEdit, FaUserCheck, FaUserTimes } from "react-icons/fa";

function Reports() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch approved (shortlisted) applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // Admin token
      const res = await fetch("http://localhost:5000/api/admin/reports/approved-applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setApplications(data.applications || []);
    } catch (err) {
      console.error("Error fetching approved applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Status Badge Component (Adapted for Reports)
  const StatusBadge = ({ status }) => {
    const colors = {
      "Completed": 'bg-green-100 text-green-800 border-green-300',
      "Not Completed": 'bg-yellow-100 text-yellow-800 border-yellow-300 animate-pulse',
    };
    const statusText = (status || 'Not Completed').replace(' ', '\n'); // Keep as is for now
    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border transform transition-all hover:scale-105 ${colors[status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
        {statusText}
      </span>
    );
  };

  // Toggle Completed / Not Completed status
  const toggleStatus = async (appId, currentStatus) => {
    setUpdatingId(appId);
    try {
      const token = localStorage.getItem("token");
      const newStatus = currentStatus === "Completed" ? "Not Completed" : "Completed";

      const res = await fetch(`http://localhost:5000/api/admin/reports/update-application/${appId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
        );
        alert(`Application marked as ${newStatus}!`);
      } else {
        throw new Error('Update failed');
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const editApplication = (appId) => {
    // Placeholder for edit functionality
    alert(`Edit application ID: ${appId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] animate-pulse">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-[fade-in-up_0.6s_ease-out]">
        <div className="flex items-center space-x-3">
          <FaClipboardList className="text-3xl text-indigo-600 animate-bounce" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent">
            Reports & Analytics
          </h2>
        </div>
        <div className="text-sm text-gray-500">
          Shortlisted: <span className="font-semibold text-indigo-600">{applications.length}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-6 animate-[fade-in-up_0.8s_ease-out]">
        View all shortlisted (approved) students and their internships.
      </p>

      {/* Empty State */}
      {applications.length === 0 ? (
        <div className="text-center py-16 animate-[fade-in-up_0.8s_ease-out]">
          <FaClipboardList className="text-6xl text-gray-300 mb-4 animate-pulse" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Shortlisted Students Found</h3>
          <p className="text-gray-500">No approved applications to review at the moment.</p>
        </div>
      ) : (
        /* Table Container */
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-[slide-down_0.5s_ease-out]">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
                <tr className="animate-[fade-in-up_0.4s_ease-out]">
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Internship</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Action</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map((app, index) => (
                  <tr
                    key={app._id}
                    className="hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.01] animate-[fade-in-up_0.6s_ease-out]"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {app.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {app.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                      {app.internshipTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <StatusBadge status={app.status || "Not Completed"} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => toggleStatus(app._id, app.status || "Not Completed")}
                        disabled={updatingId === app._id}
                        className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                          (app.status || "Not Completed") === "Completed"
                            ? "bg-red-100 text-red-800 hover:bg-red-200"
                            : "bg-green-100 text-green-800 hover:bg-green-200"
                        }`}
                      >
                        {updatingId === app._id ? (
                          <FaSpinner className="animate-spin mr-1" />
                        ) : (
                          <>
                            {(app.status || "Not Completed") === "Completed" ? <FaTimes className="mr-1" /> : <FaCheck className="mr-1" />}
                            {(app.status || "Not Completed") === "Completed" ? "Mark Incomplete" : "Mark Completed"}
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => editApplication(app._id)}
                        className="inline-flex items-center px-3 py-2 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-lg hover:bg-indigo-200 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                      >
                        <FaEdit className="mr-1" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Custom CSS for Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-[fade-in-up_0.6s_ease-out] { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-[slide-down_0.5s_ease-out] { animation: slide-down 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}

export default Reports;
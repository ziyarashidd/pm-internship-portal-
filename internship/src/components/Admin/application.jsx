import React, { useState, useEffect } from "react";
import { FaClipboardList, FaCheck, FaTimes, FaEdit, FaSpinner, FaUserCheck, FaUserTimes, FaFilePdf } from "react-icons/fa";


function ApplicationsReview() {
  const [applications, setApplications] = useState([]);
  const [editingAppId, setEditingAppId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch all applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://pm-internship-portal.onrender.com/api/admin/applications"); // Backend route
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setApplications(data.applications || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300 animate-pulse',
      Approved: 'bg-green-100 text-green-800 border-green-300',
      Rejected: 'bg-red-100 text-red-800 border-red-300',
    };
    const statusText = (status || 'Pending').charAt(0).toUpperCase() + (status || 'Pending').slice(1);
    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border transform transition-all hover:scale-105 ${colors[status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
        {statusText}
      </span>
    );
  };

  // Approve application
  const handleApprove = async (id) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/applications/${id}/approve`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error('Approve failed');
      const data = await res.json();
      setApplications(prev =>
        prev.map(app => (app._id === id ? { ...app, status: "Approved" } : app))
      );
      alert(data.msg || 'Application approved successfully!');
      setEditingAppId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to approve application");
    } finally {
      setUpdatingId(null);
    }
  };

  // Reject application
  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this application? This action cannot be undone.")) return;
    setUpdatingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/applications/${id}/reject`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error('Reject failed');
      const data = await res.json();
      setApplications(prev =>
        prev.map(app => (app._id === id ? { ...app, status: "Rejected" } : app))
      );
      alert(data.msg || 'Application rejected successfully!');
      setEditingAppId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to reject application");
    } finally {
      setUpdatingId(null);
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingAppId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] animate-pulse">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading applications...</p>
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
            Applications Review
          </h2>
        </div>
        <div className="text-sm text-gray-500">
          Total: <span className="font-semibold text-indigo-600">{applications.length}</span>
        </div>
      </div>

      {/* Empty State */}
      {applications.length === 0 ? (
        <div className="text-center py-16 animate-[fade-in-up_0.8s_ease-out]">
          <FaClipboardList className="text-6xl text-gray-300 mb-4 animate-pulse" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Applications Found</h3>
          <p className="text-gray-500">No student applications to review at the moment.</p>
        </div>
      ) : (
        /* Table Container */
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-[slide-down_0.5s_ease-out]">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
                <tr className="animate-[fade-in-up_0.4s_ease-out]">
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Student Username</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Internship</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Resume</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Applied At</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
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
                      {app.studentUsername}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                      {app.internshipTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {app.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {app.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {app.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {app.resumeLink ? (
                        <a
                          href={app.resumeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-lg hover:bg-green-200 transition-all duration-200 transform hover:scale-105"
                        >
                          <FaFilePdf className="mr-1" /> {/* Assuming you import FaFilePdf */}
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400">No Resume</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(app.appliedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {editingAppId === app._id ? (
                        <>
                          <button
                            onClick={() => handleApprove(app._id)}
                            disabled={updatingId === app._id}
                            className="inline-flex items-center px-3 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-lg hover:bg-green-200 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingId === app._id ? <FaSpinner className="animate-spin mr-1" /> : <FaCheck className="mr-1" />}
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(app._id)}
                            disabled={updatingId === app._id}
                            className="inline-flex items-center px-3 py-2 bg-red-100 text-red-800 text-sm font-medium rounded-lg hover:bg-red-200 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingId === app._id ? <FaSpinner className="animate-spin mr-1" /> : <FaTimes className="mr-1" />}
                            Reject
                          </button>
                          <button
                            onClick={cancelEdit}
                            disabled={updatingId === app._id}
                            className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 shadow-sm"
                          >
                            <FaEdit className="mr-1" />
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setEditingAppId(app._id)}
                          className="inline-flex items-center px-3 py-2 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-lg hover:bg-indigo-200 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                        >
                          <FaEdit className="mr-1" />
                          Review
                        </button>
                      )}
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
        .animate-slide-down { animation: slide-down 0.5s ease-out; }
      `}</style>
    </div>
  );
}

export default ApplicationsReview;
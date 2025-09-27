import React, { useState, useEffect } from "react";
import { FaUser , FaEdit, FaTrash, FaFilePdf, FaSearch, FaSpinner } from "react-icons/fa";
import "./manageStudents.css"; // Keep if you have custom styles; Tailwind handles most

function ManageStudents() {
  const [applications, setApplications] = useState([]);
  const [editingApp, setEditingApp] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resumeLink: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch all student applications from backend
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/manageStudents"); // Correct endpoint
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

  // Open edit modal
  const handleEdit = (app) => {
    setEditingApp(app);
    setFormData({
      name: app.name,
      email: app.email,
      phone: app.phone,
      resumeLink: app.resumeLink,
    });
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update application
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch(`http://localhost:5000/api/manageStudents/${editingApp._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Update failed');
      const data = await res.json();
      // Success message (you can use a toast library or simple alert)
      alert(data.msg || 'Updated successfully!');
      setEditingApp(null);
      setFormData({ name: "", email: "", phone: "", resumeLink: "" });
      fetchApplications();
    } catch (err) {
      console.error(err);
      alert("Failed to update application");
    } finally {
      setUpdating(false);
    }
  };

  // Delete application
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/manageStudents/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error('Delete failed');
      const data = await res.json();
      alert(data.msg || 'Deleted successfully!');
      fetchApplications();
    } catch (err) {
      console.error(err);
      alert("Failed to delete application");
    } finally {
      setDeletingId(null);
    }
  };

  // Close modal
  const closeModal = () => {
    setEditingApp(null);
    setFormData({ name: "", email: "", phone: "", resumeLink: "" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] animate-pulse">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading student applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-[fade-in-up_0.6s_ease-out]">
        <div className="flex items-center space-x-3">
          <FaUser  className="text-3xl text-blue-600 animate-bounce" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Manage Students
          </h2>
        </div>
        <div className="text-sm text-gray-500">
          Total: <span className="font-semibold text-blue-600">{applications.length}</span>
        </div>
      </div>

      {/* Empty State */}
      {applications.length === 0 ? (
        <div className="text-center py-16 animate-[fade-in-up_0.8s_ease-out]">
          <FaUser  className="text-6xl text-gray-300 mb-4 animate-pulse" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Student Applications Found</h3>
          <p className="text-gray-500">Students haven't applied yet. Check back later!</p>
        </div>
      ) : (
        /* Table Container */
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-[slide-down_0.5s_ease-out]">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <tr className="animate-[fade-in-up_0.4s_ease-out]">
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Student Username</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Internship</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Resume</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Applied At</th>
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
                          <FaFilePdf className="mr-1" />
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400">No Resume</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(app.appliedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(app)}
                        className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-lg hover:bg-blue-200 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                      >
                        <FaEdit className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(app._id)}
                        disabled={deletingId === app._id}
                        className="inline-flex items-center px-3 py-2 bg-red-100 text-red-800 text-sm font-medium rounded-lg hover:bg-red-200 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === app._id ? <FaSpinner className="animate-spin mr-1" /> : <FaTrash className="mr-1" />}
                        {deletingId === app._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-500 animate-[slide-up_0.4s_ease-out]">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FaEdit className="text-2xl text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-800">Edit Student Application</h3>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-all duration-200 text-xl font-bold transform hover:scale-110"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body - Form */}
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  disabled={updating}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  disabled={updating}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  disabled={updating}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resume Link</label>
                <input
                  name="resumeLink"
                  value={formData.resumeLink}
                  onChange={handleChange}
                  placeholder="Enter resume URL"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  disabled={updating}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? <FaSpinner className="animate-spin mr-2" /> : null}
                  {updating ? 'Updating...' : 'Update'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={updating}
                  className="flex-1 bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
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
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-[fade-in-up_0.6s_ease-out] { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-slide-down { animation: slide-down 0.5s ease-out; }
        .animate-[slide-up_0.4s_ease-out] { animation: slide-up 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
}

export default ManageStudents;
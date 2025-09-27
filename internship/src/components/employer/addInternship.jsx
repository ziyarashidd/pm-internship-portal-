import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaPlus, FaCalendarAlt, FaMapMarkerAlt, FaDollarSign, FaUsers, FaEdit, FaSave, FaTimes, FaSpinner, FaCheckCircle, FaFileAlt, FaClock, FaGraduationCap, FaUpload } from "react-icons/fa";

const AddInternship = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "", // e.g., "3 months"
    stipend: "", // e.g., "5000-10000"
    skillsRequired: "", // Comma-separated
    location: "Remote", // Default to Remote, options: Remote, Office
    startDate: "",
    endDate: "",
    eligibilityBranches: "", // Comma-separated, e.g., "CSE, ECE"
    eligibilityYear: "", // e.g., "2nd, 3rd, 4th"
    positionsAvailable: 1,
    applicationDeadline: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Protected route check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "Employer") {
      navigate("/login");
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on input
    if (error) setError(null);
  };

  // Handle number input
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 1 }));
  };

  // Validate form
  const validateForm = () => {
    const requiredFields = ["title", "description", "duration", "startDate", "endDate", "positionsAvailable", "applicationDeadline"];
    for (let field of requiredFields) {
      if (!formData[field].trim()) {
        setError(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError("End date must be after start date");
      return false;
    }
    if (new Date(formData.applicationDeadline) >= new Date(formData.startDate)) {
      setError("Application deadline must be before start date");
      return false;
    }
    return true;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/employer/internships", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to post internship");
      }
      const data = await res.json();
      setSuccess("Internship posted successfully! You can manage it from the dashboard.");
      // Reset form
      setFormData({
        title: "",
        description: "",
        duration: "",
        stipend: "",
        skillsRequired: "",
        location: "Remote",
        startDate: "",
        endDate: "",
        eligibilityBranches: "",
        eligibilityYear: "",
        positionsAvailable: 1,
        applicationDeadline: "",
      });
      // Redirect to manage internships after 2 seconds
      setTimeout(() => navigate("/employer/manage-internships"), 2000);
    } catch (err) {
      console.error("Error posting internship:", err);
      setError(err.message || "Failed to post internship. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-4 md:p-6 animate-pulse">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 animate-[fade-in-up_0.6s_ease-out]">
            <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
            <div className="space-y-6">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-32 bg-gray-300 rounded-lg"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-10 bg-gray-300 rounded"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-[slide-down_0.5s_ease-out]">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-full animate-pulse-glow">
              <FaPlus className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 bg-gradient-to-r from-green-600 to-blue-700 bg-clip-text text-transparent">
                Post New Internship
              </h1>
              <p className="text-gray-600 mt-1">Create an exciting opportunity for students</p>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 animate-shake">
            {error} <button onClick={() => setError(null)} className="underline ml-2">Dismiss</button>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 animate-[bounce_0.5s_ease-out]">
            <FaCheckCircle className="inline mr-2" />
            {success} <button onClick={() => setSuccess(null)} className="underline ml-2">Dismiss</button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md overflow-hidden animate-[fade-in-up_0.8s_ease-out]">
          {/* Basic Information Section */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaBriefcase className="mr-2 text-green-600" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-2 animate-[slide-up_0.6s_ease-out]">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <FaEdit className="mr-2 text-green-600" />
                  Internship Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  placeholder="e.g., Software Development Intern"
                  required
                />
              </div>

              {/* Positions Available */}
              <div className="space-y-2 animate-[slide-up_0.6s_ease-out]" style={{ animationDelay: '0.1s' }}>
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <FaUsers className="mr-2 text-green-600" />
                  Positions Available *
                </label>
                <input
                  type="number"
                  name="positionsAvailable"
                  value={formData.positionsAvailable}
                  onChange={handleNumberChange}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  placeholder="e.g., 5"
                  required
                />
              </div>

              {/* Duration */}
              <div className="space-y-2 animate-[slide-up_0.6s_ease-out]" style={{ animationDelay: '0.2s' }}>
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <FaClock className="mr-2 text-green-600" />
                  Duration *
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  placeholder="e.g., 3 months"
                  required
                />
              </div>

              {/* Stipend */}
              <div className="space-y-2 animate-[slide-up_0.6s_ease-out]" style={{ animationDelay: '0.3s' }}>
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <FaDollarSign className="mr-2 text-green-600" />
                  Stipend (Optional)
                </label>
                <input
                  type="text"
                  name="stipend"
                  value={formData.stipend}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  placeholder="e.g., 5000-10000 INR per month"
                />
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaFileAlt className="mr-2 text-green-600" />
              Description
            </h2>
            <div className="space-y-2 animate-[slide-up_0.6s_ease-out]">
              <label className="block text-sm font-medium text-gray-700">
                Detailed Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 resize-none"
                placeholder="Describe the internship responsibilities, what the intern will learn, company culture, etc..."
                required
              />
              <p className="text-xs text-gray-500">Max 1000 characters. Be detailed to attract the right candidates!</p>
            </div>
          </div>

          {/* Requirements Section */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaGraduationCap className="mr-2 text-green-600" />
              Requirements & Eligibility
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills Required */}
              <div className="space-y-2 animate-[slide-up_0.6s_ease-out]">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <FaEdit className="mr-2 text-green-600" />
                  Skills Required (Comma-separated)
                </label>
                <input
                  type="text"
                  name="skillsRequired"
                  value={formData.skillsRequired}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  placeholder="e.g., JavaScript, React, Node.js"
                />
              </div>

              {/* Eligibility Branches */}
              <div className="space-y-2 animate-[slide-up_0.6s_ease-out]" style={{ animationDelay: '0.1s' }}>
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <FaGraduationCap className="mr-2 text-green-600" />
                  Eligible Branches (Comma-separated)
                </label>
                <input
                  type="text"
                  name="eligibilityBranches"
                  value={formData.eligibilityBranches}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  placeholder="e.g., CSE, ECE, IT"
                />
              </div>

              {/* Eligibility Year */}
              <div className="space-y-2 animate-[slide-up_0.6s_ease-out]" style={{ animationDelay: '0.2s' }}>
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <FaGraduationCap className="mr-2 text-green-600" />
                  Eligible Year
                </label>
                <input
                  type="text"
                  name="eligibilityYear"
                  value={formData.eligibilityYear}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  placeholder="e.g., 2nd, 3rd, 4th year"
                />
              </div>

              {/* Location */}
              <div className="space-y-2 animate-[slide-up_0.6s_ease-out]" style={{ animationDelay: '0.3s' }}>
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-green-600" />
                  Location
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                >
                  <option value="Remote">Remote</option>
                  <option value="Office">Office (Specify in description)</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dates Section */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaCalendarAlt className="mr-2 text-green-600" />
              Dates & Deadline
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-[slide-up_0.6s_ease-out]">
              {/* Start Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  required
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  required
                />
              </div>

                          {/* Application Deadline */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <FaCalendarAlt className="mr-2 text-green-600" />
                  Application Deadline *
                </label>
                <input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-center animate-[fade-in-up_1s_ease-out]">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="mr-2 animate-spin" />
                  Posting Internship...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Post Internship
                </>
              )}
            </button>
          </div>
        </form>

        {/* Tips Section */}
        {!success && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 animate-[fade-in-up_1.2s_ease-out]">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
              <FaCheckCircle className="mr-2" />
              Posting Tips
            </h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start">
                <span className="mr-2 mt-0.5 text-xs">•</span>
                Be specific about responsibilities and learning outcomes to attract quality candidates.
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-0.5 text-xs">•</span>
                Mention any perks like certificates, mentorship, or flexible hours.
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-0.5 text-xs">•</span>
                Set a realistic deadline and review applications regularly.
              </li>
            </ul>
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
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translate3d(0, 0, 0); }
          40%, 43% { transform: translate3d(0, -10px, 0); }
          70% { transform: translate3d(0, -5px, 0); }
          90% { transform: translate3d(0, -2px, 0); }
        }
        .animate-slide-down { animation: slide-down 0.5s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
        .animate-pulse-glow { animation: pulse-glow 2s infinite; }
        .animate-shake { animation: shake 0.5s ease-out forwards; }
        .animate-bounce { animation: bounce 0.5s ease-out forwards; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </div>
  );
};

export default AddInternship;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser , FaBuilding, FaMapMarkerAlt, FaGlobe, FaEnvelope, FaPhone, FaEdit, FaSave, FaTimes, FaUpload, FaSpinner, FaCheckCircle } from "react-icons/fa";

const EmployerProfile = () => {
  const [profile, setProfile] = useState({
    companyName: "",
    companyDescription: "",
    location: "",
    website: "",
    email: "",
    phone: "",
    logo: null, // For file upload
    logoUrl: "", // Current logo URL
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const navigate = useNavigate();

  // Protected route check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "Employer") {
      navigate("/login");
    } else {
      fetchProfile();
    }
  }, [navigate]);

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/employer/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      setProfile({
        companyName: data.companyName || "",
        companyDescription: data.companyDescription || "",
        location: data.location || "",
        website: data.website || "",
        email: data.email || "",
        phone: data.phone || "",
        logoUrl: data.logoUrl || "",
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile. Please refresh or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // Handle logo upload
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setProfile(prev => ({ ...prev, logo: file }));
    }
  };

  // Save profile
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append('companyName', profile.companyName);
      formData.append('companyDescription', profile.companyDescription);
      formData.append('location', profile.location);
      formData.append('website', profile.website);
      formData.append('email', profile.email);
      formData.append('phone', profile.phone);
      if (profile.logo) {
        formData.append('logo', profile.logo);
      }

      const res = await fetch("http://localhost:5000/api/employer/profile", {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const data = await res.json();
      setProfile(prev => ({ ...prev, logoUrl: data.logoUrl || prev.logoUrl }));
      setLogoPreview(null); // Clear preview after save
      setIsEditing(false);
      setSuccess("Profile updated successfully!");
      // Refresh profile to ensure latest data
      setTimeout(() => fetchProfile(), 1000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile(); // Revert to original data
    setLogoPreview(null);
    setError(null);
    setSuccess(null);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-4 md:p-6 animate-pulse">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 animate-[fade-in-up_0.6s_ease-out]">
            <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-32 bg-gray-300 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
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
              <FaBuilding className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 bg-gradient-to-r from-green-600 to-blue-700 bg-clip-text text-transparent">
                Company Profile
              </h1>
              <p className="text-gray-600 mt-1">Manage your company's details and branding</p>
            </div>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg animate-[fade-in-up_0.6s_ease-out]"
            >
              <FaEdit className="mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg animate-[fade-in-up_0.6s_ease-out]"
              >
                {isSaving ? <FaSpinner className="mr-2 animate-spin" /> : <FaSave className="mr-2" />}
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg animate-[fade-in-up_0.6s_ease-out]"
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
            </div>
          )}
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

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden animate-[fade-in-up_0.8s_ease-out]">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaBuilding className="mr-2 text-green-600" />
              Company Logo
            </h2>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-gray-300 animate-[pulse_2s_infinite]">
                  {logoPreview || profile.logoUrl ? (
                    <img
                      src={logoPreview || profile.logoUrl}
                      alt="Company Logo"
                      className="w-full h-full object-cover rounded-full animate-[zoom-in_0.5s_ease-out]"
                    />
                  ) : (
                    <FaBuilding className="text-4xl text-gray-500" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute -bottom-2 -right-2 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 transition-all duration-300 transform hover:scale-110 shadow-lg animate-[fade-in-up_0.6s_ease-out]">
                    <FaUpload className="text-sm" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-500">Upload a square image (min 200x200px) for best results.</p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div className="space-y-2 animate-[slide-up_0.6s_ease-out]">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <FaBuilding className="mr-2 text-green-600" />
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={profile.companyName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isEditing
                    ? "border-gray-300 focus:ring-green-500 focus:border-green-500"
                    : "bg-gray-50 border-gray-200 cursor-not-allowed"
                }`}
                placeholder="Enter company name"
              />
            </div>

            {/* Location */}
            <div className="space-y-2 animate-[slide-up_0.6s_ease-out]" style={{ animationDelay: '0.1s' }}>
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-green-600" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isEditing
                    ? "border-gray-300 focus:ring-green-500 focus:border-green-500"
                    : "bg-gray-50 border-gray-200 cursor-not-allowed"
                }`}
                placeholder="City, State, Country"
              />
            </div>

            {/* Website */}
            <div className="space-y-2 animate-[slide-up_0.6s_ease-out]" style={{ animationDelay: '0.2s' }}>
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <FaGlobe className="mr-2 text-green-600" />
                Website
              </label>
              <input
                type="url"
                name="website"
                value={profile.website}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isEditing
                    ? "border-gray-300 focus:ring-green-500 focus:border-green-500"
                    : "bg-gray-50 border-gray-200 cursor-not-allowed"
                }`}
                placeholder="https://www.example.com"
              />
            </div>

            {/* Email */}
            <div className="space-y-2 animate-[slide-up_0.6s_ease-out]" style={{ animationDelay: '0.3s' }}>
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <FaEnvelope className="mr-2 text-green-600" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isEditing
                    ? "border-gray-300 focus:ring-green-500 focus:border-green-500"
                    : "bg-gray-50 border-gray-200 cursor-not-allowed"
                }`}
                placeholder="contact@example.com"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2 animate-[slide-up_0.6s_ease-out]" style={{ animationDelay: '0.4s' }}>
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <FaPhone className="mr-2 text-green-600" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isEditing
                    ? "border-gray-300 focus:ring-green-500 focus:border-green-500"
                    : "bg-gray-50 border-gray-200 cursor-not-allowed"
                }`}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {/* Description - Full width */}
            <div className="md:col-span-2 space-y-2 animate-[slide-up_0.6s_ease-out]" style={{ animationDelay: '0.5s' }}>
              <label className="block text-sm font-medium text-gray-700">
                Company Description
              </label>
              <textarea
                name="companyDescription"
                value={profile.companyDescription}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${
                  isEditing
                    ? "border-gray-300 focus:ring-green-500 focus:border-green-500"
                    : "bg-gray-50 border-gray-200 cursor-not-allowed"
                }`}
                placeholder="Tell us about your company and what you offer to interns..."
              />
              <p className="text-xs text-gray-500">Max 500 characters. Keep it engaging!</p>
            </div>
          </div>

          {/* Footer with tips */}
          {!isEditing && (
            <div className="p-6 bg-gray-50 border-t border-gray-200 animate-[fade-in-up_1s_ease-out]">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Profile Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><FaCheckCircle className="mr-2 text-green-500" />A complete profile increases visibility to students.</li>
                <li className="flex items-center"><FaCheckCircle className="mr-2 text-green-500" />Upload a professional logo for better branding.</li>
                <li className="flex items-center"><FaCheckCircle className="mr-2 text-green-500" />Update your details regularly to stay current.</li>
              </ul>
            </div>
          )}
        </div>
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
  @keyframes zoom-in {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
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
  .animate-zoom-in { animation: zoom-in 0.5s ease-out forwards; }
  .animate-pulse-glow { animation: pulse-glow 2s infinite; }
  .animate-shake { animation: shake 0.5s ease-out forwards; }
  .animate-bounce { animation: bounce 0.5s ease-out forwards; }
  /* Delay variations for staggered animations */
  .animate-delay-100 { animation-delay: 0.1s; }
  .animate-delay-200 { animation-delay: 0.2s; }
  .animate-delay-300 { animation-delay: 0.3s; }
  .animate-delay-400 { animation-delay: 0.4s; }
  .animate-delay-500 { animation-delay: 0.5s; }
  /* Tailwind-like pulse for loading */
  .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: .5; }
  }
`}</style>
 </div>
  );
}

export default EmployerProfile;
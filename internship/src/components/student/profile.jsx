import React, { useEffect, useState, useRef } from "react";

function ProfilePage() {
  const [user, setUser ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    skills: "",
    linkedin: "",
    github: "",
    twitter: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const formRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://pm-internship-portal.onrender.com/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setUser (data);
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          location: data.location || "",
          skills: data.skills || "",
          linkedin: data.linkedin || "",
          github: data.github || "",
          twitter: data.twitter || "",
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setMessage({ type: 'error', text: 'Failed to load profile. Please try again.' });
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (form.phone && !/^\+?[\d\s-()]{10,}$/.test(form.phone)) newErrors.phone = 'Invalid phone number';
    if (form.linkedin && !/^https?:\/\/(www\.)?linkedin\.com/.test(form.linkedin)) newErrors.linkedin = 'Invalid LinkedIn URL';
    if (form.github && !/^https?:\/\/(www\.)?github\.com/.test(form.github)) newErrors.github = 'Invalid GitHub URL';
    if (form.twitter && !/^https?:\/\/(www\.)?twitter\.com/.test(form.twitter)) newErrors.twitter = 'Invalid Twitter URL';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error on change
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the errors below.' });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://pm-internship-portal.onrender.com/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const data = await res.json();
      setUser (data.user || data); // Handle possible response variations
      setEditMode(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Error updating profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleCancel = () => {
    // Reset form to original user data
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        location: user.location || "",
        skills: user.skills || "",
        linkedin: user.linkedin || "",
        github: user.github || "",
        twitter: user.twitter || "",
      });
    }
    setErrors({});
    setEditMode(false);
  };

  // Parse skills into array for display
  const skillsArray = user?.skills ? user.skills.split(',').map(s => s.trim()).filter(s => s) : [];

  if (loading) return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center animate-pulse">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Loading profile...</p>
      </div>
    </div>
  );
  
  if (!user) return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl text-gray-600 bg-white p-8 rounded-xl shadow-lg mb-4">No user data found.</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8">
      {/* Message Toast */}
      {message.text && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg max-w-sm mx-4 transform transition-all duration-300 animate-slide-in-right ${
          message.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {message.text}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden animate-fade-in-up mb-8">
          {/* Profile Avatar Section */}
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Enhanced Placeholder Avatar */}
                <div className="relative group cursor-pointer" onClick={() => setEditMode(true)}>
                  <div className={`w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold transition-all duration-200 group-hover:bg-white/30`}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-400 w-6 h-6 rounded-full border-2 border-white animate-pulse"></div>
                  {/* Edit Hint */}
                  {editMode ? null : (
                    <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <span className="text-xs text-white font-semibold">Edit</span>
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{user.name || user.username || 'User '}</h1>
                  <p className="text-blue-100 opacity-90">{user.username}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm opacity-90">
                <span className={`px-3 py-1 rounded-full font-semibold ${
                  user.role === 'student' ? 'bg-green-400/30 text-green-100' :
                  user.role === 'admin' ? 'bg-red-400/30 text-red-100' :
                  'bg-white/20 text-white'
                }`}>
                  {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Basic Info Section */}
          <div className="p-8 bg-gray-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3 text-gray-700 p-3 bg-white rounded-xl shadow-sm">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-semibold">
                  ID
                </span>
                <div>
                  <span className="font-semibold">Username:</span>
                  <span className="ml-2">{user.username}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 p-3 bg-white rounded-xl shadow-sm">
                <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center font-semibold">
                  R
                </span>
                <div>
                  <span className="font-semibold">Role:</span>
                  <span className="ml-2 capitalize">{user.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Profile Details Card */}
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden animate-slide-down">
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50/50">
            <h2 className="text-3xl font-bold text-gray-800">Profile Details</h2>
            <p className="text-gray-600 mt-1">Manage your personal information and professional links</p>
          </div>

          <div className="p-8">
            {editMode ? (
              /* Edit Mode Form */
              <form ref={formRef} className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: 'name', type: 'text', placeholder: 'Full Name', required: true },
                    { key: 'phone', type: 'tel', placeholder: 'Phone Number (e.g., +1-234-567-8900)' },
                    { key: 'location', type: 'text', placeholder: 'Location (City, Country)' },
                    { key: 'skills', type: 'text', placeholder: 'Skills (comma-separated, e.g., JavaScript, React, Node.js)' },
                  ].map(({ key, type, placeholder, required }) => (
                    <div key={key} className="w-full">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize" htmlFor={key}>
                        {key}
                        {required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <input
                        id={key}
                        type={type}
                        name={key}
                        value={form[key]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className={`w-full p-4 border rounded-xl shadow-sm transition-all duration-200 bg-white ${
                          errors[key]
                            ? 'border-red-300 focus:ring-2 focus:ring-red-500'
                            : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        }`}
                        aria-invalid={!!errors[key]}
                        aria-describedby={`${key}-error`}
                      />
                      {errors[key] && (
                        <p id={`${key}-error`} className="mt-1 text-sm text-red-600">{errors[key]}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                  {[
                    { key: 'linkedin', type: 'url', placeholder: 'https://linkedin.com/in/yourprofile' },
                    { key: 'github', type: 'url', placeholder: 'https://github.com/yourusername' },
                    { key: 'twitter', type: 'url', placeholder: 'https://twitter.com/yourhandle' },
                  ].map(({ key, type, placeholder }) => (
                    <div key={key} className="w-full">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize" htmlFor={key}>
                        {key}
                      </label>
                      <input
                        id={key}
                        type={type}
                        name={key}
                        value={form[key]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className={`w-full p-4 border rounded-xl shadow-sm transition-all duration-200 bg-white ${
                          errors[key]
                            ? 'border-red-300 focus:ring-2 focus:ring-red-500'
                            : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        }`}
                        aria-invalid={!!errors[key]}
                        aria-describedby={`${key}-error`}
                      />
                      {errors[key] && (
                        <p id={`${key}-error`} className="mt-1 text-sm text-red-600">{errors[key]}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={saving}
                    className={`px-8 py-3 rounded-xl shadow-lg font-semibold transition-all duration-200 transform ${
                      saving
                        ? 'bg-gray-400 cursor-not-allowed transform-none'
                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:ring-2 focus:ring-green-500 hover:scale-105'
                    } text-white`}
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 px-8 py-3 rounded-xl shadow-lg hover:from-gray-400 hover:to-gray-500 focus:ring-2 focus:ring-gray-400 transition-all duration-200 transform hover:scale-105 font-semibold disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              /* View Mode */
              <div className="space-y-6">
                {/* Personal Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Name', value: user.name, bg: 'bg-blue-50 text-blue-800' },
                    { label: 'Phone', value: user.phone, bg: 'bg-green-50 text-green-800' },
                    { label: 'Location', value: user.location, bg: 'bg-purple-50 text-purple-800' },
                  ].map(({ label, value, bg }) => (
                    value ? (
                      <div key={label} className={`p-4 ${bg} rounded-xl shadow-sm`}>
                        <span className="block text-sm font-semibold text-gray-700 capitalize mb-1">{label}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ) : null
                  ))}
                </div>

                {/* Skills Section */}
                {skillsArray.length > 0 && (
                  <div className="pt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {skillsArray.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors duration-200 cursor-pointer"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  {[
                    { label: 'LinkedIn', value: user.linkedin, className: 'text-blue-600 hover:text-blue-700 bg-blue-50' },
                    { label: 'GitHub', value: user.github, className: 'text-gray-800 hover:text-gray-700 bg-gray-50' },
                    { label: 'Twitter', value: user.twitter, className: 'text-blue-400 hover:text-blue-500 bg-blue-50/50' },
                  ].map(({ label, value, className, bg }) => (
                    value ? (
                      <div key={label} className={`p-4 ${bg || 'bg-gray-50'} rounded-xl shadow-sm`}>
                        <span className="block text-sm font-semibold text-gray-700 mb-1 capitalize">{label}:</span>
                        <a
                          href={value}
                          target="_blank"
                          rel="noreferrer"
                          className={`text-sm font-medium ${className} hover:underline transition-colors duration-200 block truncate`}
                          title={value}
                        >
                          {value}
                        </a>
                      </div>
                    ) : null
                  ))}
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-center sm:justify-end">
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 font-semibold flex items-center space-x-2"
                  >
                    <span className="text-lg">✏️</span>
                    <span>Edit Profile</span>
                  </button>
                </div>
                        </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
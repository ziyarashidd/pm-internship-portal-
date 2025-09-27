import React, { useState, useEffect, useMemo } from "react";

function Recommended() {
  const [showForm, setShowForm] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resumeLink: "",
  });
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formErrors, setFormErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, accepted, rejected
  const [profileData, setProfileData] = useState(null);

  // Enhanced internships with more details (unchanged)
  const internships = [
    { 
      id: 1,
      title: "AI/ML Internship", 
      description: "Work on real AI projects with mentors. Gain hands-on experience in machine learning models, neural networks, and data processing using TensorFlow and Python.",
      icon: "🤖",
      bgColor: "from-purple-500 to-pink-600",
      duration: "3-6 months",
      level: "Intermediate",
      skills: ["Python", "Machine Learning", "Data Science"],
      company: "AI Innovations Lab"
    },
    { 
      id: 2,
      title: "Web Development Internship", 
      description: "Build portals for government schemes. Develop responsive web applications using modern frameworks like React, Node.js, and integrate with APIs for seamless user experiences.",
      icon: "🌐",
      bgColor: "from-blue-500 to-indigo-600",
      duration: "2-4 months",
      level: "Beginner",
      skills: ["JavaScript", "React", "Node.js"],
      company: "GovTech Solutions"
    },
    { 
      id: 3,
      title: "Data Analytics Internship", 
      description: "Analyze PM Internship Scheme data. Use tools like Python, SQL, Tableau, and Power BI to derive actionable insights from large datasets and create visualizations.",
      icon: "📊",
      bgColor: "from-green-500 to-teal-600",
      duration: "3 months",
      level: "Intermediate",
      skills: ["SQL", "Python", "Data Visualization"],
      company: "Data Insights Corp"
    },
    { 
      id: 4,
      title: "Mobile App Development Internship", 
      description: "Develop cross-platform mobile apps using Flutter or React Native. Focus on UI/UX design and integrating backend services for real-world applications.",
      icon: "📱",
      bgColor: "from-orange-500 to-red-600",
      duration: "4 months",
      level: "Beginner",
      skills: ["Flutter", "React Native", "UI/UX"],
      company: "MobileFirst Studios"
    },
  ];

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch profile for auto-fill
        if (token) {
          const profileRes = await fetch("http://localhost:5000/api/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (profileRes.ok) {
            const profile = await profileRes.json();
            setProfileData(profile);
          }
        }
        // Fetch applications
        if (username) {
          const appRes = await fetch(`http://localhost:5000/api/application/student/${username}`);
          if (appRes.ok) {
            const data = await appRes.json();
            console.log('Raw apps from backend:', data.applications); // Debug: Check raw data

            // FIXED: Normalize status to standard lowercase values (same as MyApplications)
            const normalizeStatus = (rawStatus) => {
              if (!rawStatus || rawStatus === '') return 'pending'; // Default if missing/empty
              const lower = rawStatus.toString().toLowerCase(); // Handle numbers/casing
              const mapping = {
                'applied': 'pending',
                'pending': 'pending',
                'approved': 'accepted',
                'accepted': 'accepted',
                'ongoing': 'accepted', // Alias if backend uses this
                'shortlisted': 'accepted',
                'rejected': 'rejected',
                'declined': 'rejected',
                'completed': 'accepted', // If completed means accepted
              };
              return mapping[lower] || lower; // Fallback to original lowercase
            };

            const enhancedApps = (data.applications || []).map(app => ({
              ...app,
              status: normalizeStatus(app.status), // FIXED: Always normalize (no random mock)
            }));
            console.log('Normalized apps:', enhancedApps); // Debug: Verify statuses
            setApplications(enhancedApps);
          }
        }
      } catch (err) {
        console.error(err);
        showMessage('error', 'Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username, token]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (formData.phone && !/^\+?[\d\s-()]{10,}$/.test(formData.phone)) errors.phone = 'Invalid phone number';
    if (formData.resumeLink && !/^https?:\/\//.test(formData.resumeLink)) errors.resumeLink = 'Invalid URL';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApply = (internship) => {
    setSelectedInternship(internship);
    // Auto-fill from profile if available
    setFormData({
      name: profileData?.name || "",
      email: profileData?.email || "", // Assume profile has email; adjust if needed
      phone: profileData?.phone || "",
      resumeLink: profileData?.resumeLink || "", // Assume or add to profile
    });
    setFormErrors({});
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) setFormErrors({ ...formErrors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showMessage('error', 'Please fix the errors in the form.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/application/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentUsername: username, internshipTitle: selectedInternship.title, ...formData }),
      });
      const data = await res.json();
      if (res.ok) {
        const newApp = { ...data.application, status: 'pending' }; // Default normalized status
        setApplications(prev => [...prev, newApp]);
        setShowForm(false);
        showMessage('success', data.msg || 'Application submitted successfully! You will hear back soon.');
        setFormData({ name: "", email: "", phone: "", resumeLink: "" });
        // Optional: Simple confetti effect (no deps)
        if (typeof window !== 'undefined') {
          // Basic animation trigger
          document.body.style.animation = 'shake 0.5s';
          setTimeout(() => document.body.style.animation = '', 500);
        }
      } else {
        showMessage('error', data.msg || "Failed to submit application");
      }
    } catch (err) {
      console.error(err);
      showMessage('error', "Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleWithdraw = async (appId) => {
    if (!confirm('Are you sure you want to withdraw this application?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/application/${appId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setApplications(prev => prev.filter(app => app._id !== appId));
        showMessage('success', 'Application withdrawn successfully.');
      } else {
        showMessage('error', 'Failed to withdraw application.');
      }
    } catch (err) {
      console.error(err);
      showMessage('error', 'Failed to withdraw application.');
    }
  };

  // FIXED: Memoized filters for performance
  const filteredInternships = useMemo(() => 
    internships.filter(internship =>
      internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.description.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]
  );

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      if (filterStatus === 'all') return true;
      // FIXED: Case-insensitive match for safety
      return app.status?.toLowerCase() === filterStatus.toLowerCase();
    });
  }, [applications, filterStatus]);

  // FIXED: Stats with normalized statuses (added rejected for completeness)
  const stats = useMemo(() => ({
    total: applications.length,
    pending: applications.filter(a => a.status?.toLowerCase() === 'pending').length,
    accepted: applications.filter(a => a.status?.toLowerCase() === 'accepted').length,
    rejected: applications.filter(a => a.status?.toLowerCase() === 'rejected').length,
  }), [applications]);

  // Status badge component (enhanced with icons, same as MyApplications)
  const StatusBadge = ({ status }) => {
    const icons = { pending: '⏳', accepted: '✅', rejected: '❌' };
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300 animate-pulse',
      accepted: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
    };
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);
    return (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold border transform transition-all hover:scale-105 ${colors[status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
        {icons[status]} {statusText}
      </span>
    );
  };

  // Skeleton for internships
  const SkeletonInternship = () => (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden animate-pulse">
      <div className="h-32 bg-gray-200"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-10 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      {/* Custom CSS for animations (enhanced) */}
      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-slide-in-right { animation: slide-in-right 0.4s ease-out; }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-pulse-glow { animation: pulse-glow 2s infinite; }
      `}</style>

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

      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header with Search */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Recommended Internships
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover exciting opportunities tailored for your skills and interests. Apply now and take the first step towards your dream career!
          </p>
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search internships by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            />
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            <p className="text-gray-600">Total Applications</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center">
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-gray-600">Pending</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center">
            <div className="text-3xl font-bold text-green-600">{stats.accepted}</div>
            <p className="text-gray-600">Accepted</p>
          </div>
        </div>

        {/* Internships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredInternships.map((internship) => {
            const isApplied = applications.some(app => app.internshipTitle === internship.title);
            return (
              <div
                key={internship.id}
                className={`bg-white shadow-xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group animate-slide-up ${
                  isApplied ? 'opacity-75 cursor-not-allowed ring-2 ring-yellow-300' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`p-6 text-white text-center ${internship.bgColor} group-hover:opacity-90 transition-opacity`}>
                  <div className="text-5xl mb-3">{internship.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{internship.title}</h3>
                  <p className="text-blue-100 text-sm">{internship.company}</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4 leading-relaxed">{internship.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-semibold">{internship.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Level:</span>
                      <span className="font-semibold bg-gray-100 px-2 py-1 rounded text-xs">{internship.level}</span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Required Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {internship.skills.map((skill, i) => (
                        <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleApply(internship)}
                    disabled={isApplied}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform ${
                      isApplied
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:scale-105 shadow-lg'
                    }`}
                    aria-label={isApplied ? "Already applied" : "Apply for this internship"}
                  >
                    {isApplied ? (
                      <>
                        <StatusBadge status={applications.find(a => a.internshipTitle === internship.title)?.status || 'pending'} />
                        <span className="ml-2">Already Applied</span>
                      </>
                    ) : (
                      'Apply Now'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
          {filteredInternships.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl text-gray-500">No internships match your search.</p>
              <p className="text-gray-600">Try adjusting your search terms.</p>
            </div>
          )}
        </div>

        {/* Enhanced Application Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto transform transition-all duration-300 animate-slide-up">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{selectedInternship.title}</h3>
                    <p className="text-gray-600 text-sm">{selectedInternship.company} • {selectedInternship.duration}</p>
                  </div>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close modal"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="name">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10 ${
                      formErrors.name ? 'border-red-300' : 'border-gray-200'
                    }`}
                    required
                    autoComplete="name"
                  />
                  {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                </div>

               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      formErrors.email ? 'border-red-300' : 'border-gray-200'
                    }`}
                    required
                  />
                  {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g., +1-234-567-8900"
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      formErrors.phone ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {formErrors.phone && <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="resumeLink">
                    Resume Link
                  </label>
                  <input
                    id="resumeLink"
                    type="url"
                    name="resumeLink"
                    value={formData.resumeLink}
                    onChange={handleChange}
                    placeholder="e.g., https://your-resume-link.com"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                      submitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:scale-105 shadow-lg'
                    }`}
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    disabled={submitting}
                    className="flex-1 py-3 px-6 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition-all font-semibold disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* My Applications Section */}
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden animate-slide-down">
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
            <h2 className="text-3xl font-bold text-gray-800">My Applications ({applications.length})</h2>
            <p className="text-gray-600 mt-1">Track your submitted applications and status.</p>
          </div>
          <div className="p-8">
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-xl text-gray-500 mb-4">No applications yet.</p>
                <p className="text-gray-600">Start by applying to one of the recommended internships above!</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {applications.map((app, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-500">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                      <h4 className="text-xl font-bold text-gray-800">{app.internshipTitle}</h4>
                      <span className="text-sm text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full">
                        Submitted
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                      <div>
                        <span className="font-semibold">Applicant:</span> {app.name}
                      </div>
                      <div>
                        <span className="font-semibold">Email:</span> {app.email}
                      </div>
                      <div>
                        <span className="font-semibold">Phone:</span> {app.phone || 'Not provided'}
                      </div>
                      <div>
                        <span className="font-semibold">Applied At:</span> {new Date(app.appliedAt).toLocaleString()}
                      </div>
                    </div>
                    {app.resumeLink && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <span className="font-semibold text-gray-700">Resume:</span>
                        <a
                          href={app.resumeLink}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-2 text-blue-600 hover:underline text-sm font-medium"
                        >
                          View Resume
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recommended; 
import React, { useEffect, useState } from "react";

function Home() {
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState("");
  const [showQuickActions, setShowQuickActions] = useState(false);

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch profile for personalized greeting (optional, if API exists)
        if (token) {
          const profileRes = await fetch("https://pm-internship-portal.onrender.com/api/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            setProfile(profileData);
          }
        }
        // Fetch applications
        if (username) {
          const res = await fetch(`https://pm-internship-portal.onrender.com/api/application/student/${username}`);
          if (!res.ok) throw new Error('Failed to fetch applications');
          const data = await res.json();
          console.log('Fetched applications from backend:', data.applications); // Debug log
          setApplications(data.applications || []);
          if (data.applications?.length > 0) {
            showMessage('success', `Loaded ${data.applications.length} application(s) successfully!`);
          }
        } else {
          setApplications([]);
        }
      } catch (err) {
        console.error(err);
        showMessage('error', 'Failed to load dashboard. Please check your connection or login again.');
      } finally {
        setLoading(false);
      }
    };

    if (username && token) fetchData();
    else setLoading(false);
  }, [username, token]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    // Success shake animation
    if (type === 'success') {
      document.body.style.animation = 'shake 0.5s ease-in-out';
      setTimeout(() => document.body.style.animation = '', 500);
    }
  };

  // Count applications for each status
  const getCount = (status) => {
    switch (status) {
      case "Applied":
        return applications.length;
      case "Shortlisted":
        return applications.filter(app => app.status === "Approved").length;
      case "Ongoing":
        return applications.filter(app => app.status === "Approved" || app.status === "Ongoing").length;
      case "Completed":
        return applications.filter(app => app.status === "Completed").length;
      default:
        return 0;
    }
  };

  // Filter applications for display (with search)
  const filteredApplications = (status) => {
    let apps = [];
    switch (status) {
      case "Applied":
        apps = applications;
        break;
      case "Shortlisted":
        apps = applications.filter(app => app.status === "Approved");
        break;
      case "Ongoing":
        apps = applications.filter(app => app.status === "Approved" || app.status === "Ongoing");
        break;
      case "Completed":
        apps = applications.filter(app => app.status === "Completed");
        break;
      default:
        apps = [];
    }
    // Apply search filter
    if (searchTerm) {
      return apps.filter(app =>
        app.internshipTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return apps;
  };

  const handleCardClick = (status) => {
    if (getCount(status) === 0 && status !== "Applied") {
      showMessage('info', `No applications in "${status}" status yet.`);
      return;
    }
    setSelectedStatus(status);
    setSearchTerm(""); // Reset search
  };

  const closeModal = () => {
    setSelectedStatus(null);
    setSearchTerm("");
  };

  const handleWithdraw = async (appId) => {
    if (!confirm('Are you sure you want to withdraw this application?')) return;
    try {
      const res = await fetch(`https://pm-internship-portal.onrender.com/api/application/${appId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setApplications(prev => prev.filter(app => app._id !== appId));
        showMessage('success', 'Application withdrawn successfully!');
      } else {
        const data = await res.json();
        showMessage('error', data.msg || 'Failed to withdraw application.');
      }
    } catch (err) {
      console.error(err);
      showMessage('error', 'Failed to withdraw application. Please try again.');
    }
  };

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const colors = {
      Applied: 'bg-blue-100 text-blue-800 border-blue-300',
      Approved: 'bg-yellow-100 text-yellow-800 border-yellow-300 animate-pulse',
      Ongoing: 'bg-green-100 text-green-800 border-green-300',
      Completed: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    const statusText = (status || 'Applied').charAt(0).toUpperCase() + (status || 'Applied').slice(1);
    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border transform transition-all hover:scale-105 ${colors[status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
        {statusText}
      </span>
    );
  };

  // Enhanced Stats Card Component
  const StatsCard = ({ status, count, delay = 0, onClick }) => {
    const colors = {
      Applied: 'from-blue-500 to-indigo-600',
      Shortlisted: 'from-yellow-500 to-orange-600',
      Ongoing: 'from-green-500 to-teal-600',
      Completed: 'from-gray-500 to-gray-600',
    };
    const icons = {
      Applied: '📝',
      Shortlisted: '⭐',
      Ongoing: '🔄',
      Completed: '✅',
    };
    const isEmpty = count === 0;

    return (
      <div
        className={`bg-white p-6 rounded-2xl shadow-xl cursor-pointer overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-[fade-in-up_0.6s_ease-out_${delay}ms_forwards] ${
          isEmpty ? 'opacity-60 cursor-not-allowed' : 'hover:animate-pulse-glow'
        }`}
        style={{ animationDelay: `${delay}ms` }}
        onClick={onClick}
      >
        <div className="relative">
          <div className={`text-4xl mb-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110 ${isEmpty ? 'text-gray-400' : ''}`}>
            {icons[status]}
          </div>
          <div className={`text-3xl font-bold text-gray-800 mb-2 animate-count-up group-hover:text-gray-900 ${isEmpty ? 'text-gray-500' : ''}`}>
            {count}
          </div>
          <div className={`absolute inset-0 bg-gradient-to-r ${colors[status]} opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${isEmpty ? 'opacity-10' : ''}`}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          {isEmpty && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">Coming Soon</div>
          )}
        </div>
        <h3 className={`text-gray-700 font-semibold group-hover:text-gray-900 transition-colors duration-300 ${isEmpty ? 'text-gray-500' : ''}`}>
          {status}
        </h3>
      </div>
    );
  };

  // Skeleton Loaders
  const SkeletonStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white p-6 rounded-2xl shadow-xl animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
      ))}
    </div>
  );

  const SkeletonApplication = () => (
    <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-500 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      {/* Custom CSS for Enhanced Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes count-up {
          from { opacity: 0; transform: scale(0.8) rotate(-5deg); }
          to { opacity: 1; transform: scale(1) rotate(0deg); }
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
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-[fade-in-up_0.6s_ease-out_${delay => delay}ms_forwards] {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .animate-slide-in-right { animation: slide-in-right 0.4s ease-out; }
        .animate-count-up { animation: count-up 0.8s ease-out; }
        .animate-pulse-glow { animation: pulse-glow 2s infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
        .animate-delay-200 { animation-delay: 200ms; }
      `}</style>

      {/* Enhanced Message Toast */}
      {message.text && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg max-w-sm mx-4 transform transition-all duration-300 animate-slide-in-right ${
          message.type === 'success' 
            ? 'bg-green-500 text-white animate-bounce' 
            : message.type === 'info'
            ? 'bg-blue-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {message.text}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Enhanced Personalized Header */}
        <div className="text-center mb-12 animate-[fade-in-up_0.8s_ease-out] animate-float">
          <h1 className="text-5xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Welcome Back, {profile?.name || username || 'Student'}!
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Here's a comprehensive overview of your internship journey. Total Applications: <span className="font-semibold text-blue-600">{applications.length}</span>
            {applications.length === 0 && (
              <span className="block mt-2 text-yellow-600 font-medium">No applications found. Start by applying to internships!</span>
            )}
          </p>
        </div>

        {/* Enhanced Quick Actions Panel */}
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-8 animate-[fade-in-up_0.6s_ease-out] animate-delay-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
              {showQuickActions ? 'Hide' : 'Show'}
            </button>
          </div>
          {showQuickActions && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-down">
              <button
                onClick={() => window.location.href = '/dashboard/recommended'}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 font-semibold animate-pulse-glow"
              >
                Explore New Internships
              </button>
              <button
                onClick={() => window.location.href = '/dashboard/profile'}
                className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4 rounded-xl shadow-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                Update Profile
              </button>
              <button
                onClick={() => window.location.href = '/dashboard/applications'}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                View All Applications
              </button>
            </div>
          )}
        </div>

        {/* Enhanced Stats Grid with Skeletons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {loading ? (
            <SkeletonStats />
          ) : (
            ["Applied", "Shortlisted", "Ongoing", "Completed"].map((status, index) => (
              <StatsCard
                key={status}
                status={status}
                count={getCount(status)}
                delay={index * 200}
                onClick={() => handleCardClick(status)}
              />
            ))
          )}
        </div>

        {/* Backend Status Note */}
        {applications.length > 0 && getCount("Shortlisted") + getCount("Ongoing") + getCount("Completed") === 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-xl mb-8 animate-[fade-in-up_0.6s_ease-out]">
            <p className="text-yellow-800 font-medium">
              <strong>Note:</strong> All your applications are currently under "Applied" status. Update your backend to track advanced statuses!
            </p>
          </div>
        )}

        {/* Enhanced Applications Modal with Search and Skeletons */}
        {selectedStatus && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto transform transition-all duration-500 animate-slide-up">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{selectedStatus} Applications</h3>
                    <p className="text-gray-600">({filteredApplications(selectedStatus).length} results)</p>
                 </div>
                  <button
                    onClick={() => setSelectedStatus(null)}
                    className="text-gray-400 hover:text-gray-600 transition-all duration-200 text-xl font-bold transform hover:scale-110"
                    aria-label="Close modal"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Application List */}
              <div className="p-6 space-y-6">
                {filteredApplications(selectedStatus).length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4 animate-bounce">🔍</div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">No Applications Found</h4>
                    <p className="text-gray-600">No applications match this status.</p>
                  </div>
                ) : (
                  filteredApplications(selectedStatus).map((app, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-500 hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md animate-fade-in-up"
                      style={{ animationDelay: `${i * 150}ms` }}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-800 mb-1 hover:text-blue-600 transition-colors">
                            {app.internshipTitle}
                          </h4>
                          <span className="inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-300">
                            {app.status || 'Applied'}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                        <div><span className="font-semibold">Name:</span> {app.name}</div>
                        <div><span className="font-semibold">Email:</span> {app.email}</div>
                        <div><span className="font-semibold">Phone:</span> {app.phone || 'Not provided'}</div>
                        <div><span className="font-semibold">Applied At:</span> {new Date(app.appliedAt).toLocaleString()}</div>
                      </div>
                      {app.resumeLink && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <span className="font-semibold text-gray-700">Resume:</span>
                          <a
                            href={app.resumeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-blue-600 hover:text-blue-800 hover:underline font-medium transition-all transform hover:scale-105"
                          >
                            📄 View Resume
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer with Close Button */}
              <div className="p-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setSelectedStatus(null)}
                  className="bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 px-8 py-3 rounded-xl shadow-lg hover:from-gray-400 hover:to-gray-500 transition-all duration-200 transform hover:scale-105 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Empty State if No Applications */}
      {!selectedStatus && applications.length === 0 && (
        <div className="text-center py-16 animate-fade-in-up">
          <div className="text-6xl mb-6 animate-bounce">🚀</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Get Started with Internships</h3>
          <p className="text-gray-600 mb-6">You haven't applied for any internships yet.</p>
        </div>
      )}
    </div>
  );
}

export default Home;
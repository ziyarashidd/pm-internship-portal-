import React, { useEffect, useState, useMemo } from "react";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, accepted, rejected
  const [submitting, setSubmitting] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(null); // For app ID to confirm withdraw
  const [searchTerm, setSearchTerm] = useState(""); // For searching applications

  const username = localStorage.getItem("username"); // logged-in student

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://pm-internship-portal.onrender.com/api/application/student/${username}`);
        if (!res.ok) throw new Error('Failed to fetch applications');
        const data = await res.json();
        console.log('Raw apps from backend:', data.applications); // Debug: Check raw data

        // FIXED: Normalize status to standard lowercase values
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
          status: normalizeStatus(app.status), // FIXED: Always normalize
        }));
        console.log('Normalized apps:', enhancedApps); // Debug: Verify statuses
        setApplications(enhancedApps);
      } catch (err) {
        console.error(err);
        showMessage('error', 'Failed to load applications. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchApplications();
  }, [username]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // Refresh function
  const handleRefresh = () => {
    setLoading(true);
    // Re-trigger useEffect by changing a key or call fetch directly
    window.location.reload(); // Simple reload for demo; optimize if needed
  };

  const handleWithdraw = async (appId) => {
    setSubmitting(true);
    try {
      const res = await fetch(`https://pm-internship-portal.onrender.com/api/application/${appId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setApplications(prev => prev.filter(app => app._id !== appId));
        showMessage('success', 'Application withdrawn successfully.');
        // Simple success animation on body
        document.body.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => document.body.style.animation = '', 500);
      } else {
        const data = await res.json();
        showMessage('error', data.msg || 'Failed to withdraw application.');
      }
    } catch (err) {
      console.error(err);
      showMessage('error', 'Failed to withdraw application. Please try again.');
    } finally {
      setSubmitting(false);
      setShowWithdrawModal(null);
    }
  };

  // FIXED: Memoized filtered applications for performance
  const filteredApplications = useMemo(() => {
    return applications
      .filter(app => {
        if (filterStatus === 'all') return true;
        // FIXED: Case-insensitive match for safety
        return app.status?.toLowerCase() === filterStatus.toLowerCase();
      })
      .filter(app =>
        app.internshipTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [applications, filterStatus, searchTerm]);

  // FIXED: Stats with normalized statuses
  const stats = useMemo(() => ({
    total: applications.length,
    pending: applications.filter(a => a.status?.toLowerCase() === 'pending').length,
    accepted: applications.filter(a => a.status?.toLowerCase() === 'accepted').length,
    rejected: applications.filter(a => a.status?.toLowerCase() === 'rejected').length,
  }), [applications]);

  // Status badge component (enhanced with icons)
  const StatusBadge = ({ status }) => {
    const icons = { pending: '⏳', accepted: '✅', rejected: '❌' };
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300 animate-pulse',
      accepted: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
    };
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);
    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border transform transition-all hover:scale-105 ${colors[status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
        {icons[status]} {statusText}
      </span>
    );
  };

  // Enhanced Stats Card with icons and gradients
  const StatsCard = ({ value, label, color, icon, delay = 0 }) => (
    <div 
      className={`bg-white p-6 rounded-2xl shadow-xl text-center overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 animate-[fade-in-up_0.6s_ease-out_${delay}ms_forwards]`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative">
        <div className={`text-4xl mb-2 opacity-0 group-hover:opacity-100 transition-all duration-500`}>{icon}</div>
        <div className={`text-3xl font-bold ${color} mb-2 animate-count-up`}>{value}</div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
      <p className="text-gray-600 font-medium">{label}</p>
    </div>
  );

  // Skeleton loader for applications (unchanged)
  const SkeletonApplication = () => (
    <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-500 animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
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
          <p className="text-lg text-gray-600">Loading your applications...</p>
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
        @keyframes count-up {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
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
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
        .animate-delay-200 { animation-delay: 200ms; }
        .animation-delay-200 { animation-delay: 200ms; }
      `}</style>

      {/* Message Toast with animation (enhanced with info type) */}
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

      {/* Enhanced Withdraw Confirmation Modal with app details */}
      {showWithdrawModal && applications.find(app => app._id === showWithdrawModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 animate-slide-up">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Withdrawal</h3>
              <p className="text-gray-600 mb-2">Are you sure you want to withdraw this application? This action cannot be undone.</p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <strong>Internship:</strong> {applications.find(app => app._id === showWithdrawModal)?.internshipTitle}
              </div>
            </div>
            <div className="p-6 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => setShowWithdrawModal(null)}
                className="flex-1 py-3 px-6 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleWithdraw(showWithdrawModal)}
                disabled={submitting}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                  submitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600 hover:scale-105 shadow-lg animate-pulse-glow'
                }`}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                    Withdrawing...
                  </>
                ) : (
                  'Withdraw'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header with stats summary and refresh */}
        <div className="text-center mb-12 animate-[fade-in-up_0.8s_ease-out]">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent animate-slide-down">
            My Applications
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4 animate-slide-down animation-delay-200">
            Track the status of your internship applications and manage them with ease. Total: <span className="font-semibold text-blue-600">{stats.total}</span>
          </p>
          <button
            onClick={handleRefresh}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 font-semibold animate-pulse-glow"
          >
            🔄 Refresh Data
          </button>
        </div>

        {/* Stats Dashboard with staggered animations */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard value={stats.total} label="Total" color="text-blue-600" icon="📊" delay={0} />
          <StatsCard value={stats.pending} label="Pending" color="text-yellow-600" icon="⏳" delay={200} />
          <StatsCard value={stats.accepted} label="Accepted" color="text-green-600" icon="✅" delay={400} />
          <StatsCard value={stats.rejected} label="Rejected" color="text-red-600" icon="❌" delay={600} />
        </div>

        {/* Search & Filter Section with animation */}
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-8 animate-[fade-in-up_0.6s_ease-out] animate-delay-800">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by internship, name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white hover:shadow-md"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 hidden lg:block">Filter by Status</h3>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white hover:shadow-md"
            >
              <option value="all">All Applications</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>


        {/* Applications List with skeleton during loading/filtering */}
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 animate-slide-down">
            <h2 className="text-3xl font-bold text-gray-800">Application Details ({filteredApplications.length})</h2>
            <p className="text-gray-600 mt-1">View, search, and manage your submitted applications.</p>
          </div>
          <div className="p-8">
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <SkeletonApplication key={i} />
                ))}
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-16 animate-[fade-in-up_0.8s_ease-out]">
                <div className="text-6xl mb-6 animate-bounce">📋</div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2 animate-slide-down">
                  {applications.length === 0 ? 'No Applications Yet' : 'No Applications Match Your Search/Filter'}
                </h3>
                <p className="text-gray-600 mb-6 animate-slide-down animation-delay-200">
                  {applications.length === 0 
                    ? 'You haven\'t applied for any internships yet. Check out the recommended opportunities!' 
                    : 'Try adjusting your search or filter to see more applications.'
                  }
                </p>
                {applications.length === 0 && (
                  <button
                    onClick={() => window.location.href = '/recommended'} // Adjust route as needed
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 font-semibold animate-[pulse_2s_infinite]"
                  >
                    Browse Internships
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredApplications.map((app, index) => (
                  <div 
                    key={app._id || app.id} 
                    className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-500 hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md animate-[fade-in-up_0.6s_ease-out] animate-delay-[100ms]"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-800 mb-1 hover:text-blue-600 transition-colors duration-200">{app.internshipTitle}</h4>
                        <StatusBadge status={app.status} />
                      </div>
                      {app.status !== 'accepted' && app.status !== 'rejected' && (
                        <button
                          onClick={() => setShowWithdrawModal(app._id)}
                          disabled={submitting}
                          className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition-all duration-200 transform hover:scale-105 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none animate-[pulse_2s_infinite] hover:animate-none"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 animate-slide-up">
                      <div className="transition-all hover:text-gray-900">
                        <span className="font-semibold">Name:</span> {app.name}
                      </div>
                      <div className="transition-all hover:text-gray-900">
                        <span className="font-semibold">Email:</span> {app.email}
                      </div>
                      <div className="transition-all hover:text-gray-900">
                        <span className="font-semibold">Phone:</span> {app.phone || 'Not provided'}
                      </div>
                      <div className="transition-all hover:text-gray-900">
                        <span className="font-semibold">Applied At:</span> {new Date(app.appliedAt).toLocaleString()}
                      </div>
                    </div>
                    {app.resumeLink && (
                      <div className="mt-4 pt-4 border-t border-gray-200 animate-slide-up animation-delay-200">
                        <span className="font-semibold text-gray-700">Resume:</span>
                        <a
                          href={app.resumeLink}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-2 text-blue-600 hover:text-blue-800 hover:underline font-medium transition-all duration-200 transform hover:scale-105"
                        >
                          📄 View Resume
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
  );
}


export default MyApplications;

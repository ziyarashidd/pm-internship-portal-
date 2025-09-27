import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaFileExport,
  FaCalendarAlt,
  FaSearch,
  FaSyncAlt,
  FaSpinner,
  FaBriefcase,
  FaClipboardList,
  FaCheck,
  FaTimes,
  FaBuilding,
  FaDownload,
} from "react-icons/fa";

function Reports() {
  const [reportData, setReportData] = useState({
    overview: {
      totalInternshipsPosted: 0,
      totalApplicationsReceived: 0,
      acceptanceRate: 0,
      completionRate: 0,
    },
    trends: [],
    breakdowns: {
      pending: 0,
      accepted: 0,
      rejected: 0,
      completed: 0,
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState('lastMonth');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const navigate = useNavigate();

  // Protected route check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "Employer") {
      navigate("/login");
      return;
    }
    fetchReports();
  }, [navigate, dateFilter]);

  // Fetch data
  const fetchReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ period: dateFilter });

      const res = await fetch(`http://localhost:5000/api/employer/reports?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch reports');

      const data = await res.json();
      setReportData(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to load reports. Please check backend or refresh.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format = 'csv') => {
    try {
      setIsExporting(true);
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ period: dateFilter, format });

      const res = await fetch(`http://localhost:5000/api/employer/reports/export?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to export reports');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `employer-reports-${dateFilter}-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      alert('Reports exported successfully!');
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export reports. Try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const filteredTrends = reportData.trends.filter(trend =>
    trend?.month?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = () => {
    fetchReports();
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Loading Reports...</h1>
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-20 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Employer Reports</h1>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <FaSyncAlt className="mr-2" />
            Refresh
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={isExporting}
          >
            {isExporting ? <FaSpinner className="animate-spin mr-2" /> : <FaDownload className="mr-2" />}
            Export CSV
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          {error}
          <button onClick={handleRefresh} className="ml-4 underline">Retry</button>
        </div>
      )}

      {/* Date Filter */}
      <div className="flex items-center gap-2">
        <FaCalendarAlt />
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="lastMonth">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <OverviewCard icon={<FaBriefcase />} label="Internships" value={reportData.overview.totalInternshipsPosted} />
        <OverviewCard icon={<FaClipboardList />} label="Applications" value={reportData.overview.totalApplicationsReceived} />
        <OverviewCard icon={<FaCheck />} label="Acceptance Rate" value={`${reportData.overview.acceptanceRate}%`} />
        <OverviewCard icon={<FaBuilding />} label="Completion Rate" value={`${reportData.overview.completionRate}%`} />
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard color="yellow" icon={<FaSpinner />} label="Pending" value={reportData.breakdowns.pending} />
        <StatusCard color="green" icon={<FaCheck />} label="Accepted" value={reportData.breakdowns.accepted} />
        <StatusCard color="red" icon={<FaTimes />} label="Rejected" value={reportData.breakdowns.rejected} />
        <StatusCard color="purple" icon={<FaBuilding />} label="Completed" value={reportData.breakdowns.completed} />
      </div>

      {/* Trends Search */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Application Trends</h2>
        <div className="relative">
          <FaSearch className="absolute top-2.5 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search month..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded"
          />
        </div>
      </div>

      {/* Trends Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Month</th>
              <th className="p-3 text-left">Applications</th>
              <th className="p-3 text-left">Accepted</th>
              <th className="p-3 text-left">Rejected</th>
              <th className="p-3 text-left">Pending</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrends.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">No data available</td>
              </tr>
            ) : (
              filteredTrends.map((trend) => (
                <tr key={trend.month} className="border-t">
                  <td className="p-3">{trend.month}</td>
                  <td className="p-3">{trend.applications || 0}</td>
                  <td className="p-3 text-green-600">{trend.accepted || 0}</td>
                  <td className="p-3 text-red-600">{trend.rejected || 0}</td>
                  <td className="p-3 text-yellow-600">{trend.pending || 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Components
const OverviewCard = ({ icon, label, value }) => (
  <div className="bg-white p-4 shadow rounded flex flex-col items-start space-y-2">
    <div className="text-2xl text-blue-500">{icon}</div>
    <div className="text-sm text-gray-500">{label}</div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

const StatusCard = ({ icon, label, value, color }) => {
  const bgMap = {
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    purple: 'bg-purple-100 text-purple-700',
  };
  return (
    <div className={`p-4 rounded shadow ${bgMap[color]}`}>
      <div className="text-xl mb-2">{icon}</div>
      <div className="text-sm">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
};

export default Reports;

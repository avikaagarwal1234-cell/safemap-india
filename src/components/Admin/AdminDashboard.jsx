import React, { useState } from 'react';
import { 
  BarChart3, 
  FileText, 
  TrendingUp, 
  Map, 
  Download, 
  LogOut,
  Users,
  MapPin,
  AlertTriangle,
  Activity
} from 'lucide-react';

// Mock data for demonstration
const mockReports = [
  { id: 1, type: 'Harassment', city: 'Mumbai', state: 'Maharashtra', date: '2025-04-25', severity: 4, verified: true },
  { id: 2, type: 'Stalking', city: 'Delhi', state: 'Delhi', date: '2025-04-25', severity: 5, verified: false },
  { id: 3, type: 'Physical Assault', city: 'Bangalore', state: 'Karnataka', date: '2025-04-24', severity: 5, verified: true },
  { id: 4, type: 'Theft', city: 'Chennai', state: 'Tamil Nadu', date: '2025-04-24', severity: 3, verified: false },
  { id: 5, type: 'Unsafe Area', city: 'Kolkata', state: 'West Bengal', date: '2025-04-23', severity: 2, verified: true },
  { id: 6, type: 'Cyber Harassment', city: 'Hyderabad', state: 'Telangana', date: '2025-04-23', severity: 3, verified: false },
  { id: 7, type: 'Threatening Behavior', city: 'Pune', state: 'Maharashtra', date: '2025-04-22', severity: 4, verified: true },
  { id: 8, type: 'Suspicious Activity', city: 'Jaipur', state: 'Rajasthan', date: '2025-04-22', severity: 2, verified: false },
];

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 20;

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'reports', label: 'All Reports', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'map', label: 'Map View', icon: Map },
    { id: 'export', label: 'Export Data', icon: Download },
  ];

  // Calculate stats
  const totalReports = mockReports.length;
  const reportsToday = mockReports.filter(r => r.date === '2025-04-25').length;
  const mostReportedCity = 'Mumbai'; // Would calculate from data
  const avgSeverity = (mockReports.reduce((acc, r) => acc + r.severity, 0) / mockReports.length).toFixed(1);

  // Filter reports for search
  const filteredReports = mockReports.filter(report => 
    report.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  const getSeverityColor = (severity) => {
    if (severity <= 2) return 'bg-green-500';
    if (severity === 3) return 'bg-yellow-500';
    if (severity === 4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-purple-primary/20 border-l-4 border-purple-light rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Total Reports</p>
              <p className="text-2xl font-bold text-white mt-1">{totalReports}</p>
              <p className="text-green-400 text-sm mt-2">+12% this week</p>
            </div>
            <FileText className="w-8 h-8 text-purple-light" />
          </div>
        </div>

        <div className="bg-purple-primary/20 border-l-4 border-green-500 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Reports Today</p>
              <p className="text-2xl font-bold text-white mt-1">{reportsToday}</p>
              <p className="text-gray-400 text-sm mt-2">Last 24 hours</p>
            </div>
            <Activity className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-purple-primary/20 border-l-4 border-orange-500 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Most Reported City</p>
              <p className="text-2xl font-bold text-white mt-1">{mostReportedCity}</p>
              <p className="text-gray-400 text-sm mt-2">Maharashtra</p>
            </div>
            <MapPin className="w-8 h-8 text-orange-400" />
          </div>
        </div>

        <div className="bg-purple-primary/20 border-l-4 border-red-500 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Average Severity</p>
              <p className="text-2xl font-bold text-white mt-1">{avgSeverity}</p>
              <p className="text-gray-400 text-sm mt-2">Scale 1-5</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">All Reports</h2>
        <input
          type="text"
          placeholder="Search by city or type..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 bg-navy-dark/50 border border-purple-light/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-light"
        />
      </div>

      <div className="bg-purple-primary/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple-primary/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">State</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Verified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-light/20">
              {currentReports.map((report) => (
                <tr key={report.id} className="hover:bg-purple-primary/10">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">#{report.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{report.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{report.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{report.state}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{report.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getSeverityColor(report.severity)}`}>
                      {report.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      report.verified 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
                    }`}>
                      {report.verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 bg-purple-primary/20">
            <div className="text-sm text-gray-300">
              Showing {indexOfFirstReport + 1} to {Math.min(indexOfLastReport, filteredReports.length)} of {filteredReports.length} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-purple-primary/50 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-primary/70"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-white">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-purple-primary/50 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-primary/70"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Analytics</h2>
      <div className="bg-purple-primary/20 border border-purple-light/30 rounded-lg p-8 text-center">
        <TrendingUp className="w-16 h-16 text-purple-light mx-auto mb-4" />
        <p className="text-gray-300">Analytics dashboard coming soon...</p>
        <p className="text-gray-400 text-sm mt-2">Charts and insights will appear here</p>
      </div>
    </div>
  );

  const renderMap = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Map View</h2>
      <div className="bg-purple-primary/20 border border-purple-light/30 rounded-lg p-8 text-center">
        <Map className="w-16 h-16 text-purple-light mx-auto mb-4" />
        <p className="text-gray-300">Interactive map view coming soon...</p>
        <p className="text-gray-400 text-sm mt-2">View incidents on the map</p>
      </div>
    </div>
  );

  const renderExport = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Export Data</h2>
      <div className="bg-purple-primary/20 border border-purple-light/30 rounded-lg p-8">
        <div className="text-center">
          <Download className="w-16 h-16 text-purple-light mx-auto mb-4" />
          <p className="text-gray-300 mb-4">Export incident reports in various formats</p>
          <div className="flex justify-center space-x-4">
            <button className="px-4 py-2 bg-purple-primary hover:bg-purple-light text-white rounded-lg transition-colors">
              Export as CSV
            </button>
            <button className="px-4 py-2 bg-purple-primary hover:bg-purple-light text-white rounded-lg transition-colors">
              Export as JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'reports': return renderReports();
      case 'analytics': return renderAnalytics();
      case 'map': return renderMap();
      case 'export': return renderExport();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-navy-dark flex">
      {/* Sidebar */}
      <div className="w-64 bg-purple-primary/20 border-r border-purple-light/30">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white mb-8">Admin Panel</h1>
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-purple-primary text-white'
                      : 'text-gray-300 hover:bg-purple-primary/30 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;

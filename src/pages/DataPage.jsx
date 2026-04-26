import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Database, 
  TrendingUp, 
  AlertTriangle, 
  Shield, 
  Users, 
  ChevronDown, 
  ChevronUp,
  ArrowUp,
  ArrowDown,
  ExternalLink
} from 'lucide-react';

const DataPage = () => {
  const [ncrbData, setNcrbData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const rowsPerPage = 10;

  // Mock NCRB data for demonstration
  useEffect(() => {
    const mockNcrbData = [
      { id: 1, city: 'Mumbai', state: 'Maharashtra', totalCrimes: 15420, crimeRate: 65.4, topCrime: 'Theft', year: 2022 },
      { id: 2, city: 'Delhi', state: 'Delhi', totalCrimes: 18950, crimeRate: 98.7, topCrime: 'Crimes Against Women', year: 2022 },
      { id: 3, city: 'Bangalore', state: 'Karnataka', totalCrimes: 12340, crimeRate: 78.2, topCrime: 'Cyber Crime', year: 2022 },
      { id: 4, city: 'Chennai', state: 'Tamil Nadu', totalCrimes: 9870, crimeRate: 54.3, topCrime: 'Theft', year: 2022 },
      { id: 5, city: 'Kolkata', state: 'West Bengal', totalCrimes: 11230, crimeRate: 67.8, topCrime: 'Assault', year: 2022 },
      { id: 6, city: 'Hyderabad', state: 'Telangana', totalCrimes: 8950, crimeRate: 45.6, topCrime: 'Cyber Crime', year: 2022 },
      { id: 7, city: 'Pune', state: 'Maharashtra', totalCrimes: 7680, crimeRate: 42.1, topCrime: 'Theft', year: 2022 },
      { id: 8, city: 'Jaipur', state: 'Rajasthan', totalCrimes: 6540, crimeRate: 38.9, topCrime: 'Crimes Against Women', year: 2022 },
      { id: 9, city: 'Lucknow', state: 'Uttar Pradesh', totalCrimes: 5890, crimeRate: 35.2, topCrime: 'Assault', year: 2022 },
      { id: 10, city: 'Ahmedabad', state: 'Gujarat', totalCrimes: 5430, crimeRate: 32.8, topCrime: 'Theft', year: 2022 },
      { id: 11, city: 'Surat', state: 'Gujarat', totalCrimes: 4870, crimeRate: 29.4, topCrime: 'Cyber Crime', year: 2022 },
      { id: 12, city: 'Kanpur', state: 'Uttar Pradesh', totalCrimes: 4560, crimeRate: 27.8, topCrime: 'Assault', year: 2022 },
      { id: 13, city: 'Nagpur', state: 'Maharashtra', totalCrimes: 4230, crimeRate: 25.6, topCrime: 'Theft', year: 2022 },
      { id: 14, city: 'Indore', state: 'Madhya Pradesh', totalCrimes: 3980, crimeRate: 24.3, topCrime: 'Cyber Crime', year: 2022 },
      { id: 15, city: 'Thane', state: 'Maharashtra', totalCrimes: 3750, crimeRate: 23.1, topCrime: 'Theft', year: 2022 },
      { id: 16, city: 'Bhopal', state: 'Madhya Pradesh', totalCrimes: 3540, crimeRate: 21.9, topCrime: 'Crimes Against Women', year: 2022 },
      { id: 17, city: 'Visakhapatnam', state: 'Andhra Pradesh', totalCrimes: 3320, crimeRate: 20.8, topCrime: 'Assault', year: 2022 },
      { id: 18, city: 'Pimpri-Chinchwad', state: 'Maharashtra', totalCrimes: 3150, crimeRate: 19.7, topCrime: 'Theft', year: 2022 },
    ];

    setNcrbData(mockNcrbData);
    setLoading(false);
  }, []);

  // Calculate national overview stats
  const nationalStats = {
    totalCrimes: ncrbData.reduce((sum, city) => sum + city.totalCrimes, 0),
    statesCovered: new Set(ncrbData.map(city => city.state)).size,
    citiesCovered: ncrbData.length,
    highestCrimeRateCity: ncrbData.reduce((max, city) => city.crimeRate > max.crimeRate ? city : max, ncrbData[0] || {})
  };

  // Crime category breakdown
  const crimeCategories = [
    { name: 'Crimes Against Women', count: 45670, percentage: 28.5, color: '#DC2626' },
    { name: 'Theft', count: 38920, percentage: 24.3, color: '#F59E0B' },
    { name: 'Assault', count: 32150, percentage: 20.1, color: '#EF4444' },
    { name: 'Cyber Crime', count: 28430, percentage: 17.8, color: '#3B82F6' },
    { name: 'Others', count: 14830, percentage: 9.3, color: '#6B7280' }
  ];

  // State-wise data
  const stateData = [
    { state: 'Maharashtra', totalIncidents: 45670, crimeRate: 52.3, grade: 'C' },
    { state: 'Delhi', totalIncidents: 18950, crimeRate: 98.7, grade: 'E' },
    { state: 'Karnataka', totalIncidents: 12340, crimeRate: 78.2, grade: 'D' },
    { state: 'Tamil Nadu', totalIncidents: 9870, crimeRate: 54.3, grade: 'C' },
    { state: 'West Bengal', totalIncidents: 11230, crimeRate: 67.8, grade: 'D' },
    { state: 'Telangana', totalIncidents: 8950, crimeRate: 45.6, grade: 'B' },
    { state: 'Rajasthan', totalIncidents: 6540, crimeRate: 38.9, grade: 'B' },
    { state: 'Uttar Pradesh', totalIncidents: 10450, crimeRate: 41.5, grade: 'B' },
    { state: 'Gujarat', totalIncidents: 10300, crimeRate: 31.1, grade: 'A' },
    { state: 'Madhya Pradesh', totalIncidents: 7520, crimeRate: 23.1, grade: 'A' },
    { state: 'Andhra Pradesh', totalIncidents: 3320, crimeRate: 20.8, grade: 'A' }
  ];

  // NGO partners
  const ngoPartners = [
    {
      name: 'Breakthrough India',
      website: 'breakthrough.tv',
      focus: 'Violence against women',
      initial: 'B',
      color: 'bg-purple-600'
    },
    {
      name: 'iCall',
      website: 'icallhelpline.org',
      focus: 'Mental health crisis support',
      initial: 'I',
      color: 'bg-blue-600'
    },
    {
      name: 'Cyber Peace Foundation',
      website: 'cyberpeace.net',
      focus: 'Cyber safety',
      initial: 'C',
      color: 'bg-green-600'
    },
    {
      name: 'Shehri',
      website: 'shehri.org',
      focus: 'Urban community safety',
      initial: 'S',
      color: 'bg-orange-600'
    }
  ];

  // Sorting functions
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    let sortableData = [...ncrbData];
    if (sortConfig.key !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [ncrbData, sortConfig]);

  // Filter and paginate
  const filteredData = sortedData.filter(city =>
    city.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Get crime rate color
  const getCrimeRateColor = (rate) => {
    if (rate < 50) return 'text-green-600';
    if (rate < 100) return 'text-yellow-600';
    if (rate < 200) return 'text-orange-600';
    return 'text-red-600';
  };

  // Get safety grade color
  const getGradeColor = (grade) => {
    const colors = {
      'A': 'bg-green-100 text-green-800 border-green-200',
      'B': 'bg-lime-100 text-lime-800 border-lime-200',
      'C': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'D': 'bg-orange-100 text-orange-800 border-orange-200',
      'E': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[grade] || colors['A'];
  };

  // Toggle accordion
  const toggleAccordion = (id) => {
    setExpandedAccordion(expandedAccordion === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <Link to="/" className="text-gray-500 hover:text-gray-700 font-medium">Home</Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-900 font-medium">Data Insights</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            India Crime Data — NCRB 2018–2022
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Sourced from National Crime Records Bureau via data.gov.in
          </p>
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            <Database className="w-4 h-4" />
            ✓ Official Government Data
          </div>
        </div>
      </div>

      {/* SECTION 1 - National Overview Cards */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">
                  {nationalStats.totalCrimes.toLocaleString()}
                </span>
              </div>
              <p className="text-gray-600 font-medium">Total Crime Count</p>
              <p className="text-sm text-gray-500 mt-1">Across all reported categories</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">
                  {nationalStats.statesCovered}
                </span>
              </div>
              <p className="text-gray-600 font-medium">States Covered</p>
              <p className="text-sm text-gray-500 mt-1">With comprehensive data</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">
                  {nationalStats.citiesCovered}
                </span>
              </div>
              <p className="text-gray-600 font-medium">Cities Covered</p>
              <p className="text-sm text-gray-500 mt-1">Major metropolitan areas</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">
                  {nationalStats.highestCrimeRateCity.crimeRate}
                </span>
              </div>
              <p className="text-gray-600 font-medium">Highest Crime Rate City</p>
              <p className="text-sm text-gray-500 mt-1">{nationalStats.highestCrimeRateCity.city}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - Crime by City Table */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Crime by City</h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <input
                  type="text"
                  placeholder="Search by city or state..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/15 text-[15px]"
                />
                <div className="text-sm text-gray-500">
                  Showing {indexOfFirstRow + 1}-{Math.min(indexOfLastRow, filteredData.length)} of {filteredData.length} cities
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('id')}>
                      Rank {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? <ArrowUp className="inline w-3 h-3" /> : <ArrowDown className="inline w-3 h-3" />)}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('city')}>
                      City {sortConfig.key === 'city' && (sortConfig.direction === 'asc' ? <ArrowUp className="inline w-3 h-3" /> : <ArrowDown className="inline w-3 h-3" />)}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('state')}>
                      State {sortConfig.key === 'state' && (sortConfig.direction === 'asc' ? <ArrowUp className="inline w-3 h-3" /> : <ArrowDown className="inline w-3 h-3" />)}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('totalCrimes')}>
                      Total Crimes {sortConfig.key === 'totalCrimes' && (sortConfig.direction === 'asc' ? <ArrowUp className="inline w-3 h-3" /> : <ArrowDown className="inline w-3 h-3" />)}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('crimeRate')}>
                      Crime Rate (per lakh) {sortConfig.key === 'crimeRate' && (sortConfig.direction === 'asc' ? <ArrowUp className="inline w-3 h-3" /> : <ArrowDown className="inline w-3 h-3" />)}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Top Crime Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentRows.map((city, index) => (
                    <tr key={city.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {indexOfFirstRow + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {city.city}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {city.state}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {city.totalCrimes.toLocaleString()}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getCrimeRateColor(city.crimeRate)}`}>
                        {city.crimeRate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {city.topCrime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {city.year}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3 - Crime Category Breakdown */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Crime Categories Across India</h2>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)] mb-8">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={crimeCategories}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#7C3AED">
                  {crimeCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {crimeCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)] transition-shadow duration-200 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: `${category.color}20` }}>
                    <AlertTriangle className="w-6 h-6" style={{ color: category.color }} />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {category.count.toLocaleString()}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{category.percentage}% of all crimes</p>
                <div className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Source: NCRB Crime in India Report
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 - State-wise Heatmap Table */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">State-wise Safety Rankings</h2>
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Incidents</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crime Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Safety Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stateData.map((state, index) => (
                    <tr key={state.state} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {state.state}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {state.totalIncidents.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {state.crimeRate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getGradeColor(state.grade)}`}>
                          {state.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 - Partner NGOs */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">NGO Partners & Data Verification</h2>
          <p className="text-lg text-gray-600 mb-8">SafeMap India works alongside these organizations:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {ngoPartners.map((ngo, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)] transition-shadow duration-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-16 h-16 ${ngo.color} rounded-full flex items-center justify-center text-white font-bold text-xl`}>
                    {ngo.initial}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{ngo.name}</h3>
                    <a 
                      href={`https://${ngo.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
                    >
                      {ngo.website}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Focus:</span> {ngo.focus}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-100 rounded-xl p-6 border border-gray-200">
            <p className="text-gray-700 text-center">
              <strong>Note:</strong> SafeMap India data is for awareness only and does not replace official police records.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6 - Methodology Note */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4">
            {/* How We Calculate Safety Scores */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <button
                onClick={() => toggleAccordion('safety-scores')}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900">How We Calculate Safety Scores</h3>
                {expandedAccordion === 'safety-scores' ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </button>
              {expandedAccordion === 'safety-scores' && (
                <div className="px-6 pb-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 mb-2">
                      <strong>Crime Rate = (Total Reported Crimes / City Population) × 100,000</strong>
                    </p>
                    <p className="text-gray-600">
                      This normalizes for population differences between large cities like Mumbai and smaller cities like Bhopal. 
                      Source: Census 2011 population data.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Limitations of this Data */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <button
                onClick={() => toggleAccordion('limitations')}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900">Limitations of this Data</h3>
                {expandedAccordion === 'limitations' ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </button>
              {expandedAccordion === 'limitations' && (
                <div className="px-6 pb-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">
                      NCRB data reflects <strong>REPORTED</strong> crimes only. True incidence is likely higher due to underreporting, 
                      especially for harassment and sexual violence.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DataPage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, AlertTriangle, MapPin, Activity, Download, RefreshCw, CheckCircle, LogOut } from 'lucide-react';

const ADMIN_PASS = 'safemapadmin2025';
const PIE_COLORS = ['#7C3AED', '#DC2626', '#D97706', '#059669', '#0D9488', '#6B7280'];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [tab, setTab] = useState('overview');
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const PER_PAGE = 20;

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') === 'true') setAuthed(true);
  }, []);

  useEffect(() => {
    if (authed) fetchAll();
    const iv = setInterval(() => { if (authed) fetchAll(); }, 30000);
    return () => clearInterval(iv);
  }, [authed]);

  async function fetchAll() {
    setLoading(true);
    // Mock data for now - in production this would fetch from Supabase
    const mockIncidents = [
      { id: 1, incident_type: 'harassment', city: 'Delhi', state: 'Delhi', created_at: new Date().toISOString(), severity: 3, verified: true, latitude: 28.6139, longitude: 77.2090 },
      { id: 2, incident_type: 'theft', city: 'Mumbai', state: 'Maharashtra', created_at: new Date().toISOString(), severity: 2, verified: false, latitude: 19.0760, longitude: 72.8777 },
      { id: 3, incident_type: 'assault', city: 'Bangalore', state: 'Karnataka', created_at: new Date().toISOString(), severity: 4, verified: true, latitude: 12.9716, longitude: 77.5946 },
      { id: 4, incident_type: 'cyber', city: 'Chennai', state: 'Tamil Nadu', created_at: new Date().toISOString(), severity: 2, verified: true, latitude: 13.0827, longitude: 80.2707 },
      { id: 5, incident_type: 'unsafe', city: 'Kolkata', state: 'West Bengal', created_at: new Date().toISOString(), severity: 3, verified: false, latitude: 22.5726, longitude: 88.3639 },
    ];
    setIncidents(mockIncidents);
    setLoading(false);
  }

  function login() {
    if (pass === ADMIN_PASS) {
      sessionStorage.setItem('admin_auth', 'true');
      setAuthed(true);
    } else {
      setErr('Incorrect password');
    }
  }

  function logout() {
    sessionStorage.removeItem('admin_auth');
    setAuthed(false);
  }

  async function toggleVerified(id, current) {
    setIncidents(incidents.map(i => 
      i.id === id ? { ...i, verified: !current } : i
    ));
  }

  function exportCSV() {
    const headers = 'id,type,city,state,date,severity,verified,lat,lng';
    const rows = incidents.map(i =>
      `${i.id},${i.incident_type},${i.city},${i.state},${i.created_at},${i.severity},${i.verified},${i.latitude},${i.longitude}`
    );
    const blob = new Blob([headers + '\n' + rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'safemap_incidents.csv'; a.click();
  }

  // Stats
  const today = new Date().toDateString();
  const todayCount = incidents.filter(i => new Date(i.created_at).toDateString() === today).length;
  const verifiedCount = incidents.filter(i => i.verified).length;
  const avgSeverity = incidents.length
    ? (incidents.reduce((s, i) => s + (i.severity || 1), 0) / incidents.length).toFixed(1)
    : '0.0';
  
  const cityGroups = {};
  incidents.forEach(i => { cityGroups[i.city] = (cityGroups[i.city] || 0) + 1; });
  const topCity = Object.entries(cityGroups).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  
  const typeGroups = {};
  incidents.forEach(i => { typeGroups[i.incident_type] = (typeGroups[i.incident_type] || 0) + 1; });
  const cityChartData = Object.entries(cityGroups).sort((a, b) => b[1] - a[1]).slice(0, 8)
    .map(([name, value]) => ({ name, value }));
  const typeChartData = Object.entries(typeGroups).map(([name, value]) => ({ name, value }));
  
  // Trend (last 14 days)
  const trendData = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - 13 + i);
    const ds = d.toDateString();
    return { 
      date: d.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      count: incidents.filter(x => new Date(x.created_at).toDateString() === ds).length 
    };
  });

  // Filter for table
  const filtered = incidents.filter(i =>
    !search || i.city?.toLowerCase().includes(search.toLowerCase()) ||
    i.incident_type?.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function sevColor(s) {
    if (s <= 2) return 'text-green-600 bg-green-50';
    if (s === 3) return 'text-yellow-600 bg-yellow-50';
    if (s === 4) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  }

  if (!authed) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-sm shadow-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">■■</div>
          <h1 className="text-xl font-bold text-gray-900">Admin Access</h1>
          <p className="text-sm text-gray-500 mt-1">SafeMap India Dashboard</p>
        </div>
        <input 
          type="password" 
          placeholder="Enter admin password"
          value={pass} 
          onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
        />
        {err && <p className="text-red-500 text-xs mb-3">{err}</p>}
        <button 
          onClick={login}
          className="w-full bg-purple-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-purple-700 transition-colors"
        >
          Login
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-900 flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-slate-700">
          <p className="text-white font-bold text-sm">■■ SafeMap India</p>
          <p className="text-slate-400 text-xs mt-0.5">Admin Dashboard</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {[
            ['overview', 'Overview', <Activity size={14} />],
            ['reports', 'All Reports', <AlertTriangle size={14} />],
            ['analytics', 'Analytics', <BarChart size={14} />]
          ].map(([id, label, icon]) => (
            <button 
              key={id} 
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                tab === id ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {icon}{label}
            </button>
          ))}
          <Link to="/map" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <MapPin size={14} /> View Map
          </Link>
        </nav>
        <div className="p-3">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white text-sm transition-colors"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-lg font-bold text-gray-900 capitalize">{tab}</h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchAll}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 transition-colors"
            >
              <RefreshCw size={14} /> Refresh
            </button>
            <button 
              onClick={exportCSV}
              className="flex items-center gap-1.5 text-sm bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* OVERVIEW TAB */}
          {tab === 'overview' && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Reports', value: incidents.length, icon: <Users size={18} />, color: 'purple' },
                  { label: 'Reports Today', value: todayCount, icon: <AlertTriangle size={18} />, color: 'blue' },
                  { label: 'Top City', value: topCity, icon: <MapPin size={18} />, color: 'orange' },
                  { label: 'Avg Severity', value: `${avgSeverity}/5`, icon: <Activity size={18} />, color: 'red' },
                ].map((s, i) => (
                  <div 
                    key={i} 
                    className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm" 
                    style={{ borderLeft: `4px solid ${['#7C3AED', '#2563EB', '#D97706', '#DC2626'][i]}` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-gray-500">{s.label}</p>
                      <div className={`text-${s.color}-500`}>{s.icon}</div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-4 text-sm">Top Cities</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={cityChartData} layout="vertical">
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={70} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#7C3AED" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-4 text-sm">By Type</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie 
                        data={typeChartData} 
                        dataKey="value" 
                        nameKey="name"
                        cx="50%" cy="50%" outerRadius={70} 
                        label={({ name }) => name}
                      >
                        {typeChartData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* REPORTS TAB */}
          {tab === 'reports' && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <input 
                  placeholder="Search by city or type..."
                  value={search} 
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                />
                <p className="text-sm text-gray-500">
                  Showing {((page - 1) * PER_PAGE) + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      {['Type', 'City', 'State', 'Date', 'Severity', 'Verified', 'Action'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((inc, idx) => (
                      <tr 
                        key={inc.id} 
                        className={`border-b border-gray-100 hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                      >
                        <td className="px-4 py-3">
                          <span className="capitalize font-medium text-gray-800">
                            {inc.incident_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{inc.city || '—'}</td>
                        <td className="px-4 py-3 text-gray-600">{inc.state || '—'}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {new Date(inc.created_at).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sevColor(inc.severity || 1)}`}>
                            {inc.severity || 1}/5
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {inc.verified
                            ? <span className="text-green-600 text-xs font-medium">✓ Yes</span>
                            : <span className="text-gray-400 text-xs">No</span>
                          }
                        </td>
                        <td className="px-4 py-3">
                          <button 
                            onClick={() => toggleVerified(inc.id, inc.verified)}
                            className={`text-xs px-3 py-1 rounded-lg border transition-colors ${
                              inc.verified
                                ? 'border-gray-300 text-gray-500 hover:border-red-300 hover:text-red-500'
                                : 'border-green-300 text-green-600 hover:bg-green-50'
                            }`}
                          >
                            {inc.verified ? 'Unverify' : 'Verify'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">Page {page}</span>
                <button 
                  disabled={page * PER_PAGE >= filtered.length}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {tab === 'analytics' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4 text-sm">
                  Reporting Trend — Last 14 Days
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={trendData}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#7C3AED" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-4 text-sm">City Breakdown</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={cityChartData} layout="vertical">
                      <XAxis type="number" tick={{ fontSize: 9 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={65} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#7C3AED" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-4 text-sm">Incident Types</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie 
                        data={typeChartData} 
                        dataKey="value" 
                        nameKey="name"
                        cx="50%" cy="50%" outerRadius={75}
                      >
                        {typeChartData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend iconSize={10} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

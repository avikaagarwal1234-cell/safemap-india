import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, MapPin, Shield, Phone, AlertTriangle } from 'lucide-react';

const HomePage = () => {
  const [stats, setStats] = useState({
    totalReports: 0,
    verifiedReports: 0,
    citiesCovered: 18,
    ncrbYears: '2018–2022'
  });
  const [loading, setLoading] = useState(true);

  // Fetch stats from Supabase
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real implementation, you would fetch from Supabase here
        // For now, using mock data as requested
        setTimeout(() => {
          setStats({
            totalReports: 127,
            verifiedReports: 89,
            citiesCovered: 18,
            ncrbYears: '2018–2022'
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const incidentCategories = [
    { name: 'Harassment', emoji: '🚨', color: 'red' },
    { name: 'Stalking', emoji: '👁️', color: 'orange' },
    { name: 'Assault', emoji: '🤜', color: 'rose' },
    { name: 'Cyber', emoji: '📱', color: 'blue' },
    { name: 'Unsafe Area', emoji: '🚫', color: 'yellow' },
    { name: 'Theft', emoji: '📦', color: 'amber' }
  ];

  const getCategoryStyles = (color) => {
    const styles = {
      red: 'bg-red-50 text-red-600 border-red-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
      rose: 'bg-rose-50 text-rose-700 border-rose-200',
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      amber: 'bg-amber-50 text-amber-700 border-amber-200'
    };
    return styles[color] || styles.red;
  };

  return (
    <div className="min-h-screen">
      {/* SECTION 1: HERO */}
      <section className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#0F172A' }}>
        <div className="text-center max-w-4xl mx-auto">
          {/* Trust Badge */}
          <div className="inline-block mb-6">
            <span 
              className="inline-block px-4 py-1 text-sm rounded-full"
              style={{
                border: '1px solid rgba(124,58,237,0.5)',
                backgroundColor: 'rgba(124,58,237,0.1)',
                color: '#7C3AED'
              }}
            >
              ■■ Trusted by NCRB Data — India's Official Crime Bureau
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-4">
            Know Before You Go.
          </h1>

          {/* Subheadline */}
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 text-center">
            India's first anonymous, real-time safety map — powered by community reports and NCRB crime data.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link 
              to="/map"
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              View Safety Map →
            </Link>
            <Link 
              to="/report"
              className="border border-red-500 text-red-400 px-8 py-3 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-colors"
            >
              Report Incident
            </Link>
          </div>

          {/* Trust Badges Row */}
          <div className="flex flex-wrap gap-6 justify-center">
            <span className="text-gray-500 text-sm flex items-center gap-1">
              ■ 100% Anonymous
            </span>
            <span className="text-gray-500 text-sm flex items-center gap-1">
              ■ NCRB Data
            </span>
            <span className="text-gray-500 text-sm flex items-center gap-1">
              ■ Real-time
            </span>
            <span className="text-gray-500 text-sm flex items-center gap-1">
              ■■ Free Maps
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2: LIVE STATS BAR */}
      <section style={{ backgroundColor: '#1E293B' }} className="py-8 border-y border-slate-700">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">
              {loading ? '...' : stats.totalReports.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total Reports</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">
              {stats.citiesCovered}
            </div>
            <div className="text-sm text-gray-400">Cities Covered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">
              {stats.ncrbYears}
            </div>
            <div className="text-sm text-gray-400">NCRB Data Years</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">
              {loading ? '...' : stats.verifiedReports.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Verified Reports</div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section className="py-20 px-6" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            How SafeMap India Works
          </h2>
          <p className="text-gray-500 text-center mb-12">
            Three simple steps to make communities safer
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 overflow-hidden">
              <div className="h-1 bg-purple-500 rounded-t-xl mb-6"></div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <ClipboardList className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-xs font-bold text-purple-400 tracking-widest mb-1">01</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Report Anonymously</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                No name, no phone, no email. Fill a 4-step form and geo-tag your incident — completely anonymous.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 overflow-hidden">
              <div className="h-1 bg-teal-500 rounded-t-xl mb-6"></div>
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-teal-600" />
              </div>
              <div className="text-xs font-bold text-teal-400 tracking-widest mb-1">02</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Pinned to the Map</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Your report appears on India's live safety heatmap within seconds, warning others in real time.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 overflow-hidden">
              <div className="h-1 bg-red-500 rounded-t-xl mb-6"></div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-xs font-bold text-red-400 tracking-widest mb-1">03</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Community Protection</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                The more reports, the more accurate the map. NGOs use this data to target awareness campaigns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: INCIDENT CATEGORIES SHOWCASE */}
      <section className="py-16 px-6" style={{ backgroundColor: '#F8F7FF' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            What Gets Reported
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {incidentCategories.map((category, index) => (
              <div 
                key={index}
                className={`bg-white border rounded-xl p-4 text-center shadow-sm ${getCategoryStyles(category.color)}`}
              >
                <div className="text-3xl mb-2">{category.emoji}</div>
                <div className="font-semibold text-sm">{category.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: EMERGENCY STRIP */}
      <section className="py-10 px-6" style={{ backgroundColor: '#7F1D1D' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-white text-xl font-bold text-center mb-6">
            ■ In an Emergency — Call Immediately
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a 
              href="tel:112"
              className="bg-red-800 rounded-xl p-5 text-center cursor-pointer hover:bg-red-700 transition-colors"
            >
              <div className="text-3xl font-bold text-white">112</div>
              <div className="text-red-300 text-sm mt-1">Emergency</div>
            </a>

            <a 
              href="tel:1091"
              className="bg-red-800 rounded-xl p-5 text-center cursor-pointer hover:bg-red-700 transition-colors"
            >
              <div className="text-3xl font-bold text-white">1091</div>
              <div className="text-red-300 text-sm mt-1">Women Helpline</div>
            </a>

            <a 
              href="tel:100"
              className="bg-red-800 rounded-xl p-5 text-center cursor-pointer hover:bg-red-700 transition-colors"
            >
              <div className="text-3xl font-bold text-white">100</div>
              <div className="text-red-300 text-sm mt-1">Police</div>
            </a>

            <a 
              href="tel:1930"
              className="bg-red-800 rounded-xl p-5 text-center cursor-pointer hover:bg-red-700 transition-colors"
            >
              <div className="text-3xl font-bold text-white">1930</div>
              <div className="text-red-300 text-sm mt-1">Cyber Crime</div>
            </a>
          </div>

          <div className="text-red-300 text-xs text-center mt-6">
            SafeMap India does not replace emergency services. Always call 112 in life-threatening situations.
          </div>
        </div>
      </section>

      {/* SECTION 6: FOOTER */}
      <footer className="py-10 px-6" style={{ backgroundColor: '#0F172A' }}>
        <div className="border-t border-slate-800 pt-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <div className="font-bold text-white mb-1">■■ SafeMap India</div>
                <div className="text-gray-500">Making every street safer.</div>
              </div>
              
              <div className="flex gap-6 text-center">
                <Link to="/map" className="text-gray-400 hover:text-white transition-colors">Map</Link>
                <Link to="/report" className="text-gray-400 hover:text-white transition-colors">Report</Link>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
                <Link to="/admin" className="text-gray-400 hover:text-white transition-colors">Admin</Link>
              </div>
            </div>

            <div className="text-gray-600 text-xs text-center mt-6">
              Data: NCRB / data.gov.in · Maps: OpenStreetMap · DB: Supabase · Host: Vercel
            </div>
            
            <div className="text-gray-600 text-xs text-center mt-1">
              Built by Aditi Garg, Yashi Goyal & Avika Agarwal · Elite Her Hackathon
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

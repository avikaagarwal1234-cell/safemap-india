import React from 'react';
import { 
  Shield, 
  Users, 
  MapPin, 
  ClipboardList, 
  Phone, 
  AlertTriangle,
  Database,
  Eye,
  EyeOff,
  Award,
  Clock,
  Target,
  ArrowRight
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* SECTION 1 - HERO */}
      <section className="bg-navy-dark py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            About SafeMap India
          </h1>
          <p className="text-xl sm:text-2xl text-purple-light mb-12 max-w-3xl mx-auto">
            Empowering communities through anonymous, data-driven safety awareness
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center space-x-2 px-4 py-2 border border-white/30 rounded-full">
              <Database className="w-4 h-4 text-purple-light" />
              <span className="text-white text-sm font-medium">NCRB Official Data</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 border border-white/30 rounded-full">
              <EyeOff className="w-4 h-4 text-purple-light" />
              <span className="text-white text-sm font-medium">100% Anonymous</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 border border-white/30 rounded-full">
              <Shield className="w-4 h-4 text-purple-light" />
              <span className="text-white text-sm font-medium">Open Source</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 border border-white/30 rounded-full">
              <Award className="w-4 h-4 text-purple-light" />
              <span className="text-white text-sm font-medium">Elite Her Hackathon</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - MISSION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Our Mission</h2>
              
              <div className="space-y-6 text-gray-700">
                <p className="text-lg leading-relaxed">
                  Every day, thousands of harassment and safety incidents happen across India — 
                  most go unreported because victims fear judgment, lack trust in authorities, 
                  or simply don't know how to report anonymously.
                </p>
                
                <p className="text-lg leading-relaxed">
                  SafeMap India bridges this gap by providing a zero-identity reporting 
                  platform where anyone can flag an unsafe area, report an incident, or warn the 
                  community — without sharing their name, phone number, or any personal data.
                </p>
                
                <p className="text-lg leading-relaxed">
                  Combined with verified historical crime data from the National Crime Records 
                  Bureau (NCRB), SafeMap India gives a complete picture of safety across India's cities.
                </p>
              </div>
            </div>
            
            {/* Right Column - Impact Numbers */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-8 text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-8 text-center">Impact Numbers</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">50+</div>
                  <div className="text-purple-200 text-sm">Incidents Tracked</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">18</div>
                  <div className="text-purple-200 text-sm">Cities</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">5</div>
                  <div className="text-purple-200 text-sm">Years NCRB Data</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">0</div>
                  <div className="text-purple-200 text-sm">Personal Data Collected</div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <div className="inline-flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Privacy First, Always</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - HOW IT WORKS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F5F3FF' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Three Steps to Safer Communities</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-purple-200 relative">
                {/* Number Badge */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  01
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                    <ClipboardList className="w-8 h-8 text-purple-600" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Report Anonymously</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Fill a 4-step form. No name, no phone, no email required.
                    Your location is geo-tagged for accuracy.
                  </p>
                </div>
              </div>
              
              {/* Arrow */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <ArrowRight className="w-8 h-8 text-purple-400" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-purple-200 relative">
                {/* Number Badge */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  02
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                    <MapPin className="w-8 h-8 text-purple-600" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Pinned to the Map</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Your report appears on India's live safety heatmap within seconds,
                    helping others in that area stay informed.
                  </p>
                </div>
              </div>
              
              {/* Arrow */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <ArrowRight className="w-8 h-8 text-purple-400" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-purple-200 relative">
                {/* Number Badge */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  03
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                    <Shield className="w-8 h-8 text-purple-600" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Community Protection</h3>
                  <p className="text-gray-600 leading-relaxed">
                    The more people report, the more accurate the map. NGOs and safety
                    organizations use this data to target awareness campaigns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - PRIVACY COMMITMENT */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-navy-dark">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Zero Personal Data. Always.</h2>
          <p className="text-xl text-purple-light mb-12">This is not a promise. It is a technical reality.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* What we DON'T collect */}
                {[
                  { icon: EyeOff, text: 'Name or identity' },
                  { icon: Phone, text: 'Phone number' },
                  { icon: EyeOff, text: 'Email address' },
                  { icon: EyeOff, text: 'IP address' },
                  { icon: EyeOff, text: 'Device fingerprint' },
                  { icon: EyeOff, text: 'Cookies or trackers' },
                  { icon: EyeOff, text: 'Location history' },
                  { icon: EyeOff, text: 'Browser info' }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="bg-navy-medium border border-purple-500/30 rounded-lg p-6">
                      <Icon className="w-8 h-8 text-red-500 mx-auto mb-3" />
                      <p className="text-white font-medium">{item.text}</p>
                    </div>
                  );
                })}
              </div>
              
              <div className="bg-purple-600/20 border border-purple-500/30 rounded-xl p-6 max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-purple-light mb-3">What we DO store:</h3>
                <p className="text-white">
                  Incident type, date/time, GPS coordinates, severity rating.
                  Nothing that can identify you.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 5 - DATA SOURCES */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">Our Data Sources</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* NCRB Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                      <Database className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">National Crime Records Bureau (NCRB)</h3>
                      <p className="text-gray-600">Official Government Data</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Years:</span>
                      <span className="font-medium text-gray-900">2018–2022</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coverage:</span>
                      <span className="font-medium text-gray-900">State-wise, city-wise crime statistics</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Categories:</span>
                      <span className="font-medium text-gray-900">Crimes against women, theft, assault, cyber crime</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Source:</span>
                      <a href="https://data.gov.in" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 font-medium">
                        data.gov.in →
                      </a>
                    </div>
                  </div>
                </div>

                {/* Community Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Community Reports</h3>
                      <p className="text-gray-600">Real-time User Data</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Privacy:</span>
                      <span className="font-medium text-gray-900">100% Anonymous</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timing:</span>
                      <span className="font-medium text-gray-900">Real-time</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium text-gray-900">Geo-tagged with GPS coordinates</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Verification:</span>
                      <span className="font-medium text-gray-900">Admin moderated</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6 - TEAM */}
          <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">Built by Team SafeMap</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {[
                  { name: 'Aditi Garg', role: 'Full Stack Developer', initial: 'A' },
                  { name: 'Yashi Goyal', role: 'Full Stack Developer', initial: 'Y' },
                  { name: 'Avika Agarwal', role: 'Full Stack Developer', initial: 'A' }
                ].map((member, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                    <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-2xl font-bold text-white">{member.initial}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-gray-600">{member.role}</p>
                    <div className="mt-4">
                      <span className="inline-flex items-center space-x-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                        <Award className="w-3 h-3" />
                        <span>Elite Her Hackathon</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 text-lg">Built in 48 hours for Elite Her Hackathon</p>
              </div>
            </div>
          </section>

          {/* SECTION 7 - EMERGENCY RESOURCES */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-red-600">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
                ■ Emergency? Call Immediately
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                  { number: '112', label: 'Emergency', icon: AlertTriangle },
                  { number: '1091', label: 'Women Helpline', icon: Phone },
                  { number: '100', label: 'Police', icon: Phone },
                  { number: '1930', label: 'Cyber Crime', icon: AlertTriangle }
                ].map((contact, index) => {
                  const Icon = contact.icon;
                  return (
                    <a
                      key={index}
                      href={`tel:${contact.number}`}
                      className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-shadow group"
                    >
                      <Icon className="w-12 h-12 text-red-600 mx-auto mb-4" />
                      <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                        {contact.number}
                      </div>
                      <div className="text-gray-600 font-medium">{contact.label}</div>
                    </a>
                  );
                })}
              </div>
              
              <div className="text-center">
                <div className="bg-red-700 rounded-xl p-6 max-w-2xl mx-auto">
                  <p className="text-white text-lg">
                    <strong>Disclaimer:</strong> SafeMap India does not replace emergency services.
                    Always call 112 in life-threatening situations.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      );
    };

    export default AboutPage;

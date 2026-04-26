import React from 'react';
import { Shield, MapPin, Users, Lock, Database, Phone, AlertTriangle, FileText, ExternalLink } from 'lucide-react';

function AboutPage() {
  return (
    <div className="min-h-screen bg-navy-dark text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About SafeMap India
            </h1>
            <p className="text-xl md:text-2xl text-purple-light mb-8 max-w-3xl mx-auto">
              Empowering women's safety through data-driven insights and community-powered reporting
            </p>
            <div className="flex items-center justify-center space-x-2 text-lg text-gray-300">
              <Shield className="w-6 h-6 text-purple-light" />
              <span>Trusted by data from NCRB — India's Official Crime Bureau</span>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-gray-300 text-lg">Three simple steps to make our communities safer</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div className="bg-purple-primary/20 border border-purple-light/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-light mb-3">Step 1</h3>
              <p className="text-white">
                Something happened? Report it anonymously in 60 seconds
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div className="bg-purple-primary/20 border border-purple-light/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-light mb-3">Step 2</h3>
              <p className="text-white">
                Your report is geo-tagged and added to the safety map
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="bg-purple-primary/20 border border-purple-light/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-light mb-3">Step 3</h3>
              <p className="text-white">
                The community sees safer and more dangerous zones on the map
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy & Anonymity Section */}
      <div className="bg-purple-primary/10">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Lock className="w-16 h-16 text-purple-light mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Privacy & Anonymity</h2>
            <p className="text-2xl font-bold text-purple-light mb-8">
              We collect ZERO personal information
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-red-600/20 border border-red-500/50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-red-400 mb-6">What we do NOT collect:</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <span className="text-red-400">✗</span>
                  <span className="text-gray-300">No name, phone, email</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-red-400">✗</span>
                  <span className="text-gray-300">No IP address</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-red-400">✗</span>
                  <span className="text-gray-300">No device fingerprint</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-red-400">✗</span>
                  <span className="text-gray-300">No cookies or tracking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Data Sources Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Database className="w-16 h-16 text-purple-light mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Data Sources</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-purple-primary/20 border border-purple-light/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-purple-light mb-3">
              NCRB (National Crime Records Bureau)
            </h3>
            <p className="text-gray-300 mb-4">
              Official crime statistics from India's national crime database
            </p>
            <a 
              href="https://data.gov.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-purple-light hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Visit data.gov.in
            </a>
          </div>

          <div className="bg-purple-primary/20 border border-purple-light/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-purple-light mb-3">
              Community-submitted reports
            </h3>
            <p className="text-gray-300">
              Anonymous reports from users like you, helping create real-time safety insights
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-yellow-600/20 border border-yellow-500/50 rounded-lg p-6 max-w-2xl mx-auto">
            <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <p className="text-yellow-300 font-semibold">
              This app does not replace calling 112. In emergencies, always call 112.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Resources Section */}
      <div className="bg-red-600/10">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Phone className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Emergency Resources</h2>
            <p className="text-gray-300 text-lg">Save these numbers - they could save a life</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-red-600/20 border border-red-500/50 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Emergency</h3>
              <p className="text-4xl font-bold text-red-400">112</p>
              <p className="text-gray-300 mt-2">For all emergencies</p>
            </div>

            <div className="bg-purple-primary/20 border border-purple-light/30 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-purple-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Women Helpline</h3>
              <p className="text-4xl font-bold text-purple-light">1091</p>
              <p className="text-gray-300 mt-2">24/7 women's safety support</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm">
              Remember: These services are always available. Don't hesitate to reach out.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;

import React from 'react';
import ReportForm from '../components/Report/ReportForm';

function ReportPage() {
  return (
    <div className="min-h-screen bg-navy-dark text-white">
      {/* Trust Banner */}
      <div className="bg-purple-primary/20 border-b border-purple-light/30">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-purple-light mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <h2 className="text-xl font-semibold text-purple-light">Your Identity is 100% Anonymous</h2>
              </div>
              <p className="text-gray-300 max-w-2xl mx-auto">
                We do not collect your name, phone number, IP address, or any identifying information. 
                Your report is completely confidential and will help make our community safer.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 text-white">Report an Incident</h1>
          <p className="text-gray-300 text-lg">
            Your voice matters. Help us create a safer environment for everyone.
          </p>
        </div>

        {/* Report Form */}
        <ReportForm />
      </div>
    </div>
  );
}

export default ReportPage;

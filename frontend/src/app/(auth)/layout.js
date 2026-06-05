export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Left Side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {children}
        </div>
      </div>

      {/* Right Side - Fixed Content */}
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-md text-center text-white px-8">
          {/* <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 7a1 1 0 000 2h.5a.5.5 0 01.5.5v.5a.5.5 0 01-.5.5H3a1 1 0 000 2h.5a.5.5 0 01.5.5v.5a.5.5 0 01-.5.5H3a1 1 0 100 2h.5a1.5 1.5 0 011.5 1.5v.5a1.5 1.5 0 01-1.5 1.5H3a1 1 0 100 2h.5a2.5 2.5 0 002.5-2.5v-.5a2.5 2.5 0 012.5-2.5h5a2.5 2.5 0 012.5 2.5v.5a2.5 2.5 0 002.5 2.5h.5a1 1 0 100-2h-.5a1.5 1.5 0 01-1.5-1.5v-.5a1.5 1.5 0 00-1.5-1.5h-5a1.5 1.5 0 00-1.5 1.5v.5a1.5 1.5 0 01-1.5 1.5H3a1 1 0 01-1-1v-2a1 1 0 011-1h.5a1.5 1.5 0 001.5-1.5v-.5A1.5 1.5 0 013.5 9H3a1 1 0 01-1-1V7a1 1 0 011-1h.5a1.5 1.5 0 001.5-1.5v-.5A1.5 1.5 0 015.5 2h9a1.5 1.5 0 011.5 1.5v.5A1.5 1.5 0 0117.5 6h.5a1 1 0 110 2h-.5a1.5 1.5 0 00-1.5 1.5v.5a1.5 1.5 0 01-1.5 1.5h-5a1.5 1.5 0 01-1.5-1.5v-.5A1.5 1.5 0 007.5 8h-2A1.5 1.5 0 014 6.5V6a1.5 1.5 0 00-1.5-1.5H3a1 1 0 010-2h.5A2.5 2.5 0 016 4.5V5a2.5 2.5 0 002.5 2.5h2A2.5 2.5 0 0013 5v-.5a2.5 2.5 0 012.5-2.5h.5a1 1 0 100-2h-.5A2.5 2.5 0 0013 1.5V1a2.5 2.5 0 00-2.5-2.5h-5A2.5 2.5 0 003 1v.5A2.5 2.5 0 00.5 4H0a1 1 0 000 2h.5A2.5 2.5 0 013 3.5V4a2.5 2.5 0 002.5 2.5h2A2.5 2.5 0 0010 4v.5a2.5 2.5 0 002.5 2.5h.5a1 1 0 110 2h-.5a2.5 2.5 0 01-2.5-2.5V5a2.5 2.5 0 00-2.5-2.5h-2A2.5 2.5 0 003 5v.5A2.5 2.5 0 00.5 8H0a1 1 0 000 2h.5A2.5 2.5 0 003 7.5V8a2.5 2.5 0 002.5 2.5h2a2.5 2.5 0 012.5 2.5v.5a2.5 2.5 0 002.5 2.5h5a2.5 2.5 0 002.5-2.5v-.5a2.5 2.5 0 012.5-2.5h.5a1 1 0 100-2h-.5a2.5 2.5 0 01-2.5 2.5H15a2.5 2.5 0 01-2.5-2.5v-.5a2.5 2.5 0 00-2.5-2.5h-5a2.5 2.5 0 00-2.5 2.5v.5A2.5 2.5 0 015.5 13h-2A2.5 2.5 0 011 10.5V10a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div> */}
          <h2 className="text-3xl font-bold mb-6">Clinic Management Pro</h2>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            Experience seamless clinic management with our advanced platform. 
            Manage appointments, patient records, and medical workflows efficiently.
          </p>
          <div className="space-y-4 text-left">
            {[
              "Real-time appointment scheduling",
              "Secure patient data management",
              "Automated reminders & notifications",
              "Multi-device accessibility"
            ].map((feature, index) => (
              <div key={index} className="flex items-center text-blue-100">
                <svg className="w-5 h-5 mr-3 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
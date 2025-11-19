"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { forgotPassword } from '@/services/authServices';
import { Mail, ArrowLeft, Key } from 'lucide-react';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await forgotPassword(email);
      toast.success(response.message || "OTP sent to your email!");
      setIsSubmitted(true);
      
      // Store email in localStorage for OTP verification
      localStorage.setItem('resetEmail', email);
      
    } catch (error) {
      toast.error(error || "error in forgot password");
    } finally {
      setLoading(false);
    }
  };


//   handleResendOtp
  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await forgotPassword(email);
      toast.success("OTP resent to your email!");
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Check Your Email</h2>
          <p className="text-gray-600 mt-2">
            We've sent a password reset OTP to<br />
            <span className="font-semibold text-blue-600">{email}</span>
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <h4 className="text-blue-800 font-semibold text-sm">Open your email</h4>
                <p className="text-blue-600 text-xs">Check your inbox for our message</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <h4 className="text-blue-800 font-semibold text-sm">Enter the OTP</h4>
                <p className="text-blue-600 text-xs">Use the 6-digit code to verify</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <h4 className="text-blue-800 font-semibold text-sm">Create new password</h4>
                <p className="text-blue-600 text-xs">Set a strong, memorable password</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => router.push('/verify-otp')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium"
          >
            Enter OTP Code
          </button>

          <button
            onClick={handleResendOtp}
            disabled={loading}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200 font-medium"
          >
            {loading ? 'Sending...' : 'Resend OTP'}
          </button>

          <button
            onClick={() => setIsSubmitted(false)}
            className="w-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition duration-200 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Use different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Key className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
        <p className="text-gray-600 mt-2">Enter your email to reset your password</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your registered email"
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-700 text-sm text-center">
            We'll send a 6-digit OTP to your email to reset your password
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium flex items-center justify-center"
        >
          {loading ? (
            <span className="animate-pulse">Sending OTP...</span>
          ) : (
            <>
              <Key className="w-5 h-5 mr-2" />
              Send Reset OTP
            </>
          )}
        </button>
      </form>

      {/* Back to Login */}
      <div className="mt-6 text-center">
        <button
          onClick={() => router.push('/login')}
          className="flex items-center justify-center text-gray-600 hover:text-gray-800 transition duration-200 font-medium mx-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to login
        </button>
      </div>
    </div>
  );
}
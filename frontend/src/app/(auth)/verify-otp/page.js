"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { forgotPassword, verifyOtp } from '@/services/authServices';
import { Shield, ArrowLeft, RotateCcw } from 'lucide-react';

export default function VerifyOtp() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const inputRefs = useRef([]);

  useEffect(() => {
    // Get email from localStorage
    const savedEmail = localStorage.getItem('resetEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      toast.error('Email not found. Please start over.');
      router.push('/forgot-password');
    }

    // Start countdown timer
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [router]);

  useEffect(() => {
    // Auto-focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    if (timer === 0) {
      toast.error('OTP has expired. Please request a new one.');
      return;
    }

    setLoading(true);

    try {
      const response = await verifyOtp(email, otpValue);
      toast.success(response.message || "OTP verified successfully!");
      
      // Redirect to reset password page
      setTimeout(() => {
        router.push('/reset-password');
      }, 1000);
      
    } catch (error) {
        console.log('=================otp error===================');
        console.log(error);
        console.log(error.message);
        console.log('=================otp error===================');
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await forgotPassword(email);
      toast.success("New OTP sent to your email!");
      setTimer(300); // Reset timer to 5 minutes
      setOtp(['', '', '', '', '', '']);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Verify OTP</h2>
        <p className="text-gray-600 mt-2">
          Enter the 6-digit code sent to<br />
          <span className="font-semibold text-blue-600">{email}</span>
        </p>
        
        {/* Timer */}
        <div className={`mt-2 text-sm font-medium ${
          timer < 60 ? 'text-red-600' : 'text-gray-600'
        }`}>
          Code expires in: {formatTime(timer)}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Input Fields */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 text-center">
            6-digit verification code
          </label>
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                disabled={timer === 0}
              />
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-700 text-sm text-center">
            Check your email for the verification code. It may take a few minutes to arrive.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || timer === 0}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="animate-pulse">Verifying...</span>
          ) : (
            <>
              <Shield className="w-5 h-5 mr-2" />
              Verify Code
            </>
          )}
        </button>
      </form>

      {/* Resend OTP & Back Links */}
      <div className="mt-6 text-center space-y-4">
        <button
          onClick={handleResendOtp}
          disabled={loading || timer > 240} // Can resend after 1 minute
          className="flex items-center justify-center text-blue-600 hover:text-blue-700 transition duration-200 font-medium mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Resend OTP {timer > 240 && `(available in ${formatTime(timer - 240)})`}
        </button>

        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={() => router.push('/forgot-password')}
            className="flex items-center justify-center text-gray-600 hover:text-gray-800 transition duration-200 font-medium mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to forgot password
          </button>
        </div>
      </div>
    </div>
  );
}
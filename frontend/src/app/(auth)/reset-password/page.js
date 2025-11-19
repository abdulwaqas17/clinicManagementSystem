"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { resetPassword } from "@/services/authServices";
import { Lock, Check, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function ResetPassword() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Get email from localStorage
    const savedEmail = localStorage.getItem("resetEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      toast.error("Session expired. Please start over.");
      router.push("/forgot-password");
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, text: "", color: "" };
    if (password.length < 6)
      return { strength: 1, text: "Weak", color: "bg-red-500" };

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strength = [
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
    ].filter(Boolean).length;

    if (strength === 1)
      return { strength: 2, text: "Fair", color: "bg-orange-500" };
    if (strength === 2)
      return { strength: 3, text: "Good", color: "bg-yellow-500" };
    if (strength === 3)
      return { strength: 4, text: "Strong", color: "bg-green-500" };
    return { strength: 5, text: "Very Strong", color: "bg-green-600" };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);
  const passwordsMatch =
    formData.newPassword &&
    formData.confirmPassword &&
    formData.newPassword === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword(
        email,
        formData.newPassword
      );
      toast.success(response.message || "Password reset successfully!");

      // Clear stored email
      localStorage.removeItem("resetEmail");
      setIsSubmitted(true);

      // Redirect to login after delay
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Password Reset!</h2>
          <p className="text-gray-600 mt-2">
            Your password has been successfully updated
          </p>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center mb-6">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-green-800 font-semibold text-lg mb-2">
            Successfully Updated
          </h3>
          <p className="text-green-600 text-sm">
            You can now login with your new password
          </p>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => router.push("/login")}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 font-medium"
        >
          Continue to Login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">New Password</h2>
        <p className="text-gray-600 mt-2">
          Create a strong and secure new password
        </p>
        <p className="text-sm text-gray-500 mt-1">
          For: <span className="font-semibold text-blue-600">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* New Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700"
          >
            New Password *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="newPassword"
              name="newPassword"
              type={showPassword.newPassword ? "text" : "password"}
              required
              value={formData.newPassword}
              onChange={handleChange}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Create new password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => togglePasswordVisibility("newPassword")}
            >
              {showPassword.newPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>

          {/* Password Strength Meter */}
          {formData.newPassword && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Password strength</span>
                <span
                  className={`text-xs font-semibold ${
                    passwordStrength.text === "Weak"
                      ? "text-red-500"
                      : passwordStrength.text === "Fair"
                      ? "text-orange-500"
                      : passwordStrength.text === "Good"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  {passwordStrength.text}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm New Password *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword.confirmPassword ? "text" : "password"}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`block w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                formData.confirmPassword
                  ? passwordsMatch
                    ? "border-green-500 focus:ring-green-500"
                    : "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Confirm new password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => togglePasswordVisibility("confirmPassword")}
            >
              {showPassword.confirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>

          {/* Password Match Indicator */}
          {formData.confirmPassword && (
            <div
              className={`flex items-center space-x-2 text-sm ${
                passwordsMatch ? "text-green-500" : "text-red-500"
              }`}
            >
              {passwordsMatch ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Passwords match</span>
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span>Passwords do not match</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Password Requirements */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-blue-800 font-semibold text-sm mb-3">
            Password Requirements
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  formData.newPassword.length >= 6
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              >
                {formData.newPassword.length >= 6 && (
                  <Check className="h-3 w-3 text-white" />
                )}
              </div>
              <span
                className={`${
                  formData.newPassword.length >= 6
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              >
                At least 6 characters
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  /[A-Z]/.test(formData.newPassword)
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              >
                {/[A-Z]/.test(formData.newPassword) && (
                  <Check className="h-3 w-3 text-white" />
                )}
              </div>
              <span
                className={`${
                  /[A-Z]/.test(formData.newPassword)
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              >
                One uppercase letter
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  /\d/.test(formData.newPassword)
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              >
                {/\d/.test(formData.newPassword) && (
                  <Check className="h-3 w-3 text-white" />
                )}
              </div>
              <span
                className={`${
                  /\d/.test(formData.newPassword)
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              >
                One number
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            loading || !passwordsMatch || formData.newPassword.length < 6
          }
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="animate-pulse">Updating Password...</span>
          ) : (
            <>
              <Lock className="w-5 h-5 mr-2" />
              Reset Password
            </>
          )}
        </button>
      </form>

      {/* Back Link */}
      <div className="mt-6 text-center">
        <button
          onClick={() => router.push("/verify-otp")}
          className="flex items-center justify-center text-gray-600 hover:text-gray-800 transition duration-200 font-medium mx-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to OTP verification
        </button>
      </div>
    </div>
  );
}

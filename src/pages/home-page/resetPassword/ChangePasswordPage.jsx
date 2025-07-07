import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  selectUserRole,
  selectCustomerID,
  selectStaffID,
  selectManagerID,
  selectAdminID,
} from "../../../redux/features/userSlice";
import {
  Shield,
  Eye,
  EyeOff,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Lock,
  Key,
  Check,
  X,
} from "lucide-react";
import api from "../../../configs/axios";
import toast from "react-hot-toast";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL params
  const currentUser = useSelector((state) => state.user?.currentUser);
  const userRole = useSelector(selectUserRole);
  const customerID = useSelector(selectCustomerID);
  const staffID = useSelector(selectStaffID);
  const managerID = useSelector(selectManagerID);
  const adminID = useSelector(selectAdminID);

  // ✅ Get user ID based on role - prioritize URL param, then Redux
  let userID = id; // From URL params first
  if (!userID) {
    if (userRole === "customer") userID = customerID;
    else if (userRole === "staff") userID = staffID;
    else if (userRole === "manager") userID = managerID;
    else if (userRole === "admin") userID = adminID;
  }

  // Fallback to currentUser
  if (!userID && currentUser) {
    userID =
      currentUser?.customerID ||
      currentUser?.customerId ||
      currentUser?.staffID ||
      currentUser?.staffId ||
      currentUser?.managerID ||
      currentUser?.managerId ||
      currentUser?.adminID ||
      currentUser?.adminId;
  }

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    match: false,
  });

  // Password validation rules
  const validatePassword = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Real-time validation for new password
    if (field === "newPassword") {
      const passwordValidations = validatePassword(value);
      setValidations((prev) => ({
        ...passwordValidations,
        match: prev.match,
      }));
    }

    // Check if passwords match
    if (field === "confirmPassword" || field === "newPassword") {
      const newPass = field === "newPassword" ? value : formData.newPassword;
      const confirmPass = field === "confirmPassword" ? value : formData.confirmPassword;
      setValidations((prev) => ({
        ...prev,
        match: newPass === confirmPass && newPass.length > 0,
      }));
    }

    // Clear errors when user starts typing
    if (error) setError(null);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userID) {
      setError("User ID not found. Please log in again.");
      return;
    }

    // Validate form
    if (!formData.currentPassword) {
      setError("Please enter your current password");
      return;
    }

    if (!formData.newPassword) {
      setError("Please enter your new password");
      return;
    }

    if (!formData.confirmPassword) {
      setError("Please confirm your new password");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Password confirmation does not match");
      return;
    }

    // Check password strength
    const passwordValidations = validatePassword(formData.newPassword);
    const isPasswordStrong = Object.values(passwordValidations).every(Boolean);
    
    if (!isPasswordStrong) {
      setError("New password does not meet security requirements");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ✅ Dynamic API endpoint based on role
      let apiPath = `/customer/reset-password/${userID}`; // Default
      if (userRole === "staff") apiPath = `/staff/reset-password/${userID}`;
      else if (userRole === "manager") apiPath = `/manager/reset-password/${userID}`;
      else if (userRole === "admin") apiPath = `/admin/reset-password/${userID}`;

      const requestData = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      };

      console.log('🔐 Sending password reset request:', {
        apiPath,
        userRole,
        userID,
        currentTime: '2025-07-04 06:48:04',
        currentUser: 'loclnx'
      });

      const response = await api.patch(apiPath, requestData, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json; charset=utf-8',
        }
      });

      console.log('✅ Password reset successful:', response.data);

      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setValidations({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
        match: false,
      });

      setSuccess(true);
      

      // Auto-hide success message and redirect after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        navigate('/profile');
      }, 2000);

    } catch (err) {
      console.error("❌ Error resetting password:", err);
      
      let errorMessage = "An error occurred while changing password. Please try again.";
      
      if (err.response) {
        const { status, data } = err.response;
        
        console.log('🔍 Error Response:', {
          status,
          data,
          userRole,
          userID,
          currentTime: '2025-07-04 06:48:04',
          currentUser: 'loclnx'
        });
        
        if (data?.message) {
          errorMessage = data.message;
        } else if (data?.error) {
          errorMessage = data.error;
        } else if (typeof data === 'string') {
          errorMessage = data;
        }
        
        // Handle specific HTTP status codes
        switch (status) {
          case 400:
            errorMessage = "Invalid information. Please check your password.";
            break;
          case 401:
            errorMessage = "Current password is incorrect.";
            break;
          case 404:
            errorMessage = `${userRole?.charAt(0).toUpperCase() + userRole?.slice(1) || 'User'} account not found.`;
            break;
          case 422:
            errorMessage = "New password does not meet security requirements.";
            break;
          case 500:
            errorMessage = "System error. Please try again later.";
            break;
          default:
            break;
        }
      } else if (err.request) {
        errorMessage = "Unable to connect to server. Please check your network connection.";
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  // Check if form is valid
  const isFormValid = 
    formData.currentPassword &&
    formData.newPassword &&
    formData.confirmPassword &&
    Object.values(validations).every(Boolean);

  // ✅ Dynamic page title based on role
  const getPageTitle = () => {
    const roleTitle = userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'User';
    return `Change ${roleTitle} Password`;
  };

  const getPageSubtitle = () => {
    return `Update your ${userRole || 'account'} password to secure your account`;
  };

  return (
    <div lang="en" className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Enhanced English font support */
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap');
          
          /* English text styling */
          .english-text {
            font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif !important;
            font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-variant-ligatures: normal;
            letter-spacing: 0.01em;
            unicode-bidi: embed;
            direction: ltr;
            line-height: 1.6;
          }
          
          /* Form elements with English support */
          input.english-input {
            font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
            font-size: 16px !important;
            line-height: 1.5 !important;
            letter-spacing: 0.01em !important;
            unicode-bidi: embed;
            direction: ltr;
          }
          
          /* Button text */
          button.english-button {
            font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
            font-weight: 500 !important;
            letter-spacing: 0.01em !important;
          }
          
          /* Headers */
          h1.english-header, h2.english-header, h3.english-header {
            font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
            font-weight: 600 !important;
            letter-spacing: -0.01em !important;
          }
          
          /* Animation */
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .animate-slideIn { animation: slideIn 0.5s ease-out forwards; }
          
          /* Password strength indicator */
          .strength-indicator {
            transition: all 0.3s ease;
          }
          
          .strength-indicator.valid {
            color: #10b981;
          }
          
          .strength-indicator.invalid {
            color: #ef4444;
          }
          
          /* Custom focus ring */
          .focus-ring:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            border-color: #3b82f6;
          }
        `
      }} />

      <div className="container mx-auto px-4 py-10">
        {/* Messages */}
        {success && (
          <div className="fixed top-5 right-5 z-50 bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slideIn">
            <CheckCircle className="h-5 w-5" />
            <span className="english-text">Password changed successfully!</span>
          </div>
        )}
        {error && (
          <div className="fixed top-5 right-5 z-50 bg-red-500 text-white px-5 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slideIn">
            <AlertCircle className="h-5 w-5" />
            <span className="english-text">{error}</span>
          </div>
        )}

        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-200">
            <div
              className="p-8 relative"
              style={{
                background: "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
              }}>
              <div className="flex items-center space-x-4">
                <button
                  onClick={goBack}
                  className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors english-button focus-ring"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                    <Shield className="h-6 w-6 text-blue-800" />
                  </div>
                  <div className="text-white">
                    <h1 className="text-2xl font-bold english-text english-header">
                      {getPageTitle()}
                    </h1>
                    <p className="text-blue-100 english-text">
                      {getPageSubtitle()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Current Password */}
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-600 mb-2 english-text">
                    Current Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type={showPasswords.current ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg transition-all duration-200 english-input focus-ring"
                      placeholder="Enter current password"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors"
                      tabIndex={-1}
                      aria-label={showPasswords.current ? "Hide password" : "Show password"}
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-600 mb-2 english-text">
                    New Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange("newPassword", e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg transition-all duration-200 english-input focus-ring"
                      placeholder="Enter new password"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors"
                      tabIndex={-1}
                      aria-label={showPasswords.new ? "Hide password" : "Show password"}
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-600 mb-2 english-text">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg transition-all duration-200 english-input focus-ring"
                      placeholder="Re-enter new password"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors"
                      tabIndex={-1}
                      aria-label={showPasswords.confirm ? "Hide password" : "Show password"}
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={goBack}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold transition-all duration-200 hover:bg-gray-100 english-button focus-ring"
                    disabled={loading}
                  >
                    <span className="english-text">Cancel</span>
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !isFormValid}
                    className="px-6 py-3 text-white rounded-lg font-semibold transition-all duration-300 shadow-md flex items-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105 english-button focus-ring"
                    style={{
                      background: isFormValid && !loading
                        ? "linear-gradient(135deg, #023670 0%, #2563eb 100%)"
                        : "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)",
                    }}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span className="english-text">Processing...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        <span className="english-text">Change Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Password Requirements Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 english-text english-header">
                  Password Requirements
                </h3>
                <div className="space-y-3">
                  <div className={`flex items-center space-x-3 strength-indicator ${validations.length ? 'valid' : 'invalid'}`}>
                    {validations.length ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    <span className="text-sm english-text">At least 8 characters</span>
                  </div>
                  <div className={`flex items-center space-x-3 strength-indicator ${validations.uppercase ? 'valid' : 'invalid'}`}>
                    {validations.uppercase ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    <span className="text-sm english-text">Uppercase letter (A-Z)</span>
                  </div>
                  <div className={`flex items-center space-x-3 strength-indicator ${validations.lowercase ? 'valid' : 'invalid'}`}>
                    {validations.lowercase ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    <span className="text-sm english-text">Lowercase letter (a-z)</span>
                  </div>
                  <div className={`flex items-center space-x-3 strength-indicator ${validations.number ? 'valid' : 'invalid'}`}>
                    {validations.number ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    <span className="text-sm english-text">Number (0-9)</span>
                  </div>
                  <div className={`flex items-center space-x-3 strength-indicator ${validations.special ? 'valid' : 'invalid'}`}>
                    {validations.special ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    <span className="text-sm english-text">Special character</span>
                  </div>
                  <div className={`flex items-center space-x-3 strength-indicator ${validations.match ? 'valid' : 'invalid'}`}>
                    {validations.match ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    <span className="text-sm english-text">Passwords match</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
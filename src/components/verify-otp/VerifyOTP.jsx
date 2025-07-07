import React from "react"
import { useState, useEffect } from "react"
import { Mail, Clock, Lock, Eye, EyeOff, CheckCircle, RefreshCw, AlertCircle, Shield } from "lucide-react"
import toast from "react-hot-toast"
import api from "../../configs/axios"

function VerifyOTP({ onSubmit, mode = "forgotten", initialEmail = "", disableEmailEdit = false }) {
  const [email, setEmail] = useState(initialEmail)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [resendTimeLeft, setResendTimeLeft] = useState(0)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [emailError, setEmailError] = useState("")

  // Set initial email if provided
  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail)
    }
  }, [initialEmail])
  // Countdown timer for OTP expiry (5 minutes = 300 seconds)
  useEffect(() => {
    if (timeLeft > 0 && !otpVerified) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && otpSent && !otpVerified) {
      toast.error("OTP has expired. Please request a new one.")
      setOtpSent(false)
      setOtp(["", "", "", "", "", ""])
    }
  }, [timeLeft, otpSent, otpVerified])
  // Countdown timer for resend availability (30 seconds)
  useEffect(() => {
    if (resendTimeLeft > 0 && !otpVerified) {
      const timer = setTimeout(() => setResendTimeLeft(resendTimeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimeLeft, otpVerified])

  // Format time display (mm:ss)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Validate email function
  const validateEmail = (email) => {
    if (!email) {
      return "Email is required"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address"
    }

    return ""
  }

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return // Prevent multiple characters

    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  // Handle OTP input keydown
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  // Send OTP to user's email
  const handleSendOtp = async () => {
    const emailValidationError = validateEmail(email)
    if (emailValidationError) {
      setEmailError(emailValidationError)
      toast.error(emailValidationError)
      return
    }

    // Clear any previous errors
    setEmailError("")

    setSendingOtp(true)

    try {
      const response = await api.post("/auth/request-otp", { email })
      console.log(response)

      if (response.status === 200 || response.status === 201) {
        toast.success("OTP has been sent to your email!")
        setOtpSent(true)
        setTimeLeft(300) // 5 minutes = 300 seconds
        setResendTimeLeft(30) // 30 seconds
        setOtp(["", "", "", "", "", ""])
      } else {
        toast.error("Failed to send OTP. Please try again.")
      }
    } catch (error) {
      console.error("Send OTP error:", error)
      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Failed to send OTP. Please try again."
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg))
    } finally {
      setSendingOtp(false)
    }
  }

  // Handle verify OTP
  const handleVerifyOtp = async () => {
    const otpString = otp.join("")

    if (!otpString || otpString.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP.")
      return
    }

    if (timeLeft <= 0) {
      toast.error("OTP has expired. Please request a new one.")
      return
    }

    setLoading(true)

    try {
      const response = await api.post("/auth/email/verify-otp", {
        email,
        otp: otpString,      })
      console.log(response)

      if (response.status === 200 || response.status === 201) {
        toast.success("OTP verified successfully! You can now reset your password.")
        setOtpVerified(true)
        // Stop the resend countdown when OTP is verified
        setResendTimeLeft(0)
        // Don't call onSubmit here - wait until password is actually updated
      } else {
        toast.error("OTP verification failed. Please check your OTP and try again.")
      }
    } catch (error) {
      console.error("Verify OTP error:", error)
      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "OTP verification failed. Please check your OTP and try again."
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg))
    } finally {
      setLoading(false)
    }
  }

  // Handle save new password
  const handleSavePassword = async () => {
    if (!newPassword) {
      toast.error("Please enter your new password.")
      return
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }

    setSavingPassword(true)

    try {
      const response = await api.post("/auth/update-password", {
        email,
        otp: otp.join(""),
        newPassword,
        confirmPassword,
      })
      console.log(response)

      if (response.status === 200 || response.status === 201) {
        toast.success("Password updated successfully!")

        // Now call onSubmit to trigger the redirect
        if (onSubmit) {
          onSubmit(email, otp.join(""))
        }

        resetForm()
      } else {
        toast.error("Failed to update password. Please try again.")
      }
    } catch (error) {
      console.error("Reset password error:", error)
      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Failed to update password. Please try again."
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg))
    } finally {
      setSavingPassword(false)
    }
  }

  // Reset to resend OTP
  const handleResendOtp = () => {
    setOtpSent(false)
    setTimeLeft(0)
    setResendTimeLeft(0)
    setOtp(["", "", "", "", "", ""])
    // Don't reset otpVerified - keep it true if already verified
  }

  // Reset entire form
  const resetForm = () => {
    if (!disableEmailEdit) {
      setEmail("")
    }
    setEmailError("")
    setOtp(["", "", "", "", "", ""])
    setNewPassword("")
    setConfirmPassword("")
    setOtpSent(false)
    setOtpVerified(false)
    setTimeLeft(0)
    setResendTimeLeft(0)
  }

  // Get appropriate text based on mode
  const getPasswordSectionTitle = () => {
    return mode === "forgotten" ? "Set New Password" : "Reset Your Password"
  }

  const getMainTitle = () => {
    if (otpVerified) {
      return mode === "forgotten" ? "Set New Password" : "Reset Password"
    }
    return "Verification"
  }

  const getMainDescription = () => {
    if (otpVerified) {
      return mode === "forgotten"
        ? "Enter your new password to complete account recovery"
        : "Enter your new password to reset your account"
    }
    return disableEmailEdit ? "We'll send a verification code to your email" : "Enter your email to receive an OTP code"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-sky-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-sky-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-sky-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* MAIN VERIFY OTP COMPONENT */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 relative overflow-hidden">
          {/* Enhanced corner decorations with balanced positioning */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-400/12 to-blue-500/18 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-sky-500/12 to-blue-600/18 rounded-full translate-y-16 -translate-x-16"></div>

          {/* Additional subtle pattern - smaller and more balanced */}
          <div className="absolute top-6 right-6 w-16 h-16 bg-gradient-to-br from-sky-300/8 to-blue-400/12 rounded-full"></div>
          <div className="absolute bottom-6 left-6 w-16 h-16 bg-gradient-to-tr from-sky-300/8 to-blue-400/12 rounded-full"></div>

          <div className="relative z-10">
            {/* Logo and Header */}
            <div className="text-center mb-8">
              {/* Verification Symbol */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-6 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Custom gradient for Verification title */}
              <h2
                className="text-4xl font-bold mb-3 bg-clip-text text-transparent"
                style={{
                  background: "linear-gradient(90deg, #1f6bd6 30%, #0e3976 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {getMainTitle()}
              </h2>
              <p className="text-gray-600 text-base leading-relaxed font-medium">{getMainDescription()}</p>
            </div>

            <div className="space-y-6">
              {/* Email Input Section */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="flex-1">
                      <div className="relative">
                        <Mail
                          className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                            emailError ? "text-red-500" : "text-blue-500"
                          }`}
                        />
                        <input
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => {
                            if (!disableEmailEdit) {
                              const newEmail = e.target.value
                              setEmail(newEmail)

                              // Real-time validation
                              const error = validateEmail(newEmail)
                              setEmailError(error)
                            }
                          }}
                          className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/25 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-300 text-base font-medium ${
                            emailError
                              ? "border-red-400 focus:ring-red-500/25 focus:border-red-500 bg-red-50/50"
                              : "border-gray-200 hover:border-blue-300 bg-white/80"
                          }`}
                          disabled={disableEmailEdit || (otpSent && timeLeft > 0)}
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleSendOtp}
                      disabled={sendingOtp || (otpSent && resendTimeLeft > 0) || emailError || otpVerified}
                      className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none active:scale-95"
                    >
                      {sendingOtp && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                      {sendingOtp
                        ? "Sending..."
                        : resendTimeLeft > 0
                          ? `Wait ${resendTimeLeft}s`
                          : otpVerified
                            ? "OTP Verified"
                            : otpSent && !otpVerified
                              ? "Re-send OTP"
                              : "Send OTP"}
                    </button>
                  </div>

                  {/* Fixed height container for error message */}
                  <div className="h-6">
                    {emailError && (
                      <div className="flex items-center text-red-600 text-sm animate-in slide-in-from-top-1 duration-200 font-medium">
                        <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{emailError}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* OTP Input Section - Only show when OTP is sent */}
              {otpSent && (
                <div className="bg-white/95 backdrop-blur-sm border-2 border-blue-200/50 rounded-3xl p-6 shadow-xl animate-in slide-in-from-top-2 duration-500">
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span className="font-semibold text-emerald-800 text-sm">
                        OTP sent to: <span className="font-mono text-emerald-700">{email}</span>
                      </span>
                    </div>
                  </div>

                  {/* Timer - Only show when time is running and OTP not verified */}
                  {timeLeft > 0 && !otpVerified && (
                    <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span className="font-semibold text-amber-700 text-sm">Expires in: {formatTime(timeLeft)}</span>
                    </div>
                  )}

                  <div className="mb-6">
                    <label className="block text-center text-sm font-bold text-gray-700 mb-4">
                      Enter 6-Digit Verification Code
                    </label>

                    {/* Modern OTP Input Grid */}
                    <div className="flex justify-center gap-3 mb-6">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ""))}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-12 h-14 text-center text-xl font-bold border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/25 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 bg-white/90 hover:border-blue-300"
                          disabled={timeLeft <= 0 || otpVerified}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Verify Button - Only show when OTP not verified */}
                  {!otpVerified && (
                    <div className="space-y-3">
                      <button
                        onClick={handleVerifyOtp}
                        disabled={loading || timeLeft <= 0 || otp.some((digit) => !digit)}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none active:scale-95"
                      >
                        {loading && <RefreshCw className="w-5 h-5 mr-2 animate-spin" />}
                        {loading ? "Verifying..." : "Verify OTP"}
                      </button>

                      {/* Resend Button - Only show when OTP expired */}
                      {timeLeft <= 0 && (
                        <button
                          onClick={handleResendOtp}
                          className="w-full py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-2xl hover:from-gray-600 hover:to-gray-700 font-semibold transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Password Reset Section - Only show when OTP is verified */}
              {otpVerified && (
                <>
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t-2 border-gradient-to-r from-blue-200 to-indigo-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-600 font-bold">Password Reset</span>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-blue-50 via-blue-100 to-indigo-50 border-2 border-blue-300 rounded-2xl animate-in slide-in-from-bottom-2 duration-500 shadow-lg">
                    <h4 className="text-xl font-bold text-blue-800 mb-6 flex items-center">
                      <Lock className="w-6 h-6 mr-3" />
                      {getPasswordSectionTitle()}
                    </h4>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          New Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                          <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter new password (min 6 characters)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full pl-12 pr-14 py-4 border-2 border-blue-300 rounded-2xl focus:ring-4 focus:ring-blue-500/25 focus:border-blue-500 transition-all duration-300 text-base font-medium bg-white/80"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 transition-colors"
                          >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-12 pr-14 py-4 border-2 border-blue-300 rounded-2xl focus:ring-4 focus:ring-blue-500/25 focus:border-blue-500 transition-all duration-300 text-base font-medium bg-white/80"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={handleSavePassword}
                        disabled={savingPassword || !newPassword || !confirmPassword}
                        className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl hover:from-emerald-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none text-base active:scale-95"
                      >
                        {savingPassword && <RefreshCw className="w-5 h-5 mr-2 animate-spin" />}
                        {savingPassword ? "Saving..." : "Save New Password"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyOTP

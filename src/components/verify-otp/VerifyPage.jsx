import React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import VerifyOTP from "./VerifyOTP"
import { Toaster } from "react-hot-toast"
import toast from "react-hot-toast"

function VerifyPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = useSelector((state) => state)
  const user = state?.auth?.user || state?.user || state?.authSlice?.user || null

  const [mode, setMode] = useState("forgotten")
  const [userEmail, setUserEmail] = useState("")
  const [disableEmailEdit, setDisableEmailEdit] = useState(false)

  // Xác định mode dựa trên query params hoặc state
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const modeParam = searchParams.get("mode") // ?mode=reset
    const stateMode = location.state?.mode // từ navigate("/verify", { state: { mode: "reset" } })

    if (modeParam === "reset" || stateMode === "reset") {
      // Trường hợp Reset Password (đã đăng nhập)
      if (user && user.email) {
        setMode("reset")
        setUserEmail(user.email)
        setDisableEmailEdit(true)
      } else {
        // Nếu không có thông tin user, redirect về login
        toast.error("You need to be logged in to reset your password")
        navigate("/login")
      }
    } else {
      // Trường hợp Forgotten Password (chưa đăng nhập)
      setMode("forgotten")
      setUserEmail("")
      setDisableEmailEdit(false)
    }
  }, [location, user, navigate])
  // This function is now only called AFTER password is successfully updated
  const handleSubmit = (email, otp) => { // eslint-disable-line no-unused-vars
    console.log(`${mode} completed for:`, email)

    if (mode === "reset") {
      // Reset Password - đăng xuất và về login
      setTimeout(() => {
        toast.success("Password reset completed! Please login again with your new password.")
        // dispatch(logout()) // Đăng xuất user
        navigate("/login")
      }, 1500)
    } else {
      // Forgotten Password - về login
      setTimeout(() => {
        toast.success("Password reset completed! Redirecting to login...")
        navigate("/login")
      }, 1500)
    }
  }

  return (
    <div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            style: {
              background: "#10b981",
              color: "#fff",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#ef4444",
              color: "#fff",
            },
          },
        }}
      />

      <VerifyOTP mode={mode} onSubmit={handleSubmit} initialEmail={userEmail} disableEmailEdit={disableEmailEdit} />
    </div>
  )
}

export default VerifyPage

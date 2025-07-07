import axios from "axios"
import { store } from "../app/store"
import { selectToken } from "../redux/features/userSlice"

// Set config defaults when creating the instance
const api = axios.create({
  baseURL: "http://103.90.227.214:8080/api",
})

// Authentication helper functions
export const saveAuthData = (data) => {
  const { token, refreshToken, user } = data

  if (token) {
    localStorage.setItem("token", token)
    // Interceptor will automatically handle adding token to headers
  }

  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken)
  }

  if (user) {
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("userRole", user.role)
  }
}

export const clearAuthData = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("refreshToken")
  localStorage.removeItem("user")
  localStorage.removeItem("userRole")
  localStorage.removeItem("permissions")

  // Clear any other app-specific data
  localStorage.removeItem("sidebar:state")
  localStorage.removeItem("theme")
  localStorage.removeItem("language")

  // Clear sessionStorage as well
  sessionStorage.clear()
}

export const getAuthData = () => {
  try {
    const token = localStorage.getItem("token")
    const refreshToken = localStorage.getItem("refreshToken")
    const user = localStorage.getItem("user")
    const userRole = localStorage.getItem("userRole")

    return {
      token,
      refreshToken,
      user: user ? JSON.parse(user) : null,
      userRole,
      isAuthenticated: !!(token && user),
    }
  } catch (error) {
    console.error("Error getting auth data:", error)
    return {
      token: null,
      refreshToken: null,
      user: null,
      userRole: null,
      isAuthenticated: false,
    }
  }
}

export const isAuthenticated = () => {
  const { token, user } = getAuthData()
  return !!(token && user)
}

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    // Lấy token từ Redux store nếu có, fallback sang localStorage nếu chưa có
    let token
    try {
      const state = store.getState()
      token = selectToken(state)
    } catch {
      token = null
    }
    if (!token) {
      token = localStorage.getItem("token")
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      console.warn("Authentication failed - clearing auth data")
      clearAuthData()

      // Redirect to login if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  },
)

export default api

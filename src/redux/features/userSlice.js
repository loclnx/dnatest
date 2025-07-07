import { createSlice, createAction } from "@reduxjs/toolkit"

// Tạo action để clear user data (sử dụng cho LogOut component)
export const clearUser = createAction("user/clearUser")

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  userRole: null,
  loginTime: null,
  customerID: null, // Thêm customerID vào state
  token: null, // Thêm token vào state
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      // Lưu thông tin đăng nhập của user vào state
      const userData = action.payload
      state.currentUser = userData
      state.fullName = userData?.fullName || userData?.username || "User" // Lưu fullName nếu có
      state.isAuthenticated = true
      state.userRole = userData?.role ? String(userData.role).toLowerCase() : null
      state.loginTime = new Date().toISOString()
      state.customerID = userData?.customerID || null // Lưu customerID nếu có
      state.adminID = userData?.adminID || null // Lưu adminID nếu có
      state.staffID = userData?.staffID || null // Lưu staffID nếu có
      state.managerID = userData?.managerID || null // Lưu managerID nếu có
      state.token = userData?.token || null // Lưu token nếu có
    },
    logout: (state) => {
      // Xoá thông tin đăng nhập của user khỏi state
      state.currentUser = null
      state.isAuthenticated = false
      state.userRole = null
      state.loginTime = null
      state.customerID = null // Reset customerID
      state.token = null // Reset token
    },
    updateUser: (state, action) => {
      // Cập nhật thông tin user
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
        // Nếu payload có fullName thì cập nhật luôn state.fullName
        if (action.payload.fullName !== undefined) {
          state.fullName = action.payload.fullName;
        }
        if (action.payload.customerID !== undefined) {
          state.customerID = action.payload.customerID;
        }
      }
    },
    setUserRole: (state, action) => {
      // Cập nhật role của user
      state.userRole = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearUser, (state) => {
      // Xử lý action clearUser từ LogOut component
      state.currentUser = null
      state.isAuthenticated = false
      state.userRole = null
      state.loginTime = null
      state.customerID = null // Reset customerID
      state.token = null // Reset token
    })
  },
})

// Action creators are generated for each case reducer function
export const { login, logout, updateUser, setUserRole } = userSlice.actions

// Selectors để lấy data từ state
export const selectCurrentUser = (state) => state.user?.currentUser
export const selectIsAuthenticated = (state) => state.user?.isAuthenticated || false
export const selectUserRole = (state) => state.user?.userRole ? String(state.user.userRole).toLowerCase() : null
export const selectLoginTime = (state) => state.user?.loginTime
export const selectCustomerID = (state) => state.user?.customerID // Selector lấy customerID
export const selectAdminID = (state) => state.user?.adminID // Selector lấy adminID
export const selectStaffID = (state) => state.user?.staffID // Selector lấy staffID
export const selectManagerID = (state) => state.user?.managerID // Selector lấy manager
export const selectFullName = (state) => state.user?.fullName // Selector lấy fullName
export const selectToken = (state) => state.user?.token // Selector lấy token

export default userSlice.reducer
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import {
  selectIsAuthenticated,
  selectUserRole,
} from "../../redux/features/userSlice";

/**
 * @param {Object} props
 * @param {string|string[]} props.roles - Role hoặc mảng role được phép truy cập
 * @param {string} [props.redirectTo] - Đường dẫn chuyển hướng nếu không đủ quyền (default: "/login")
 */
const ProtectedRoute = ({ roles, redirectTo = "/login" }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);

  // Nếu chưa đăng nhập, chuyển về login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Nếu truyền roles, kiểm tra quyền
  if (roles) {
    const allowedRoles = Array.isArray(roles)
      ? roles.map((r) => String(r).toLowerCase())
      : [String(roles).toLowerCase()];
    if (!allowedRoles.includes(userRole)) {
      // Không đủ quyền: chuyển hướng dựa vào role
      let redirectPath = "/";
      switch (userRole) {
        case "staff":
          redirectPath = "/staff-dashboard";
          break;
        case "manager":
          redirectPath = "/manager-dashboard";
          break;
        case "admin":
          redirectPath = "/dashboard";
          break;
        case "customer":
        default:
          redirectPath = "/";
      }
      return <Navigate to={redirectPath} replace />;
    }
  }

  // Được phép
  return <Outlet />;
};

export default ProtectedRoute;

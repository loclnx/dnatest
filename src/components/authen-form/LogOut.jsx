import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Modal, Button, message, Typography } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import api from "../../configs/axios";
import { clearUser } from "../../redux/features/userSlice";
import { toast } from "react-toastify";
import { AlertTriangle, LogOut as LucideLogOut, Loader2 } from "lucide-react";
const { Text } = Typography;

const LogOut = ({
  trigger = "button", // "button" | "modal" | "function"
  buttonText = "Sign Out",
  buttonType = "default",
  buttonSize = "middle",
  showIcon = true,
  showConfirmation = true,
  onLogoutSuccess,
  onLogoutError,
  open, // thêm prop open để điều khiển modal từ ngoài (Header)
  onCancel, // thêm callback khi cancel modal
  className,
  style,
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Sync prop open (từ Header) vào state modal
  useEffect(() => {
    if (typeof open === "boolean") setIsModalVisible(open);
  }, [open]);

  // Main sign out function - Call API, then clear local data
  const performLogout = async () => {
    try {
      setIsLoggingOut(true);
      await api.post("/auth/logout");
      const currentUser = localStorage.getItem("user");
      const userInfo = currentUser ? JSON.parse(currentUser) : null;
      console.log("Signing out user:", userInfo?.username || "Unknown user");
      dispatch(clearUser());
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      localStorage.removeItem("permissions");
      localStorage.removeItem("sidebar:state");
      localStorage.removeItem("theme");
      localStorage.removeItem("language");
      // Chỉ giữ lại rememberedUsername nếu nó đã tồn tại trước khi logout
      // Nếu không có, không set lại (fix lỗi remember me)
      const hadRememberedUsername = localStorage.getItem("rememberedUsername");
      // ...existing code...
      // Sau khi xóa các key khác, nếu trước đó KHÔNG có rememberedUsername thì remove luôn
      if (!hadRememberedUsername) {
        localStorage.removeItem("rememberedUsername");
      }
      sessionStorage.clear();
      delete api.defaults.headers.common["Authorization"];
      toast.success("Sign out successfully!", {
        autoClose: 1000, // Chuyển hướng sau 1 giây
        onClose: () => navigate("/"),
      });
      if (onLogoutSuccess) {
        onLogoutSuccess();
      }
    } catch (error) {
      console.error("Sign out error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Sign out failed! Please retry!");
      }
      if (onLogoutError) {
        onLogoutError(error);
      }
    } finally {
      setIsLoggingOut(false);
      setIsModalVisible(false);
      if (onCancel) onCancel(); // gọi callback để Header set lại state
    }
  };

  // Handle logout with confirmation
  const handleLogoutClick = () => {
    if (showConfirmation) {
      setIsModalVisible(true);
    } else {
      performLogout();
    }
  };

  // Handle confirmation modal
  const handleConfirmLogout = () => {
    performLogout();
  };

  // Khi Cancel thì đóng modal + gọi callback cho Header
  const handleCancelLogout = () => {
    setIsModalVisible(false);
    if (onCancel) onCancel();
  };

  // Emergency logout without confirmation (for error cases)
  const forceLogout = () => {
    try {
      const currentUser = localStorage.getItem("user");
      const userInfo = currentUser ? JSON.parse(currentUser) : null;
      console.log(
        "Force logging out user:",
        userInfo?.username || "Unknown user"
      );
      dispatch(clearUser());
      // Only clear all except rememberedUsername
      const rememberedUsername = localStorage.getItem("rememberedUsername");
      localStorage.clear();
      if (rememberedUsername) {
        localStorage.setItem("rememberedUsername", rememberedUsername);
      }
      sessionStorage.clear();
      delete api.defaults.headers.common["Authorization"];
      navigate("/", { replace: true });
      window.location.reload();
    } catch (error) {
      console.error("Force logout error:", error);
      window.location.href = "/";
    }
  };

  // Quick logout without confirmation (for programmatic use)
  const quickLogout = () => {
    try {
      const currentUser = localStorage.getItem("user");
      const userInfo = currentUser ? JSON.parse(currentUser) : null;
      console.log(
        "Quick logout for user:",
        userInfo?.username || "Unknown user"
      );
      dispatch(clearUser());
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      localStorage.removeItem("permissions");
      localStorage.removeItem("sidebar:state");
      localStorage.removeItem("theme");
      localStorage.removeItem("language");
      // Do NOT remove rememberedUsername (for login autofill)
      sessionStorage.clear();
      delete api.defaults.headers.common["Authorization"];
      message.success("Sign Out Successfully!");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Quick logout error:", error);
      window.location.href = "/";
    }
  };

  // Expose logout functions for external use
  LogOut.performLogout = performLogout;
  LogOut.forceLogout = forceLogout;
  LogOut.quickLogout = quickLogout;

  if (trigger === "function") {
    return null;
  }

  // Render sign out button
  const LogoutButton = (
    <Button
      type={buttonType}
      size={buttonSize}
      icon={showIcon ? <LogoutOutlined /> : null}
      onClick={handleLogoutClick}
      loading={isLoggingOut}
      disabled={isLoggingOut}
      className={"signout-btn " + (className || "")}
      style={{
        ...(buttonType === "default" && {
          borderColor: "#ff4d4f",
          color: "#ff4d4f",
          background: "#fff",
        }),
        ...style,
      }}
      danger={buttonType === "primary"}>
      {isLoggingOut ? "Signing Out..." : buttonText}
    </Button>
  );

  return (
    <>
      {/* Chỉ hiện nút nếu trigger là button */}
      {trigger === "button" && LogoutButton}
      <style>{`
        .signout-btn:not(:disabled):hover {
          color: #fff !important;
          background: #ff4d4f !important;
          border-color: #ff4d4f !important;
          transition: all 0.2s;
        }
      `}</style>
      <Modal
        open={isModalVisible}
        onOk={handleConfirmLogout}
        onCancel={handleCancelLogout}
        footer={null}
        okText="Sign Out"
        cancelText="Cancel"
        okButtonProps={{
          danger: true,
          loading: isLoggingOut,
          disabled: isLoggingOut,
        }}
        cancelButtonProps={{
          disabled: isLoggingOut,
        }}
        closable={!isLoggingOut}
        maskClosable={!isLoggingOut}
        width={400}
        centered>
        <div className="p-8">
          {/* Icon and Title */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Sign out of your account?
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              You will be redirected to the home page and need to sign in again
              to access your account and use the platform features.
            </p>
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              onClick={handleCancelLogout}
              disabled={isLoggingOut}
              className="
              flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 
              rounded-xl font-medium transition-all duration-200
              hover:bg-gray-50 hover:border-gray-400 focus:outline-none 
              focus:ring-2 focus:ring-gray-200 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              disabled:hover:bg-white disabled:hover:border-gray-300
            ">
              Cancel
            </button>
            <button
              onClick={handleConfirmLogout}
              disabled={isLoggingOut}
              className="
              flex-1 px-4 py-3 text-white bg-red-600 border border-red-600
              rounded-xl font-medium transition-all duration-200
              hover:bg-red-700 hover:border-red-700 focus:outline-none
              focus:ring-2 focus:ring-red-200 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              disabled:hover:bg-red-600 disabled:hover:border-red-600
              flex items-center justify-center gap-2
            ">
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing out...
                </>
              ) : (
                <>
                  <LucideLogOut className="w-4 h-4" />
                  Sign out
                </>
              )}
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Your data will be saved and available when you sign back in
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LogOut;

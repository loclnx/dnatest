import React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Typography,
  Tag,
  Modal,
  Form,
  Select,
  Tooltip,
  Switch,
  Popconfirm,
  Card,
  Row,
  Col,
  Statistic,
} from "antd";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Title, Text } = Typography;
const { Option } = Select;

import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HistoryOutlined,
  TeamOutlined,
  UserAddOutlined,
  ReloadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios";

/**
 * ACCOUNT MANAGEMENT COMPONENT
 *
 * This component provides comprehensive account management functionality including:
 * - CRUD operations for user accounts
 * - Role-based access control (ADMIN, MANAGER, STAFF, CUSTOMER)
 * - Account status management (ACTIVE/INACTIVE)
 * - Advanced search and filtering
 * - Statistics dashboard
 * - Protection features for data integrity
 *
 * API ENDPOINTS:
 * - GET /admin/account - List all accounts
 * - PATCH /admin/account/{id} - Update account
 * - DELETE /admin/account/{id} - Delete account
 * - POST /admin/register - Create new account (username, password, email, phone, role, fullname)
 * - GET /admin/dashboard/customers - Get customer statistics
 */
const AccountManagement = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [deletingAccounts, setDeletingAccounts] = useState(new Set());
  const [accountsWithActiveOrders, setAccountsWithActiveOrders] = useState(
    new Set()
  );
  const [customerStats, setCustomerStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    customersWithOrders: 0,
  });

  // Ant Design form instance
  const [form] = Form.useForm();

  // Pagination state for Table
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  /**
   * Check if a customer account has active orders
   * This prevents deletion of accounts with pending orders
   */
  // Kiểm tra customer có booking nào chưa hoàn thành (status khác Completed/Cancel)
  const checkActiveOrders = async (accountId) => {
    try {
      const response = await api.get("/booking/bookings", {
        params: { customerID: accountId },
      });
      const bookings = response.data?.data || response.data || [];
      // Đếm số booking có status khác Completed và Cancel (không phân biệt hoa thường)
      const hasActive = bookings.some((b) => {
        const status = String(b.status || "").toLowerCase();
        return (
          status !== "completed" &&
          status !== "cancel" &&
          status !== "cancelled"
        );
      });
      return hasActive;
    } catch (error) {
      console.error("Error checking active orders:", error);
      // Nếu lỗi, giả định không có active order để không chặn xóa
      return false;
    }
  };

  /**
   * Fetch active orders status for all customer accounts
   * This helps determine which accounts can be safely deleted
   */
  const fetchActiveOrdersStatus = useCallback(async (accountsData) => {
    try {
      const customerAccounts = accountsData.filter(
        (acc) => acc.role === "CUSTOMER"
      );
      const activeOrdersPromises = customerAccounts.map(async (account) => {
        try {
          const hasActiveOrders = await checkActiveOrders(account.id);
          return { accountId: account.id, hasActiveOrders };
        } catch (error) {
          console.error(
            `Error checking active orders for account ${account.id}:`,
            error
          );
          return { accountId: account.id, hasActiveOrders: false };
        }
      });

      const results = await Promise.all(activeOrdersPromises);
      const accountsWithOrders = new Set(
        results
          .filter((result) => result.hasActiveOrders)
          .map((result) => result.accountId)
      );
      setAccountsWithActiveOrders(accountsWithOrders);
    } catch (error) {
      console.error("Error fetching active orders status:", error);
    }
  }, []);

  /**
   * Fetch customer statistics from the dashboard API
   * Provides overview metrics for the admin dashboard
   */
  const fetchCustomerStats = useCallback(async () => {
    try {
      const response = await api.get("/admin/dashboard/customers");
      const stats = response.data?.data || response.data || {};
      setCustomerStats({
        totalCustomers: stats.totalCustomers || 0,
        activeCustomers: stats.activeCustomers || 0,
        customersWithOrders: stats.customersWithOrders || 0,
      });
    } catch (error) {
      console.error("Error fetching customer statistics:", error);
      // Don't show error toast for stats, just log it
    }
  }, []);

  /**
   * Fetch all accounts from the API
   * Main data loading function that also triggers related data fetching
   */
  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/account");
      // console.log("Accounts API raw response:", response); // Remove or comment out in production
      // Map API fields to UI fields
      const accountsData = (response.data?.data || response.data || []).map(
        (acc) => ({
          id: acc.accountID,
          username: acc.username,
          fullName: acc.fullname, // Thêm fullName từ API
          email: acc.email,
          phone: acc.phone,
          // Lấy role từ authorities nếu có, fallback về acc.role nếu không có
          role:
            acc.authorities && acc.authorities.length > 0
              ? acc.authorities[0].authority
              : acc.role,
          status: acc.enabled ? "ACTIVE" : "INACTIVE",
          createdAt: acc.createAt,
          // Các trường khác nếu cần
          ...acc,
        })
      );
      // console.log("Mapped accountsData:", accountsData); // Remove or comment out in production
      setAccounts(accountsData);
      // Fetch related data
      await fetchActiveOrdersStatus(accountsData);
      await fetchCustomerStats();
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast.error("Failed to fetch accounts");
    } finally {
      setLoading(false);
    }
  }, [fetchActiveOrdersStatus, fetchCustomerStats]);

  // Load data on component mount
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  /**
   * Determine if an account can be safely deleted
   * Implements business rules for account deletion
   */
  const canDeleteAccount = (account) => {
    // Cannot delete if it's the last admin (ignore case)
    if (account.role && account.role.toUpperCase() === "ADMIN") {
      const adminCount = accounts.filter(
        (acc) => acc.role && acc.role.toUpperCase() === "ADMIN"
      ).length;
      if (adminCount <= 1) {
        return {
          canDelete: false,
          reason: "Cannot delete the last admin account",
        };
      }
    }

    // Cannot delete if currently being deleted
    if (deletingAccounts.has(account.id)) {
      return {
        canDelete: false,
        reason: "Account is currently being deleted",
      };
    }

    // Cannot delete if customer has active orders
    if (
      account.role === "CUSTOMER" &&
      accountsWithActiveOrders.has(account.id)
    ) {
      return {
        canDelete: false,
        reason: "Account has active orders that need to be completed first",
      };
    }

    return { canDelete: true, reason: null };
  };

  /**
   * Refresh all data - helper function for consistent data reloading
   */
  const refreshAllData = useCallback(async () => {
    await fetchAccounts();
  }, [fetchAccounts]);

  /**
   * Handle account editing
   * Populates the form with existing account data
   */
  const handleEdit = (record) => {
    setEditingAccount(record);
    form.setFieldsValue({
      fullName: record.fullName,
      email: record.email,
      phone: record.phone,
      role: record.role,
      status: record.status === "ACTIVE",
      // Không set password khi edit
    });
    setIsModalVisible(true);
  };

  /**
   * Handle account deletion with comprehensive validation
   * Implements business rules and provides user feedback
   */
  const handleDelete = async (id) => {
    try {
      const accountToDelete = accounts.find((acc) => acc.id === id);

      // Validation: Prevent deletion of the last admin account
      if (accountToDelete && accountToDelete.role === "ADMIN") {
        const adminCount = accounts.filter(
          (acc) => acc.role === "ADMIN"
        ).length;
        if (adminCount <= 1) {
          toast.error("Cannot delete the last admin account");
          return;
        }
      }

      // Check if customer account has active orders
      if (accountToDelete && accountToDelete.role === "CUSTOMER") {
        const hasActiveOrders = await checkActiveOrders(id);
        if (hasActiveOrders) {
          toast.error(
            `Cannot delete account "${accountToDelete.username}": Account has active orders that need to be completed first`
          );
          return;
        }
      }

      // Track deletion status for UI feedback
      setDeletingAccounts((prev) => new Set(prev).add(id));

      // Make API call to delete account
      await api.delete(`/admin/account/${id}`);

      toast.success(
        `Account "${accountToDelete?.username || id}" deleted successfully`
      );

      // Clean up active orders tracking
      if (accountToDelete && accountToDelete.role === "CUSTOMER") {
        setAccountsWithActiveOrders((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }

      // Refresh data
      await refreshAllData();
    } catch (error) {
      console.error("Error deleting account:", error);
      let errorMessage = "Failed to delete account";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 403) {
        errorMessage = "You don't have permission to delete this account";
      } else if (error.response?.status === 404) {
        errorMessage = "Account not found or already deleted";
      } else if (error.response?.status === 409) {
        errorMessage = "Cannot delete account: Account has associated data";
      } else if (error.message) {
        errorMessage = `Failed to delete account: ${error.message}`;
      }
      toast.error(errorMessage);
    } finally {
      // Remove from deletion tracking
      setDeletingAccounts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  /**
   * Handle form submission for create/update operations
   * Uses Ant Design form validation and API calls
   */
  const handleFormSubmit = async (values) => {
    try {
      if (editingAccount) {
        const accountData = {
          fullName: values.fullName?.trim(),
          email: values.email?.trim(),
          phone: values.phone?.trim(),
          role: values.role,
          enabled: values.status,
        };
        if (values.password && values.password.trim()) {
          accountData.password = values.password.trim();
        }

        // GỌI API
        const res = await api.patch(
          `/admin/account/${editingAccount.id}`,
          accountData
        );

        // NẾU BACKEND TRẢ VỀ 200 NHƯNG BÁO LỖI TRONG BODY
        if (
          res.data?.message &&
          (res.data.message.toLowerCase().includes("phone") ||
            res.data.message.toLowerCase().includes("exist") ||
            res.data.message.toLowerCase().includes("email"))
        ) {
          if (res.data.message.toLowerCase().includes("phone")) {
            toast.error("Phone number already exists in the system!");
          } else if (res.data.message.toLowerCase().includes("email")) {
            toast.error("Email already exists in the system!");
          } else {
            toast.error(res.data.message);
          }
          return; // Stop, do not close modal, do not reset form
        }

        toast.success("Account updated successfully");
        setIsModalVisible(false);
        form.resetFields();
        setEditingAccount(null);
        await refreshAllData();
      } else {
        // CREATE NEW ACCOUNT
        const accountData = {
          fullname: values.fullName?.trim(),
          username: values.username?.trim(),
          email: values.email?.trim(),
          phone: values.phone?.trim(),
          role: (values.role || "").toUpperCase(), // Luôn gửi role in hoa
          password: values.password?.trim(),
        };
        try {
          const res = await api.post("/admin/register", accountData);
          // Nếu backend trả về status 2xx thì luôn báo thành công
          if (res.status && res.status >= 200 && res.status < 300) {
            toast.success("Account created successfully");
            setIsModalVisible(false);
            form.resetFields();
            setEditingAccount(null);
            await refreshAllData();
            return;
          }
          // Nếu có message lỗi đặc biệt
          if (
            res.data?.message &&
            (res.data.message.toLowerCase().includes("phone") ||
              res.data.message.toLowerCase().includes("exist") ||
              res.data.message.toLowerCase().includes("email") ||
              res.data.message.toLowerCase().includes("username") ||
              res.data.message.toLowerCase().includes("vai trò") ||
              res.data.message.toLowerCase().includes("invalid role"))
          ) {
            if (res.data.message.toLowerCase().includes("phone")) {
              toast.error("Phone number already exists in the system!");
            } else if (res.data.message.toLowerCase().includes("email")) {
              toast.error("Email already exists in the system!");
            } else if (res.data.message.toLowerCase().includes("username")) {
              toast.error("Username already exists in the system!");
            } else if (
              res.data.message.toLowerCase().includes("vai trò") ||
              res.data.message.toLowerCase().includes("invalid role")
            ) {
              toast.error(
                "Invalid role. Please contact the administrator or check backend role validation."
              );
            } else {
              toast.error(res.data.message);
            }
            return;
          }
          // Nếu không có message lỗi đặc biệt nhưng status không thành công
          toast.error(res.data?.message || "Failed to create account");
        } catch (e) {
          let errorMessage = "Failed to create account";
          if (typeof e.response?.data === "string") {
            errorMessage = e.response.data;
          } else if (e.response?.data?.message) {
            errorMessage = e.response.data.message;
          } else if (e.response?.data?.data) {
            errorMessage = e.response.data.data;
          } else if (e.message) {
            errorMessage = e.message;
          }
          const lowerMsg = String(errorMessage).toLowerCase();
          if (
            (lowerMsg.includes("unique") && lowerMsg.includes("email")) ||
            (lowerMsg.includes("duplicate") && lowerMsg.includes("email")) ||
            (lowerMsg.includes("email") && lowerMsg.includes("constraint"))
          ) {
            toast.error("Email already exists in the system!");
          } else if (
            (lowerMsg.includes("unique") && lowerMsg.includes("phone")) ||
            (lowerMsg.includes("duplicate") && lowerMsg.includes("phone")) ||
            (lowerMsg.includes("phone") && lowerMsg.includes("constraint"))
          ) {
            toast.error("Phone number already exists in the system!");
          } else if (
            (lowerMsg.includes("unique") && lowerMsg.includes("username")) ||
            (lowerMsg.includes("duplicate") && lowerMsg.includes("username")) ||
            (lowerMsg.includes("username") && lowerMsg.includes("constraint"))
          ) {
            toast.error("Username already exists in the system!");
          } else if (
            lowerMsg.includes("vai trò") ||
            lowerMsg.includes("invalid role")
          ) {
            toast.error(
              "Invalid role. Please contact the administrator or check backend role validation."
            );
          } else if (e.response && e.response.status === 400) {
            toast.error(
              "Account may have been created, but the server returned an error. Please check the account list."
            );
          } else {
            toast.error(errorMessage);
          }
        }
      }
    } catch (e) {
      console.error("[handleFormSubmit] error:", e, e?.response);

      let errorMessage = "Failed";
      // Nếu là string, lấy trực tiếp
      if (typeof e.response?.data === "string") {
        errorMessage = e.response.data;
      }
      // Nếu có trường message
      else if (e.response?.data?.message) {
        errorMessage = e.response.data.message;
      }
      // Nếu có trường data (object)
      else if (e.response?.data?.data) {
        errorMessage = e.response.data.data;
      }
      // fallback
      else if (e.message) {
        errorMessage = e.message;
      }

      // Kiểm tra lỗi unique email (SQL/constraint)
      const lowerMsg = String(errorMessage).toLowerCase();
      if (
        (lowerMsg.includes("unique") && lowerMsg.includes("email")) ||
        (lowerMsg.includes("duplicate") && lowerMsg.includes("email")) ||
        (lowerMsg.includes("email") && lowerMsg.includes("constraint"))
      ) {
        toast.error("Email already exists in the system!");
      } else if (
        (lowerMsg.includes("unique") && lowerMsg.includes("phone")) ||
        (lowerMsg.includes("duplicate") && lowerMsg.includes("phone")) ||
        (lowerMsg.includes("phone") && lowerMsg.includes("constraint"))
      ) {
        toast.error("Phone number already exists in the system!");
      } else {
        toast.error(errorMessage);
      }
    }
  };
  /**
   * Filter accounts based on search criteria
   * Supports searching by multiple fields and filtering by role/status
   */
  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.username?.toLowerCase().includes(searchText.toLowerCase()) ||
      account.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      account.phone?.includes(searchText) ||
      account.fullName?.toLowerCase().includes(searchText.toLowerCase());

    const matchesRole =
      roleFilter === "" || roleFilter === "All" || account.role === roleFilter;
    const matchesStatus =
      statusFilter === "" || account.status === statusFilter;

    const result = matchesSearch && matchesRole && matchesStatus;
    if (!result) {
      // Log chi tiết filter nếu cần debug
      // console.log('Filtered out:', account, {matchesSearch, matchesRole, matchesStatus});
    }
    return result;
  });
  // console.log("Filtered accounts for table:", filteredAccounts); // Remove or comment out in production

  /**
   * Calculate statistics for dashboard cards
   * Combines API data with local calculations
   */
  const stats = {
    total: accounts.length,
    active: accounts.filter((acc) => acc.status === "ACTIVE").length,
    inactive: accounts.filter((acc) => acc.status === "INACTIVE").length,
    // Đếm customer không phân biệt hoa thường
    customers:
      customerStats.totalCustomers ||
      accounts.filter((acc) => String(acc.role).toUpperCase() === "CUSTOMER")
        .length,
    staff: accounts.filter((acc) =>
      ["STAFF", "MANAGER", "ADMIN"].includes(String(acc.role).toUpperCase())
    ).length,
    managers: accounts.filter(
      (acc) => String(acc.role).toUpperCase() === "MANAGER"
    ).length,
    customersWithActiveOrders: accountsWithActiveOrders.size,
    // Use API data if available, fallback to local calculation
    totalCustomersFromAPI:
      customerStats.totalCustomers ||
      accounts.filter((acc) => String(acc.role).toUpperCase() === "CUSTOMER")
        .length,
    activeCustomersFromAPI:
      customerStats.activeCustomers ||
      accounts.filter(
        (acc) =>
          String(acc.role).toUpperCase() === "CUSTOMER" &&
          acc.status === "ACTIVE"
      ).length,
  };

  /**
   * Table column configuration
   * Defines how data is displayed in the accounts table
   */
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      width: 70,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => (a.fullName || "").localeCompare(b.fullName || ""),
      render: (text) => text || "-",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => (
        <Space>
          <MailOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (text) => (
        <Space>
          <PhoneOutlined />
          {text || "N/A"}
        </Space>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        const roleUpper = role ? role.toUpperCase() : "";
        const colors = {
          ADMIN: "red",
          MANAGER: "purple",
          STAFF: "green",
          CUSTOMER: "blue",
        };
        // Hiển thị đúng màu theo role (không phân biệt hoa thường)
        return (
          <Tag color={colors[roleUpper] || "blue"}>
            {roleUpper.charAt(0) + roleUpper.slice(1).toLowerCase()}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        const color = status === "ACTIVE" ? "green" : "red";
        const hasActiveOrders =
          record.role === "CUSTOMER" && accountsWithActiveOrders.has(record.id);

        return (
          <Space direction="vertical" size="small">
            <Tag color={color}>{status}</Tag>
            {hasActiveOrders && (
              <Tag color="orange" icon="📋">
                Has Active Orders
              </Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space size="small">
          {/* Edit Button */}
          <Tooltip title="Edit Account">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>

          {/* Delete Button with Confirmation */}
          <Popconfirm
            title={
              <div>
                <div style={{ fontWeight: "bold", marginBottom: 4 }}>
                  Delete Account Confirmation
                </div>
                <div style={{ fontSize: "14px" }}>
                  Are you sure you want to delete this account?
                </div>
                <div style={{ fontSize: "12px", color: "#666", marginTop: 4 }}>
                  <strong>Username:</strong> {record.username}
                  <br />
                  <strong>Role:</strong> {record.role}
                  <br />
                  {record.role === "CUSTOMER" && (
                    <div style={{ color: "#faad14", marginTop: 4 }}>
                      <strong>⚠️ Warning:</strong> System will check for active
                      orders before deletion.
                    </div>
                  )}
                  <span
                    style={{
                      color: "#ff4d4f",
                      marginTop: 4,
                      display: "block",
                    }}>
                    This action cannot be undone.
                  </span>
                </div>
              </div>
            }
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, size: "small" }}
            cancelButtonProps={{ size: "small" }}
            placement="left"
            icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}>
            <Tooltip
              title={
                !canDeleteAccount(record).canDelete
                  ? canDeleteAccount(record).reason
                  : "Delete Account"
              }>
              <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
                loading={deletingAccounts.has(record.id)}
                disabled={!canDeleteAccount(record).canDelete}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      if (typeof autoTable !== "function") {
        toast.error(
          "Export PDF failed: autoTable is not a function. Please check your import or install jspdf-autotable."
        );
        return;
      }
      // Lấy dữ liệu từ filteredAccounts
      const tableColumn = [
        "ID",
        "Username",
        "Email",
        "Phone",
        "Role",
        "Status",
        "Created At",
      ];
      const tableRows = filteredAccounts.map((acc) => [
        acc.id,
        acc.username,
        acc.email,
        acc.phone,
        acc.role,
        acc.status,
        acc.createdAt ? new Date(acc.createdAt).toLocaleDateString() : "N/A",
      ]);
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        styles: { font: "helvetica", fontSize: 10 },
        headStyles: { fillColor: [22, 160, 133] },
        margin: { top: 20 },
      });
      doc.save("account-management.pdf");
      toast.success("PDF exported successfully!");
    } catch (err) {
      toast.error("PDF export failed: " + (err?.message || err));
      console.error("Export PDF error:", err);
    }
  };

  return (
    <div style={{ padding: "0 24px" }}>
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 16,
        }}>
        <Title level={2} style={{ margin: 0 }}>
          Account Management
        </Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={refreshAllData}
            loading={loading}>
            Refresh
          </Button>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            size="large"
            onClick={() => {
              setEditingAccount(null);
              form.resetFields();
              setIsModalVisible(true);
            }}>
            Create New Account
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExportPDF}
            size="large"
            type="default">
            Export PDF
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Accounts"
              value={stats.total}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Managers"
              value={stats.managers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Staff Members"
              value={stats.staff}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Customers"
              value={stats.customers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Additional Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Accounts"
              value={stats.active}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Inactive Accounts"
              value={stats.inactive}
              prefix={<LockOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Customers With Active Orders"
              value={stats.customersWithActiveOrders}
              prefix="📋"
              valueStyle={{ color: "#fa8c16" }}
              suffix={`/ ${stats.customers}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              backgroundColor: "#f6ffed",
              border: "1px solid #b7eb8f",
            }}>
            <Statistic
              valueStyle={{ color: "#389e0d" }}
              formatter={() => (
                <div style={{ fontSize: "14px" }}>
                  <div style={{ fontWeight: "bold", color: "#389e0d" }}>
                    🛡️Orders Protected
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Accounts with active orders cannot be deleted
                  </div>
                </div>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Filter Section */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} lg={10}>
            <Input
              placeholder="Search by name, email, phone, username..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={6} lg={7}>
            <Select
              placeholder="Filter by role"
              value={roleFilter}
              onChange={setRoleFilter}
              style={{ width: "100%" }}
              allowClear>
              <Option value="All">All Roles</Option>
              <Option value="ADMIN">Admin</Option>
              <Option value="MANAGER">Manager</Option>
              <Option value="STAFF">Staff</Option>
              <Option value="CUSTOMER">Customer</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6} lg={7}>
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
              allowClear>
              <Option value="ACTIVE">Active</Option>
              <Option value="INACTIVE">Inactive</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Accounts Table */}
      <Card>
        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredAccounts}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} accounts`,
          }}
          onChange={(paginationConfig) => {
            setPagination({
              current: paginationConfig.current,
              pageSize: paginationConfig.pageSize,
            });
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Create/Edit Account Modal */}
      <Modal
        title={editingAccount ? "Edit Account" : "Create New Account"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingAccount(null);
        }}
        footer={null}
        width={700}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{ status: true }}>
          {/* Full Name and Username Row (Username only for new accounts) */}
          <Row gutter={16}>
            <Col span={editingAccount ? 24 : 12}>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={
                  editingAccount
                    ? []
                    : [
                        { required: true, message: "Please enter full name" },
                        {
                          min: 2,
                          message: "Full name must be at least 2 characters",
                        },
                      ]
                }>
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter full name"
                />
              </Form.Item>
            </Col>
            {!editingAccount && (
              <Col span={12}>
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[
                    { required: true, message: "Please enter username" },
                    {
                      min: 3,
                      message: "Username must be at least 3 characters",
                    },
                    {
                      pattern: /^[a-zA-Z0-9_]+$/,
                      message:
                        "Username can only contain letters, numbers, and underscores",
                    },
                  ]}>
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Enter username"
                  />
                </Form.Item>
              </Col>
            )}
          </Row>

          {/* Editing Account Info Display */}
          {editingAccount && (
            <div
              style={{
                marginBottom: 16,
                padding: 16,
                backgroundColor: "#f0f2f5",
                borderRadius: 6,
              }}>
              <Text strong>Editing Account: </Text>
              <Text>
                {editingAccount.username}
                {editingAccount.fullName ? ` (${editingAccount.fullName})` : ""}
              </Text>
            </div>
          )}

          {/* Email and Phone Row */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter email" },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                ]}>
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Enter email address"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  { required: true, message: "Please enter phone number" },
                  {
                    pattern: /^\d{10,11}$/,
                    message: "Please enter a valid phone number (10-11 digits)",
                  },
                ]}>
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Enter phone number"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Password Field */}
          <Form.Item
            name="password"
            label={editingAccount ? "New Password (Optional)" : "Password"}
            rules={
              editingAccount
                ? [
                    {
                      min: 6,
                      message: "Password must be at least 6 characters",
                    },
                  ]
                : [
                    { required: true, message: "Please enter password" },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters",
                    },
                  ]
            }
            help={
              editingAccount
                ? "Leave empty to keep current password"
                : undefined
            }>
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={
                editingAccount
                  ? "Enter new password (optional)"
                  : "Enter password"
              }
            />
          </Form.Item>

          {/* Role and Status Row */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: "Please select a role" }]}>
                <Select placeholder="Select user role">
                  <Option value="ADMIN">Admin</Option>
                  <Option value="MANAGER">Manager</Option>
                  <Option value="STAFF">Staff</Option>
                  {editingAccount && <Option value="CUSTOMER">Customer</Option>}
                </Select>
              </Form.Item>
            </Col>
            {/* Only show status toggle when editing an account */}
            {editingAccount && (
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Account Status"
                  valuePropName="checked">
                  <Switch
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                  />
                </Form.Item>
              </Col>
            )}
          </Row>

          {/* Form Actions */}
          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space>
              <Button type="primary" htmlType="submit" size="large">
                {editingAccount ? "Update Account" : "Create Account"}
              </Button>
              <Button
                size="large"
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                  setEditingAccount(null);
                }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AccountManagement;

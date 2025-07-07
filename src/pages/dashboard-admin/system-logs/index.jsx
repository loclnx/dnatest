// Description: Inventory Management Dashboard for Admins
import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Space,
  Input,
  Typography,
} from "antd";
import {
  SearchOutlined,
  DownloadOutlined,
  ReloadOutlined,
  UserOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import api from "../../../configs/axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Title } = Typography;

const SystemLogs = () => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [exportRange, setExportRange] = useState("all");

  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // Fetch system logs
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/system-log");
      setLogs(response.data?.data || response.data || []);
    } catch (error) {
      toast.error(
        "Failed to fetch system logs: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Helper: Convert API timestamp array to JS Date
  const parseApiTimestamp = (ts) => {
    if (!Array.isArray(ts) || ts.length < 6) return null;
    // [year, month, day, hour, minute, second, nano]
    // JS Date: month is 0-based
    return new Date(
      ts[0],
      ts[1] - 1,
      ts[2],
      ts[3],
      ts[4],
      ts[5],
      Math.floor((ts[6] || 0) / 1e6)
    );
  };

  // Filter logs by search text
  const filteredLogs = logs.filter(
    (log) =>
      (log.username?.toLowerCase() || "").includes(searchText.toLowerCase()) ||
      (log.action?.toLowerCase() || "").includes(searchText.toLowerCase()) ||
      (log.ipAddress?.toLowerCase() || "").includes(searchText.toLowerCase())
  );

  // Statistics
  const stats = {
    total: logs.length,
    login: logs.filter((l) => l.action?.toLowerCase().includes("login")).length,
    logout: logs.filter((l) => l.action?.toLowerCase().includes("logout"))
      .length,
    register: logs.filter((l) => l.action?.toLowerCase().includes("register"))
      .length,
    uniqueUsers: new Set(logs.map((l) => l.username)).size,
  };

  // Helper to filter logs by range (using parsed timestamp)
  const getLogsByRange = (range) => {
    const now = new Date();
    if (range === "today") {
      return filteredLogs.filter((log) => {
        const logDate = parseApiTimestamp(log.timestamp);
        if (!logDate) return false;
        return (
          logDate.getDate() === now.getDate() &&
          logDate.getMonth() === now.getMonth() &&
          logDate.getFullYear() === now.getFullYear()
        );
      });
    } else if (range === "week") {
      // Get first day of week (Monday)
      const firstDayOfWeek = new Date(now);
      firstDayOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
      firstDayOfWeek.setHours(0, 0, 0, 0);
      const lastDayOfWeek = new Date(firstDayOfWeek);
      lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
      lastDayOfWeek.setHours(23, 59, 59, 999);
      return filteredLogs.filter((log) => {
        const logDate = parseApiTimestamp(log.timestamp);
        if (!logDate) return false;
        return logDate >= firstDayOfWeek && logDate <= lastDayOfWeek;
      });
    } else if (range === "month") {
      return filteredLogs.filter((log) => {
        const logDate = parseApiTimestamp(log.timestamp);
        if (!logDate) return false;
        return (
          logDate.getMonth() === now.getMonth() &&
          logDate.getFullYear() === now.getFullYear()
        );
      });
    }
    // Default: all
    return filteredLogs;
  };

  const handleMenuClick = (e) => {
    setExportRange(e.key);
    handleExportPDF(e.key);
  };

  // Removed exportMenu (no longer needed with new Dropdown API)

  // Export PDF function
  const handleExportPDF = (range = exportRange) => {
    try {
      const doc = new jsPDF();
      let title = "System Logs Report";
      if (range === "today") title += " - Today";
      else if (range === "week") title += " - This Week";
      else if (range === "month") title += " - This Month";
      else title += " - All Logs";
      doc.text(title, 14, 16);
      const tableColumn = ["ID", "User", "Action", "IP Address", "Timestamp"];
      const logsToExport = getLogsByRange(range);
      const tableRows = logsToExport.map((log) => [
        log.id,
        log.username,
        log.action,
        log.ipAddress,
        log.timestamp
          ? parseApiTimestamp(log.timestamp)?.toLocaleString() || "N/A"
          : "N/A",
      ]);
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 22,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] },
      });
      doc.save(`system-logs-${range}.pdf`);
      toast.success("PDF exported successfully!");
    } catch (err) {
      toast.error("PDF export failed: " + (err?.message || err));
      console.error("Export PDF error:", err);
    }
  };

  // Handle table change (pagination)
  const handleTableChange = (pag) => {
    setPagination({
      ...pagination,
      current: pag.current,
      pageSize: pag.pageSize,
    });
  };

  // Table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 120,
    },
    {
      title: "User",
      dataIndex: "username",
      key: "username",
      render: (text) => (
        <Space>
          <UserOutlined />
          {text || "N/A"}
        </Space>
      ),
      width: 180,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 180,
    },
    {
      title: "IP Address",
      dataIndex: "ipAddress",
      key: "ipAddress",
      width: 160,
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp) => {
        const date = parseApiTimestamp(timestamp);
        return date ? date.toLocaleString() : "N/A";
      },
      sorter: (a, b) => {
        const dateA = parseApiTimestamp(a.timestamp)?.getTime() || 0;
        const dateB = parseApiTimestamp(b.timestamp)?.getTime() || 0;
        return dateA - dateB;
      },
      width: 180,
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}>
        <Title level={2}>System Logs & Monitoring</Title>
        <Space>
          <Dropdown
            menu={{
              items: [
                { key: "today", label: "Today", onClick: handleMenuClick },
                { key: "week", label: "This Week", onClick: handleMenuClick },
                { key: "month", label: "This Month", onClick: handleMenuClick },
                { key: "all", label: "All Logs", onClick: handleMenuClick },
              ],
            }}
            trigger={["click"]}>
            <Button icon={<DownloadOutlined />}>
              Export <DownOutlined />
            </Button>
          </Dropdown>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={fetchLogs}
            loading={loading}>
            Refresh
          </Button>
        </Space>
      </div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Logs"
              value={stats.total}
              prefix={<HistoryOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Login Events"
              value={stats.login}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Logout Events"
              value={stats.logout}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Unique Users"
              value={stats.uniqueUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>
      <Card>
        <Input
          placeholder="Search by username, action, IP..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ marginBottom: 16, maxWidth: 400 }}
        />
        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredLogs}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ["5", "10", "20", "50", "100"],
            total: filteredLogs.length,
          }}
          scroll={{ x: 900 }}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
};

export default SystemLogs;

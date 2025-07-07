import React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Spin,
  Button,
  Divider,
} from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  FileDoneOutlined,
  LoadingOutlined,
  ReloadOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
} from "recharts";
import api from "../../../configs/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title } = Typography;

const ManagerOverviewPage = () => {
  const [loading, setLoading] = useState(true);
  const [overviewData, setOverviewData] = useState({
    totalTestsPerformed: 0,
    staffReportsPending: 0,
    totalCustomers: 0,
  });
  // eslint-disable-next-line no-unused-vars
  const [bookingsData, setBookingsData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [staffData, setStaffData] = useState([]);
  const [chartData, setChartData] = useState({
    performanceMetrics: [],
    testStatusDistribution: [],
    staffWorkload: [],
    weeklyProgress: [],
    staffEfficiency: [],
  });
  // const [kitTransactions, setKitTransactions] = useState([]);
  const [assignedBookings, setAssignedBookings] = useState([]);

  // Generate chart data for 2 charts: Performance Metrics & Test Status Distribution
  const generateChartData = useCallback(() => {
    // 1. Weekly Performance Metrics chart: mỗi tuần là số lượng booking thực tế theo tuần (dựa vào bookingAssigned)
    // Giả sử booking có trường createdAt dạng ISO date
    const weekLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
    const now = new Date();
    // Lấy ngày đầu tháng hiện tại
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // Tạo mốc tuần
    const weekRanges = Array.from({ length: 4 }, (_, i) => {
      const start = new Date(firstDayOfMonth);
      start.setDate(start.getDate() + i * 7);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return { start, end };
    });

    // Đếm số lượng booking completed và pending theo tuần
    const performanceMetrics = weekRanges.map((range, idx) => {
      const bookingsInWeek = assignedBookings.filter((b) => {
        if (!b.createdAt) return false;
        const created = new Date(b.createdAt);
        return created >= range.start && created <= range.end;
      });
      const performed = bookingsInWeek.filter(
        (b) => b.status === "Completed"
      ).length;
      const pending = bookingsInWeek.filter(
        (b) => b.status !== "Completed"
      ).length;
      const total = performed + pending;
      return {
        period: weekLabels[idx],
        performed,
        pending,
        efficiency: total ? Math.round((performed / total) * 100) : 0,
      };
    });

    // 2. Test Status Distribution chart: đếm số lượng booking theo status thực tế
    const statusCountMap = {};
    assignedBookings.forEach((b) => {
      if (!statusCountMap[b.status]) statusCountMap[b.status] = 0;
      statusCountMap[b.status] += 1;
    });
    const statusColors = [
      "#52c41a",
      "#faad14",
      "#ff4d4f",
      "#1890ff",
      "#722ed1",
      "#13c2c2",
      "#eb2f96",
      "#b37feb",
      "#fa8c16",
      "#a0d911",
    ];
    const totalBookings = assignedBookings.length;
    const testStatusDistribution = Object.entries(statusCountMap).map(
      ([status, value], idx) => ({
        name: status,
        value,
        color: statusColors[idx % statusColors.length],
        percentage: totalBookings
          ? Math.round((value / totalBookings) * 100)
          : 0,
      })
    );

    setChartData({
      performanceMetrics,
      testStatusDistribution,
    });
  }, [assignedBookings]);

  const fetchManagerOverviewData = useCallback(async () => {
    setLoading(true);
    try {
      // Gọi song song 2 API mới
      const [kitRes, assignedRes] = await Promise.all([
        api.get("/manager/kit-transaction"),
        api.get("/manager/booking-assigned"),
      ]);
      const kitList = kitRes.data?.data || kitRes.data || [];
      const assignedList = assignedRes.data?.data || assignedRes.data || [];
      // setKitTransactions(kitList);
      setAssignedBookings(assignedList);

      // Tổng số kit đã nhận
      const kitsReceived = kitList.filter((k) => k.received === true).length;
      // Tổng số booking đã assign
      const totalAssigned = assignedList.length;
      // Tổng số booking completed
      const totalCompleted = assignedList.filter(
        (b) => b.status === "Completed"
      ).length;
      // Tổng số booking pending
      const totalPending = assignedList.filter(
        (b) => b.status !== "Completed"
      ).length;
      // Số staff unique
      const staffNames = Array.from(
        new Set(assignedList.map((b) => b.staffName))
      );
      const staffAvailable = staffNames.length;

      setOverviewData({
        totalTestsPerformed: totalCompleted,
        staffReportsPending: totalPending,
        totalCustomers: staffAvailable,
        kitsReceived,
        totalAssigned,
      });
      setBookingsData(assignedList);
      setStaffData(staffNames);
    } catch (error) {
      toast.error("Failed to fetch manager overview data.");
      console.error("Error fetching manager overview data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate chart data when overview data changes
  useEffect(() => {
    if (!loading) {
      generateChartData();
    }
  }, [generateChartData, loading]);

  useEffect(() => {
    fetchManagerOverviewData();
  }, [fetchManagerOverviewData]);

  const COLORS = ["#52c41a", "#faad14", "#ff4d4f", "#1890ff", "#722ed1"];

  return (
    <div style={{ padding: "0 24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}>
        <Title level={2} style={{ marginBottom: 0 }}>
          Manager Dashboard Overview
        </Title>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={fetchManagerOverviewData}
          loading={loading}>
          Refresh Data
        </Button>
      </div>

      <ToastContainer />

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          <p style={{ marginTop: 20 }}>Loading overview data...</p>
        </div>
      ) : (
        <div>
          {/* Enhanced Stats Cards */}
          <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            <Col xs={24} sm={12} lg={8}>
              <Card
                style={{
                  borderRadius: 16,
                  minHeight: 140,
                  boxShadow: "0 4px 20px rgba(24, 144, 255, 0.1)",
                  border: "1px solid #e6f7ff",
                }}>
                <Statistic
                  title={
                    <span
                      style={{ fontWeight: 600, fontSize: 16, color: "#666" }}>
                      Total Tests Performed
                    </span>
                  }
                  value={overviewData.totalTestsPerformed}
                  prefix={
                    <DashboardOutlined
                      style={{ color: "#1890ff", fontSize: 24 }}
                    />
                  }
                  valueStyle={{
                    color: "#1890ff",
                    fontSize: 32,
                    fontWeight: 700,
                  }}
                />
                <div style={{ marginTop: 8, fontSize: 12, color: "#999" }}>
                  Completion Rate:{" "}
                  {Math.round(
                    (overviewData.totalTestsPerformed /
                      (overviewData.totalTestsPerformed +
                        overviewData.staffReportsPending)) *
                      100
                  ) || 0}
                  %
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card
                style={{
                  borderRadius: 16,
                  minHeight: 140,
                  boxShadow: "0 4px 20px rgba(250, 173, 20, 0.1)",
                  border: "1px solid #fffbe6",
                }}>
                <Statistic
                  title={
                    <span
                      style={{ fontWeight: 600, fontSize: 16, color: "#666" }}>
                      Tests Pending
                    </span>
                  }
                  value={overviewData.staffReportsPending}
                  prefix={
                    <FileDoneOutlined
                      style={{ color: "#faad14", fontSize: 24 }}
                    />
                  }
                  valueStyle={{
                    color: "#faad14",
                    fontSize: 32,
                    fontWeight: 700,
                  }}
                />
                <div style={{ marginTop: 8, fontSize: 12, color: "#999" }}>
                  Requires immediate attention
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card
                style={{
                  borderRadius: 16,
                  minHeight: 140,
                  boxShadow: "0 4px 20px rgba(82, 196, 26, 0.1)",
                  border: "1px solid #f6ffed",
                }}>
                <Statistic
                  title={
                    <span
                      style={{ fontWeight: 600, fontSize: 16, color: "#666" }}>
                      Active Staff
                    </span>
                  }
                  value={overviewData.totalCustomers}
                  prefix={
                    <TeamOutlined style={{ color: "#52c41a", fontSize: 24 }} />
                  }
                  valueStyle={{
                    color: "#52c41a",
                    fontSize: 32,
                    fontWeight: 700,
                  }}
                />
                <div style={{ marginTop: 8, fontSize: 12, color: "#999" }}>
                  Available for assignments
                </div>
              </Card>
            </Col>
          </Row>

          {/* Charts Section */}
          <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            {/* Performance Metrics Chart */}
            <Col xs={24} lg={16}>
              <Card
                title={
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <BarChartOutlined style={{ color: "#1890ff" }} />
                    <span style={{ fontWeight: 600, fontSize: 18 }}>
                      Weekly Performance Metrics
                    </span>
                  </div>
                }
                style={{
                  borderRadius: 16,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                }}>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={chartData.performanceMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="period"
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: "#d9d9d9" }}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: "#d9d9d9" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #d9d9d9",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="performed"
                      fill="#52c41a"
                      name="Tests Performed"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="pending"
                      fill="#faad14"
                      name="Tests Pending"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            {/* Test Status Distribution */}
            <Col xs={24} lg={8}>
              <Card
                title={
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <PieChartOutlined style={{ color: "#52c41a" }} />
                    <span style={{ fontWeight: 600, fontSize: 18 }}>
                      Test Status Distribution
                    </span>
                  </div>
                }
                style={{
                  borderRadius: 16,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                }}>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={chartData.testStatusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value">
                      {chartData.testStatusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} tests`, name]}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #d9d9d9",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          {/* Đã xóa các chart: Staff Workload Distribution, Efficiency Metrics, Weekly Progress vs Target */}
        </div>
      )}
    </div>
  );
};

export default ManagerOverviewPage;

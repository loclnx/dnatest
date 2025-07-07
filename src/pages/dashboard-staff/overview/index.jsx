import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Spin,
  Button,
  Divider,
  Progress,
} from "antd";
import {
  CalendarOutlined,
  ContainerOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
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
  ComposedChart,
} from "recharts";
import api from "../../../configs/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title } = Typography;

// Định nghĩa các trạng thái booking và màu sắc riêng biệt
const STATUS_COLORS = {
  "Waiting confirmed": "#bdbdbd", // xám nhạt
  "Booking confirmed": "#40a9ff", // xanh dương nhạt
  "Awaiting Sample": "#faad14", // vàng
  "In Progress": "#1890ff", // xanh dương
  Ready: "#722ed1", // tím
  "Pending Payment": "#ff4d4f", // đỏ
  Completed: "#52c41a", // xanh lá
  Cancel: "#8c8c8c", // xám đậm
};
const STATUS_ORDER = [
  "Waiting confirmed",
  "Booking confirmed",
  "Awaiting Sample",
  "In Progress",
  "Ready",
  "Pending Payment",
  "Completed",
  "Cancel",
];

const StaffOverviewPage = () => {
  const [loading, setLoading] = useState(true);
  const [overviewData, setOverviewData] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    appointmentsToday: 0,
    totalAppointmentFinished: 0,
    orderStatusDistribution: [],
    dailyTasks: [],
    timeRangeStats: [],
  });

  // Get staffID from Redux store
  const currentUser = useSelector((state) => state.user?.currentUser);
  const staffID = currentUser?.staff?.staffID || currentUser?.staffID;

  // Lấy dữ liệu thực tế từ API và phân tích cho chart
  const fetchStaffOverviewData = useCallback(async () => {
    if (!staffID) {
      toast.error("Staff ID not found. Please log in again.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(`/staff/my-assignment/${staffID}`);
      const assignments = response.data || [];
      // Tổng số booking
      const totalAppointments = assignments.length;
      const pendingAppointments = assignments.filter(
        (a) =>
          (a.status || "").trim().toLowerCase() ===
          "awaiting sample".toLowerCase()
      ).length;
      // Số booking hôm nay
      const today = new Date().toISOString().slice(0, 10);
      const appointmentsToday = assignments.filter(
        (a) => a.date === today
      ).length;
      // Số booking đã hoàn thành
      const totalAppointmentFinished = assignments.filter(
        (a) =>
          (a.status || "").trim().toLowerCase() === "completed".toLowerCase()
      ).length;
      // Phân bố trạng thái: chuẩn hóa status, gom nhóm đúng tên, không trùng lặp
      const statusCounts = {};
      assignments.forEach((a) => {
        let status = (a.status || "Unknown").trim();
        // Chuẩn hóa về đúng tên status (case-insensitive)
        const found = STATUS_ORDER.find(
          (std) => std.toLowerCase() === status.toLowerCase()
        );
        status = found || status;
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      // Đảm bảo đủ các status, kể cả khi không có dữ liệu
      const orderStatusDistribution = STATUS_ORDER.map((name) => ({
        name,
        value: statusCounts[name] || 0,
        color: STATUS_COLORS[name],
      })).filter((item) => item.value > 0); // chỉ hiển thị status có dữ liệu
      // Thống kê theo timeRange (sáng, chiều, tối)
      const timeRangeStats = [
        { period: "Morning", count: 0 },
        { period: "Afternoon", count: 0 },
        { period: "Evening", count: 0 },
      ];
      assignments.forEach((a) => {
        if (!a.timeRange) return;
        const hour = parseInt(a.timeRange.split(":")[0]);
        if (hour < 12) timeRangeStats[0].count++;
        else if (hour < 18) timeRangeStats[1].count++;
        else timeRangeStats[2].count++;
      });
      // Task summary
      const dailyTasks = [
        { name: "Total Assignments", count: totalAppointments },
        { name: "Pending Samples", count: pendingAppointments },
        { name: "Appointments Today", count: appointmentsToday },
        { name: "Finished", count: totalAppointmentFinished },
      ];
      setOverviewData({
        totalAppointments,
        pendingAppointments,
        appointmentsToday,
        totalAppointmentFinished,
        orderStatusDistribution:
          orderStatusDistribution.length > 0
            ? orderStatusDistribution
            : [{ name: "No Data", value: 1, color: "#d9d9d9" }],
        dailyTasks,
        timeRangeStats,
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch staff assignment data."
      );
      setOverviewData({
        totalAppointments: 0,
        pendingAppointments: 0,
        appointmentsToday: 0,
        totalAppointmentFinished: 0,
        orderStatusDistribution: [
          { name: "No Data", value: 1, color: "#d9d9d9" },
        ],
        dailyTasks: [
          { name: "Total Assignments", count: 0 },
          { name: "Pending Samples", count: 0 },
          { name: "Appointments Today", count: 0 },
          { name: "Finished", count: 0 },
        ],
        timeRangeStats: [
          { period: "Morning", count: 0 },
          { period: "Afternoon", count: 0 },
          { period: "Evening", count: 0 },
        ],
      });
    } finally {
      setLoading(false);
    }
  }, [staffID]);

  useEffect(() => {
    fetchStaffOverviewData();
  }, [fetchStaffOverviewData]);

  const COLORS = ["#52c41a", "#faad14", "#1890ff", "#ff4d4f", "#722ed1"];
  const completionPercentage = Math.round(
    (overviewData.totalAppointmentFinished /
      Math.max(overviewData.totalAppointments, 1)) *
      100
  );

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
          Staff Dashboard Overview
        </Title>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={fetchStaffOverviewData}
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
        <>
          {/* Stats Cards */}
          <div style={{ display: "flex", gap: 24, marginBottom: 32 }}>
            {[
              "Total Appointments",
              "Pending Appointments",
              "Appointments Today",
              "Completed Tasks",
            ].map((title, idx) => (
              <div key={title} style={{ flex: 1, minWidth: 0 }}>
                {(() => {
                  if (idx === 0)
                    return (
                      <Card
                        style={{
                          borderRadius: 16,
                          minHeight: 140,
                          boxShadow: "0 4px 20px rgba(24, 144, 255, 0.1)",
                          border: "1px solid #e6f7ff",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}>
                        <Statistic
                          title={
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: 16,
                                color: "#666",
                              }}>
                              Total Appointments
                            </span>
                          }
                          value={overviewData.totalAppointments}
                          prefix={
                            <CalendarOutlined
                              style={{ color: "#1890ff", fontSize: 24 }}
                            />
                          }
                          valueStyle={{
                            color: "#1890ff",
                            fontSize: 32,
                            fontWeight: 700,
                          }}
                        />
                        <div style={{ marginTop: 8 }}>
                          <Progress
                            percent={completionPercentage}
                            size="small"
                            strokeColor="#1890ff"
                            showInfo={false}
                          />
                          <div
                            style={{
                              fontSize: 12,
                              color: "#999",
                              marginTop: 4,
                            }}>
                            {completionPercentage}% completed
                          </div>
                        </div>
                      </Card>
                    );
                  if (idx === 1)
                    return (
                      <Card
                        style={{
                          borderRadius: 16,
                          minHeight: 140,
                          boxShadow: "0 4px 20px rgba(250, 173, 20, 0.1)",
                          border: "1px solid #fffbe6",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}>
                        <Statistic
                          title={
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: 16,
                                color: "#666",
                              }}>
                              Pending Appointments
                            </span>
                          }
                          value={overviewData.pendingAppointments}
                          prefix={
                            <ClockCircleOutlined
                              style={{ color: "#faad14", fontSize: 24 }}
                            />
                          }
                          valueStyle={{
                            color: "#faad14",
                            fontSize: 32,
                            fontWeight: 700,
                          }}
                        />
                        <div
                          style={{ marginTop: 8, fontSize: 12, color: "#999" }}>
                          Awaiting sample
                        </div>
                      </Card>
                    );
                  if (idx === 2)
                    return (
                      <Card
                        style={{
                          borderRadius: 16,
                          minHeight: 140,
                          boxShadow: "0 4px 20px rgba(82, 196, 26, 0.1)",
                          border: "1px solid #f6ffed",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}>
                        <Statistic
                          title={
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: 16,
                                color: "#666",
                              }}>
                              Appointments Today
                            </span>
                          }
                          value={overviewData.appointmentsToday}
                          prefix={
                            <CalendarOutlined
                              style={{ color: "#52c41a", fontSize: 24 }}
                            />
                          }
                          valueStyle={{
                            color: "#52c41a",
                            fontSize: 32,
                            fontWeight: 700,
                          }}
                        />
                        <div
                          style={{ marginTop: 8, fontSize: 12, color: "#999" }}>
                          Today
                        </div>
                      </Card>
                    );
                  if (idx === 3)
                    return (
                      <Card
                        style={{
                          borderRadius: 16,
                          minHeight: 140,
                          boxShadow: "0 4px 20px rgba(82, 196, 26, 0.1)",
                          border: "1px solid #f6ffed",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}>
                        <Statistic
                          title={
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: 16,
                                color: "#666",
                              }}>
                              Completed Tasks
                            </span>
                          }
                          value={overviewData.totalAppointmentFinished}
                          prefix={
                            <TrophyOutlined
                              style={{ color: "#52c41a", fontSize: 24 }}
                            />
                          }
                          valueStyle={{
                            color: "#52c41a",
                            fontSize: 32,
                            fontWeight: 700,
                          }}
                        />
                        <div
                          style={{ marginTop: 8, fontSize: 12, color: "#999" }}>
                          Successfully finished
                        </div>
                      </Card>
                    );
                })()}
              </div>
            ))}
          </div>
          {/* Chart: Assignment Status Distribution */}
          <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            <Col xs={24} lg={12} style={{ minWidth: 0 }}>
              <Card
                title={
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <PieChartOutlined style={{ color: "#722ed1" }} />
                    <span style={{ fontWeight: 600, fontSize: 18 }}>
                      Assignment Status Distribution
                    </span>
                  </div>
                }
                style={{
                  borderRadius: 16,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                }}>
                <ResponsiveContainer width="100%" height={320} minWidth={0}>
                  <PieChart>
                    <Pie
                      data={overviewData.orderStatusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value">
                      {overviewData.orderStatusDistribution.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color || COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [
                        `${value} assignments`,
                        name,
                      ]}
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
            {/* Chart: Booking theo timeRange (sáng, chiều, tối) */}
            <Col xs={24} lg={12} style={{ minWidth: 0 }}>
              <Card
                title={
                  <div style={{ fontWeight: 600, fontSize: 18 }}>
                    Booking by Time Period
                  </div>
                }
                style={{
                  borderRadius: 16,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                }}>
                <ResponsiveContainer width="100%" height={320} minWidth={0}>
                  <BarChart
                    data={overviewData.timeRangeStats}
                    layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis
                      dataKey="period"
                      type="category"
                      tick={{ fontSize: 12 }}
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #d9d9d9",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar dataKey="count" fill="#1890ff" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default StaffOverviewPage;

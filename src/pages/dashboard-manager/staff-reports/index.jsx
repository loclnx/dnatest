import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Tabs,
  Table,
  Button,
  Space,
  Input,
  Typography,
  Form,
  Select,
  DatePicker,
  Card,
  Tag,
  Modal,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  EditOutlined,
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ViewReports = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [unassignedBookings, setUnassignedBookings] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [activeTab, setActiveTab] = useState("assign");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [staffFilter, setStaffFilter] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const { managerID } = useParams();

  // Assign Staff Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [assignLoading, setAssignLoading] = useState(false);

  // Pagination states
  const [allPagination, setAllPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [assignPagination, setAssignPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // --- Data Fetching Functions ---

  const fetchUnassignedBookings = useCallback(async () => {
    if (!managerID) return;
    setLoading(true);
    try {
      const response = await api.get(
        `/manager/unassigned-bookings/${managerID}`
      );
      setUnassignedBookings(response.data?.data || response.data || []);
    } catch (error) {
      toast.error(
        "Failed to fetch unassigned bookings: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  }, [managerID]);

  const fetchAllReports = useCallback(async () => {
    if (!managerID) return;
    setLoading(true);
    try {
      const response = await api.get(`/manager/report/${managerID}`);
      const fetchedData = response.data?.data || response.data || [];
      setReports(fetchedData);

      // Dynamically generate staff list from all reports
      const uniqueStaff = Array.from(
        new Map(
          fetchedData
            .filter((r) => r.staffId && r.staffName)
            .map((r) => [r.staffId, { id: r.staffId, name: r.staffName }])
        ).values()
      );
      setStaffList(uniqueStaff);
    } catch (error) {
      toast.error(
        "Failed to fetch all reports: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  }, [managerID]);

  useEffect(() => {
    if (activeTab === "assign") {
      fetchUnassignedBookings();
    } else if (activeTab === "all") {
      fetchAllReports();
    }
  }, [activeTab, fetchUnassignedBookings, fetchAllReports]);

  // --- Staff Assignment Functions ---

  const showAssignModal = (record) => {
    setSelectedBooking(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedBooking(null);
    setSelectedStaff(null);
  };

  const handleAssignStaff = async () => {
    if (!selectedBooking || !selectedStaff) {
      toast.warn("Please select a staff member.");
      return;
    }
    setAssignLoading(true);
    try {
      await api.patch(`/manager/assign-staff/${selectedBooking.bookingId}`, {
        staffId: selectedStaff,
      });
      toast.success(
        `Successfully assigned staff to booking ${selectedBooking.bookingId}`
      );
      setIsModalVisible(false);
      setSelectedBooking(null);
      setSelectedStaff(null);
      // Refresh unassigned bookings list
      fetchUnassignedBookings();
    } catch (error) {
      toast.error(
        "Failed to assign staff: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setAssignLoading(false);
    }
  };

  // --- PDF Export Functions ---

  const handleExportPDF = (data, title, filename) => {
    try {
      if (!jsPDF || !jsPDF.prototype.autoTable) {
        toast.error("jsPDF autoTable plugin is not available.");
        return;
      }

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(title, 14, 20);

      const tableColumns = [
        "Report ID",
        "Staff Name",
        "Booking ID",
        "Appointment Time",
        "Status",
        "Note",
      ];

      const tableRows = data.map((row) => [
        row.id || "-",
        row.staffName || "N/A",
        row.bookingId || "-",
        row.appointmentTime
          ? dayjs(row.appointmentTime).format("HH:mm DD/MM/YYYY")
          : "-",
        row.status || "-",
        row.note || "-",
      ]);

      doc.autoTable({
        head: [tableColumns],
        body: tableRows,
        startY: 30,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [22, 119, 255] },
      });

      doc.save(filename);
      toast.success("PDF exported successfully!");
    } catch (error) {
      toast.error("Failed to export PDF: " + error.message);
    }
  };

  // --- Table Column Definitions ---

  const baseReportColumns = [
    {
      title: "Report ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => (a.id || "").localeCompare(b.id || ""),
      width: 100,
    },
    {
      title: "Staff Name",
      dataIndex: "staffName",
      key: "staffName",
      sorter: (a, b) => (a.staffName || "").localeCompare(b.staffName || ""),
      render: (name) => name || <Tag color="volcano">Unassigned</Tag>,
      width: 120,
    },
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
      render: (bookingId) => bookingId || "-",
      width: 100,
    },
    {
      title: "Appointment Time",
      dataIndex: "appointmentTime",
      key: "appointmentTime",
      render: (time) => (time ? dayjs(time).format("HH:mm DD/MM/YYYY") : "-"),
      sorter: (a, b) =>
        dayjs(a.appointmentTime).unix() - dayjs(b.appointmentTime).unix(),
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        let icon = null;
        if (status === "Completed" || status === "Resolved") {
          color = "green";
          icon = <CheckCircleOutlined />;
        }
        if (status === "Pending") {
          color = "orange";
          icon = <ClockCircleOutlined />;
        }
        if (status === "Delay") {
          color = "orange";
          icon = <ClockCircleOutlined />;
        }
        if (status === "Cancel" || status === "Rejected") {
          color = "red";
          icon = <CloseCircleOutlined />;
        }
        if (status === "Approved") {
          color = "blue";
          icon = <CheckCircleOutlined />;
        }
        return (
          <Tag color={color} icon={icon}>
            {status}
          </Tag>
        );
      },
      width: 100,
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (note) => note || "-",
      ellipsis: true,
    },
  ];

  const allReportColumns = [
    ...baseReportColumns,
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      width: 120,
    },
  ];

  const assignBookingColumns = [
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
      width: 100,
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      width: 150,
    },
    {
      title: "Appointment Time",
      dataIndex: "appointmentTime",
      key: "appointmentTime",
      render: (time) => (time ? dayjs(time).format("HH:mm DD/MM/YYYY") : "-"),
      sorter: (a, b) =>
        dayjs(a.appointmentTime).unix() - dayjs(b.appointmentTime).unix(),
      width: 180,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: () => <Tag color="volcano">Unassigned</Tag>,
      width: 120,
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Button
          icon={<UserAddOutlined />}
          onClick={() => showAssignModal(record)}
          type="primary"
          size="small">
          Assign Staff
        </Button>
      ),
    },
  ];

  // --- Tab Items ---
  const tabItems = [
    {
      key: "assign",
      label: (
        <span>
          <UserAddOutlined style={{ marginRight: 8 }} />
          Assign Staff
        </span>
      ),
      children: (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}>
            <Title level={3} style={{ margin: 0 }}>
              Bookings Awaiting Assignment ({unassignedBookings.length})
            </Title>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchUnassignedBookings}
              loading={loading}>
              Refresh
            </Button>
          </div>
          <Card>
            <Table
              loading={loading}
              columns={assignBookingColumns}
              dataSource={unassignedBookings}
              rowKey="bookingId"
              pagination={{
                ...assignPagination,
                showSizeChanger: true,
                pageSizeOptions: [5, 10, 20, 50, 100],
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} bookings`,
                onShowSizeChange: (current, size) =>
                  setAssignPagination({ current: 1, pageSize: size }),
                onChange: (page, pageSize) =>
                  setAssignPagination({ current: page, pageSize: pageSize }),
              }}
              locale={{
                emptyText: "Hiện tại chưa có booking nào cần phân công",
              }}
              scroll={{ x: 800 }}
            />
          </Card>
        </>
      ),
    },
    {
      key: "all",
      label: (
        <span>
          <FileTextOutlined style={{ marginRight: 8 }} />
          All Reports
        </span>
      ),
      children: (
        <>
          {/* Filter Controls */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={8}>
              <Input
                placeholder="Search by Report ID, Booking ID, Staff Name..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col span={4}>
              <Select
                placeholder="Filter by Status"
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                style={{ width: "100%" }}
                allowClear>
                <Option value="Pending">Pending</Option>
                <Option value="Approved">Approved</Option>
                <Option value="Resolved">Resolved</Option>
                <Option value="Rejected">Rejected</Option>
              </Select>
            </Col>
            <Col span={4}>
              <Select
                placeholder="Filter by Staff"
                value={staffFilter}
                onChange={(value) => setStaffFilter(value)}
                style={{ width: "100%" }}
                allowClear
                showSearch>
                {staffList.map((staff) => (
                  <Option key={staff.id} value={staff.id}>
                    {staff.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <RangePicker
                style={{ width: "100%" }}
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
              />
            </Col>
          </Row>
          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}>
            <Title level={3} style={{ margin: 0 }}>
              All Staff Reports ({reports.length})
            </Title>
            <Space>
              <Button
                icon={<DownloadOutlined />}
                onClick={() =>
                  handleExportPDF(
                    reports,
                    "All Staff Reports",
                    "all_reports.pdf"
                  )
                }
                style={{
                  background: "#1677ff",
                  color: "#fff",
                  border: "none",
                }}>
                Export PDF
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchAllReports}
                loading={loading}>
                Refresh
              </Button>
            </Space>
          </div>
          <Card>
            <Table
              loading={loading}
              columns={allReportColumns}
              dataSource={reports}
              rowKey="id"
              pagination={{
                ...allPagination,
                showSizeChanger: true,
                pageSizeOptions: [5, 10, 20, 50, 100],
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} reports`,
                onShowSizeChange: (current, size) =>
                  setAllPagination({ current: 1, pageSize: size }),
                onChange: (page, pageSize) =>
                  setAllPagination({ current: page, pageSize: pageSize }),
              }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "0 24px" }}>
      <Title level={2} style={{ margin: 0, marginBottom: 24 }}>
        Staff Reports Management
      </Title>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        items={tabItems}
      />

      {/* Assign Staff Modal */}
      <Modal
        title={`Assign Staff to Booking #${selectedBooking?.bookingId}`}
        visible={isModalVisible}
        onOk={handleAssignStaff}
        onCancel={handleCancel}
        confirmLoading={assignLoading}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={assignLoading}
            onClick={handleAssignStaff}>
            Assign
          </Button>,
        ]}>
        <p>
          <strong>Customer:</strong> {selectedBooking?.customerName}
        </p>
        <p>
          <strong>Appointment:</strong>{" "}
          {selectedBooking?.appointmentTime
            ? dayjs(selectedBooking.appointmentTime).format("HH:mm DD/MM/YYYY")
            : "N/A"}
        </p>
        <Form layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item label="Select Staff Member" required>
            <Select
              showSearch
              placeholder="Select a staff member"
              value={selectedStaff}
              onChange={(value) => setSelectedStaff(value)}
              style={{ width: "100%" }}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }>
              {staffList.map((staff) => (
                <Option key={staff.id} value={staff.id}>
                  {staff.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default ViewReports;

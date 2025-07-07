import React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Table,
  Card,
  Row,
  Col,
  Tag,
  Space,
  Input,
  Select,
  Button,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Title } = Typography;
const { Option } = Select;

// Helper to format date from array or string
const formatDate = (date) => {
  if (!date) return "N/A";
  if (Array.isArray(date) && date.length >= 3) {
    const [year, month, day, hour = 0, minute = 0] = date;
    // JS Date month is 0-based, API is 1-based.
    const dateObj = new Date(year, month - 1, day, hour, minute);
    return dateObj.toLocaleString();
  }
  // Fallback for string dates
  return new Date(date).toLocaleString();
};

const TestingProcessMonitoringPage = () => {
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchTests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/manager/booking-assigned");
      // Chuẩn hóa dữ liệu theo mẫu API mới
      const data = response.data?.data || response.data || [];
      setTests(
        data.map((item) => ({
          assignedID: item.assignedID,
          bookingID: item.bookingID,
          customerName: item.customerName,
          staffName: item.staffName,
          lastUpdate: item.lastUpdate,
          serviceType: item.serviceType,
          status: item.status,
          // Use appointmentTime from API, fallback to timeRange if needed
          appointmentTime: item.appointmentTime || item.timeRange || null,
        }))
      );
    } catch (error) {
      toast.error(
        "Failed to fetch testing process data: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Error fetching testing process data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.assignedID
        ?.toString()
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      test.customerName?.toLowerCase().includes(searchText.toLowerCase()) ||
      test.serviceType?.toLowerCase().includes(searchText.toLowerCase()) ||
      test.staffName?.toLowerCase().includes(searchText.toLowerCase());

    // Case-insensitive status filter
    const matchesStatus =
      statusFilter === "" ||
      (test.status && test.status.toLowerCase() === statusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: "Test ID",
      dataIndex: "assignedID",
      key: "assignedID",
      sorter: (a, b) => (a.assignedID || "").localeCompare(b.assignedID || ""),
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      sorter: (a, b) =>
        (a.customerName || "").localeCompare(b.customerName || ""),
    },
    {
      title: "Assigned Staff",
      dataIndex: "staffName",
      key: "staffName",
    },
    {
      title: "Service",
      dataIndex: "serviceType",
      key: "serviceType",
    },
    {
      title: "Appointment Time",
      dataIndex: "appointmentTime",
      key: "appointmentTime",
      render: (appointmentTime) => formatDate(appointmentTime),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        let icon = <ClockCircleOutlined />;
        if (status === "Waiting confirmed") {
          color = "gold";
          icon = <ClockCircleOutlined />;
        }
        if (status === "Booking confirmed") {
          color = "blue";
          icon = <CheckCircleOutlined />;
        }
        if (status === "Awaiting Sample") {
          color = "purple";
          icon = <LoadingOutlined />;
        }
        if (status === "In Progress") {
          color = "cyan";
          icon = <LoadingOutlined />;
        }
        if (status === "Ready") {
          color = "lime";
          icon = <CheckCircleOutlined />;
        }
        if (status === "Pending Payment") {
          color = "orange";
          icon = <ExclamationCircleOutlined />;
        }
        if (status === "Completed") {
          color = "green";
          icon = <CheckCircleOutlined />;
        }
        if (status === "Cancel") {
          color = "red";
          icon = <ExclamationCircleOutlined />;
        }
        return (
          <Tag icon={icon} color={color}>
            {status}
          </Tag>
        );
      },
      filters: [
        { text: "Waiting confirmed", value: "Waiting confirmed" },
        { text: "Booking confirmed", value: "Booking confirmed" },
        { text: "Awaiting Sample", value: "Awaiting Sample" },
        { text: "In Progress", value: "In Progress" },
        { text: "Ready", value: "Ready" },
        { text: "Pending Payment", value: "Pending Payment" },
        { text: "Completed", value: "Completed" },
        { text: "Cancel", value: "Cancel" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Last Update Status",
      dataIndex: "lastUpdate",
      key: "lastUpdate",
      render: (lastUpdate) => formatDate(lastUpdate),
      sorter: (a, b) => {
        const dateA = Array.isArray(a.lastUpdate)
          ? new Date(a.lastUpdate[0], a.lastUpdate[1] - 1, a.lastUpdate[2])
          : new Date(a.lastUpdate || 0);
        const dateB = Array.isArray(b.lastUpdate)
          ? new Date(b.lastUpdate[0], b.lastUpdate[1] - 1, b.lastUpdate[2])
          : new Date(b.lastUpdate || 0);
        return dateA.getTime() - dateB.getTime();
      },
    },
  ];

  const handleExportPDF = () => {
    try {
      if (typeof autoTable !== "function") {
        toast.error("Export failed: jsPDF autoTable plugin is not available.");
        return;
      }
      const doc = new jsPDF();
      const tableColumn = [
        "Test ID",
        "Customer Name",
        "Assigned Staff",
        "Appointment Time",
        "Service Type",
        "Status",
        "Last Update Status",
      ];
      const tableRows = filteredTests.map((test) => [
        test.assignedID,
        test.customerName,
        test.staffName,
        formatDate(test.appointmentTime), // Use formatter
        test.serviceType,
        test.status,
        formatDate(test.lastUpdate), // Use formatter
      ]);
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        styles: { font: "helvetica", fontSize: 10 },
        headStyles: { fillColor: [22, 160, 133] },
        margin: { top: 20 },
      });
      doc.save("testing-process-monitoring.pdf");
      toast.success("Exported PDF successfully!");
    } catch (error) {
      toast.error("Failed to export PDF: " + error.message);
    }
  };

  // State for page size
  const [pageSize, setPageSize] = useState(10);

  return (
    <div style={{ padding: "0 24px" }}>
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
          Testing Process Monitoring
        </Title>
        <ToastContainer />
        <Space>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExportPDF}
            type="default">
            Export PDF
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchTests}
            loading={loading}
            type="primary">
            Refresh
          </Button>
        </Space>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} lg={10}>
            <Input
              placeholder="Search by Test ID, Customer, Staff..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={6} lg={7}>
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
              allowClear>
              <Option value="">All Statuses</Option>
              <Option value="Waiting confirmed">Waiting confirmed</Option>
              <Option value="Booking confirmed">Booking confirmed</Option>
              <Option value="Awaiting Sample">Awaiting Sample</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Ready">Ready</Option>
              <Option value="Pending Payment">Pending Payment</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Cancel">Cancel</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredTests}
          rowKey="assignedID"
          pagination={{
            pageSize: pageSize,
            pageSizeOptions: [5, 10, 20, 50, 100],
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} tests`,
            onShowSizeChange: (current, size) => setPageSize(size),
            onChange: (page, size) => {
              if (size !== pageSize) setPageSize(size);
            },
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default TestingProcessMonitoringPage;

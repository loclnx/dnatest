import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Card } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  Row,
  Col,
  Descriptions,
  DatePicker,
} from "antd";
import {
  EditOutlined,
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../../configs/axios"; // Import axios instance

const { Title } = Typography;
const { Option } = Select;

const OrderProcessing = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  // Lấy staffID từ Redux store
  const currentUser = useSelector((state) => state.user?.currentUser);
  const staffID = currentUser?.staff?.staffID || currentUser?.staffID;

  const [form] = Form.useForm();
  const fetchOrders = useCallback(async () => {
    if (!staffID) {
      toast.error("Staff ID not found. Please log in again.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(`/staff/my-assignment/${staffID}`);
      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setOrders(response.data.data);
      } else {
        setOrders([]);
        if (response.data && response.data.length === 0) {
          toast.info("No assignments found for this staff member.");
        }
      }
    } catch (error) {
      toast.error(
        "Failed to fetch assignments: " +
          (error.response?.data?.message || error.message)
      );
      setOrders([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [staffID]);
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleEdit = (record) => {
    setEditingOrder(record);
    form.setFieldsValue({
      status: record.status,
    });
    setIsModalVisible(true);
  };
  const handleUpdateOrder = async (values) => {
    setLoading(true);
    try {
      // Validate: Nếu chọn hôm nay và khung giờ đã qua thì toast và return
      const { date, timeRange } = values;
      if (date && timeRange) {
        const now = moment();
        if (date.isSame(now, "day")) {
          // Lấy giờ bắt đầu của slot
          const startHour = parseInt(timeRange.split(":")[0], 10);
          const startMin = parseInt(timeRange.split(":")[1], 10);
          const slotMoment = moment(date).hour(startHour).minute(startMin);
          if (slotMoment.isBefore(now)) {
            toast.error("Cannot select a time slot in the past for today.");
            setLoading(false);
            return;
          }
        }
      }
      const payload = {
        status: values.status,
        date: date ? date.format("YYYY-MM-DD") : undefined,
        timeRange: timeRange,
      };
      await api.patch(
        `/staff/updateBooking/${editingOrder.bookingID}`,
        payload
      );

      toast.success("Booking updated successfully!");
      setIsModalVisible(false);
      setEditingOrder(null);
      form.resetFields();
      fetchOrders(); // Refresh the list
    } catch (error) {
      toast.error(
        "Failed to update booking: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Error updating booking:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(18);
      doc.text("Assignment Processing Report", 14, 22);

      // Add date
      doc.setFontSize(12);
      doc.text(`Generated on: ${moment().format("DD/MM/YYYY HH:mm")}`, 14, 32); // Prepare table data
      const tableColumns = [
        "Booking ID",
        "Customer Name",
        "Service",
        "Kit",
        "Status",
        "Appointment Date",
        "Appointment Time",
      ];

      const tableRows = filteredOrders.map((order) => [
        order.bookingID || "N/A",
        order.customerName || "N/A",
        order.service || "N/A",
        order.kitID === "K001"
          ? "PowerPlex Fusion"
          : order.kitID === "K002"
          ? "Global Filer"
          : order.kitID || "N/A",
        order.status || "N/A",
        order.date ? moment(order.date).format("DD/MM/YYYY") : "Not scheduled",
        order.timeRange || "Not scheduled",
      ]);

      // Generate PDF table using autoTable
      autoTable(doc, {
        head: [tableColumns],
        body: tableRows,
        startY: 40,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: 255,
          fontSize: 9,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: 40, left: 14, right: 14 },
      });

      // Save the PDF
      const fileName = `assignment-report-${moment().format(
        "YYYY-MM-DD-HHmm"
      )}.pdf`;
      doc.save(fileName);

      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF: " + error.message);
    }
  };
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.bookingID
        ? order.bookingID.toString().toLowerCase()
        : ""
      ).includes(searchText.toLowerCase()) ||
      (order.customerName ? order.customerName.toLowerCase() : "").includes(
        searchText.toLowerCase()
      ) ||
      (order.service ? order.service.toLowerCase() : "").includes(
        searchText.toLowerCase()
      ) ||
      (order.kitID ? order.kitID.toLowerCase() : "").includes(
        searchText.toLowerCase()
      );

    // Case-insensitive status filter
    const matchesStatus =
      !statusFilter ||
      (order.status &&
        order.status.toLowerCase() === statusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "bookingID",
      key: "bookingID",
      sorter: (a, b) => (a.bookingID || "").localeCompare(b.bookingID || ""),
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      sorter: (a, b) =>
        (a.customerName || "").localeCompare(b.customerName || ""),
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Kit",
      dataIndex: "kitID",
      key: "kitID",
      render: (kitID) => {
        if (kitID === "K001") return "PowerPlex Fusion";
        if (kitID === "K002") return "Global Filer";
        return kitID || "N/A";
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        let icon = <ClockCircleOutlined />;
        const statusLower = (status || "").toLowerCase();
        if (statusLower === "awaiting confirmation") {
          color = "gold";
          icon = <ClockCircleOutlined />;
        }
        if (statusLower === "booking confirmed") {
          color = "blue";
          icon = <CheckCircleOutlined />;
        }
        if (statusLower === "awaiting sample") {
          color = "purple";
          icon = <LoadingOutlined />;
        }
        if (statusLower === "in progress") {
          color = "cyan";
          icon = <LoadingOutlined />;
        }
        if (statusLower === "ready") {
          color = "lime";
          icon = <CheckCircleOutlined />;
        }
        if (statusLower === "pending payment") {
          color = "orange";
          icon = <ExclamationCircleOutlined />;
        }
        if (statusLower === "completed") {
          color = "green";
          icon = <CheckCircleOutlined />;
        }
        if (statusLower === "cancel") {
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
        { text: "Awaiting confirmation", value: "Awaiting confirmation" },
        { text: "Booking confirmed", value: "Booking confirmed" },
        { text: "Awaiting Sample", value: "Awaiting Sample" },
        { text: "In Progress", value: "In Progress" },
        { text: "Ready", value: "Ready" },
        { text: "Pending Payment", value: "Pending Payment" },
        { text: "Completed", value: "Completed" },
        { text: "Cancel", value: "Cancel" },
      ],
      // Case-insensitive filter for table dropdown
      onFilter: (value, record) =>
        record.status && record.status.toLowerCase() === value.toLowerCase(),
    },
    {
      title: "Appointment Date",
      dataIndex: "date",
      key: "date",
      render: (date) => {
        if (!date) return "Not scheduled";
        return moment(date).format("DD/MM/YYYY");
      },
      sorter: (a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return moment(a.date).unix() - moment(b.date).unix();
      },
    },
    {
      title: "Appointment Time",
      dataIndex: "timeRange",
      key: "timeRange",
      render: (timeRange) => {
        return timeRange || "Not scheduled";
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

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
        {" "}
        <Title level={2} style={{ margin: 0 }}>
          Assignment Processing
        </Title>{" "}
        <Space>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExportPDF}
            type="default">
            Export PDF
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchOrders}
            loading={loading}
            type="primary">
            Refresh
          </Button>
        </Space>
      </div>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} lg={10}>
            {" "}
            <Input
              placeholder="Search by Booking ID, Customer, Service, Kit..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={6} lg={7}>
            {" "}
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
              allowClear>
              <Option value="">All Statuses</Option>
              <Option value="Awaiting confirmation">
                Awaiting confirmation
              </Option>
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
        {" "}
        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredOrders}
          rowKey="bookingID"
          pagination={{
            pageSize: pageSize,
            current: currentPage,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} assignments`,
            pageSizeOptions: [5, 10, 20, 50, 100],
            showLessItems: false,
            onShowSizeChange: (current, size) => {
              setPageSize(size);
              setCurrentPage(1);
            },
            onChange: (page, size) => {
              setCurrentPage(page);
              if (size !== pageSize) setPageSize(size);
            },
          }}
          scroll={{ x: 1000 }}
        />
      </Card>{" "}
      <Modal
        title="Update Booking"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingOrder(null);
          form.resetFields();
        }}
        footer={null}
        width={700}>
        {" "}
        {editingOrder && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateOrder}
            initialValues={{
              date: editingOrder.date ? moment(editingOrder.date) : null,
              timeRange: editingOrder.timeRange || undefined,
            }}>
            <Descriptions
              bordered
              column={2}
              size="small"
              style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Booking ID">
                {editingOrder.bookingID}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Name">
                {editingOrder.customerName}
              </Descriptions.Item>
              <Descriptions.Item label="Service" span={2}>
                {editingOrder.service}
              </Descriptions.Item>
              <Descriptions.Item label="Current Status" span={2}>
                <Tag
                  color={
                    editingOrder.status === "Awaiting confirmation"
                      ? "orange"
                      : editingOrder.status === "Booking confirmed"
                      ? "blue"
                      : editingOrder.status === "Awaiting Sample"
                      ? "cyan"
                      : editingOrder.status === "In Progress"
                      ? "purple"
                      : editingOrder.status === "Ready"
                      ? "geekblue"
                      : editingOrder.status === "Pending Payment"
                      ? "gold"
                      : editingOrder.status === "Completed"
                      ? "green"
                      : editingOrder.status === "Cancel"
                      ? "red"
                      : "default"
                  }>
                  {editingOrder.status?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Form.Item
              name="status"
              label="New Status"
              rules={[{ required: true, message: "Please select new status" }]}>
              <Select placeholder="Select new status">
                <Option value="Awaiting confirmation">
                  Awaiting Confirmation
                </Option>
                <Option value="Booking confirmed">Booking Confirmed</Option>
                <Option value="Awaiting Sample">Awaiting Sample</Option>
                <Option value="In Progress">In Progress</Option>
                <Option value="Ready">Ready</Option>
                <Option value="Pending Payment">Pending Payment</Option>
                <Option value="Completed">Completed</Option>
                <Option value="Cancel">Cancel</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="date"
              label="Appointment Date"
              rules={[
                { required: true, message: "Please select appointment date" },
              ]}>
              <DatePicker
                style={{ width: "100%" }}
                disabledDate={(current) =>
                  current && current < moment().startOf("day")
                }
              />
            </Form.Item>

            <Form.Item
              name="timeRange"
              label="Appointment Time"
              rules={[
                { required: true, message: "Please select appointment time" },
              ]}
              dependencies={["date"]}>
              <Select
                placeholder="Select appointment time"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }>
                {(() => {
                  const timeSlots = [
                    "8:15 - 9:15",
                    "9:30 - 10:30",
                    "10:45 - 11:45",
                    "13:15 - 14:15",
                    "14:30 - 15:30",
                    "15:45 - 16:45",
                  ];
                  const selectedDate = form.getFieldValue("date");
                  const now = moment();
                  return timeSlots.map((slot) => {
                    let disabled = false;
                    if (selectedDate && selectedDate.isSame(now, "day")) {
                      // Lấy giờ bắt đầu của slot
                      const startHour = parseInt(slot.split(":")[0], 10);
                      const startMin = parseInt(slot.split(":")[1], 10);
                      const slotMoment = moment(selectedDate)
                        .hour(startHour)
                        .minute(startMin);
                      if (slotMoment.isBefore(now)) disabled = true;
                    }
                    return (
                      <Option value={slot} key={slot} disabled={disabled}>
                        {slot}
                      </Option>
                    );
                  });
                })()}
              </Select>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update Booking
                </Button>
                <Button
                  onClick={() => {
                    setIsModalVisible(false);
                    setEditingOrder(null);
                    form.resetFields();
                  }}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default OrderProcessing;

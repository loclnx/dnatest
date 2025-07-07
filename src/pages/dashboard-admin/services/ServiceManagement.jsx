import React from "react";
import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Typography,
  Tag,
  Modal,
  Form,
  InputNumber,
  Tooltip,
  Card,
  Descriptions,
  Row,
  Col,
  Statistic,
  Select,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  BarChartOutlined,
  ReloadOutlined,
  PlusOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ServiceManagement = () => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editForm] = Form.useForm();

  // Fetch services data from API
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get("/services/service");
      // console.log("Services response:", response); // Remove or comment out in production

      const servicesData = response.data?.data || response.data || [];
      setServices(servicesData);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error(
        "Failed to fetch services: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []); // Filter and sort services based on search text and sort order
  // Filter services based on search text and price range
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      service.type?.toLowerCase().includes(searchText.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchText.toLowerCase()) ||
      service.serviceID?.toLowerCase().includes(searchText.toLowerCase());
    return matchesSearch;
  });

  // Calculate statistics
  const stats = {
    totalServices: services.length,
    // Doanh thu và số đơn hàng thực tế phải lấy từ booking, không phải từ service
    totalRevenue: services.reduce(
      (sum, service) => sum + (service.totalCost || 0),
      0
    ),
    totalOrders: services.reduce(
      (sum, service) => sum + (service.totalCost ? 1 : 0),
      0
    ),
    avgPrice:
      services.length > 0
        ? Math.round(
            (services.reduce((sum, service) => sum + (service.cost || 0), 0) /
              services.length) *
              100
          ) / 100
        : 0,
  };

  // Service table columns (bắt đúng dữ liệu từ API)
  const serviceColumns = [
    {
      title: "Service ID",
      dataIndex: "serviceID",
      key: "serviceID",
      width: 100,
    },
    {
      title: "Service Type",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <Tag color="geekblue" style={{ fontSize: 14 }}>
          {name}
        </Tag>
      ),
    },
    {
      title: "Service Name",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color="blue" style={{ fontSize: 14 }}>
          {type}
        </Tag>
      ),
    },

    {
      title: "Standard Price",
      dataIndex: "cost",
      key: "cost",
      render: (cost) =>
        cost != null
          ? cost.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " ₫"
          : "0 ₫",
    },
    {
      title: "Express Price",
      dataIndex: "expressPrice",
      key: "expressPrice",
      render: (expressPrice) =>
        expressPrice != null
          ? expressPrice.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) +
            " ₫"
          : "0 ₫",
    },
    {
      title: "Estimated Time",
      dataIndex: "estimatedTime",
      key: "estimatedTime",
      render: (time) => (
        <Space>
          <ClockCircleOutlined />
          {time || "N/A"}
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Price">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                setEditingService(record);
                setIsEditModalVisible(true);
                editForm.setFieldsValue({
                  name: record.name,
                  type: record.type,
                  cost: record.cost,
                });
              }}
            />
          </Tooltip>
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
      // Lấy dữ liệu từ filteredServices
      const tableColumn = [
        "Service ID",

        "Service Name",
        "Service Type",
        "Price",
        "Estimated Time",
      ];
      const tableRows = filteredServices.map((service) => [
        service.serviceID,
        service.name,
        service.type,
        service.cost != null
          ? service.cost.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) +
            " ₫"
          : "0 ₫",
        service.estimatedTime || "N/A",
      ]);
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        styles: { font: "helvetica", fontSize: 10 },
        headStyles: { fillColor: [22, 160, 133] },
        margin: { top: 20 },
      });
      doc.save("service-management.pdf");
      toast.success("PDF exported successfully!");
    } catch (err) {
      toast.error("PDF export failed: " + (err?.message || err));
      console.error("Export PDF error:", err);
    }
  };

  return (
    <div>
      <Title level={2}>Service Management</Title>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card
            loading={loading}
            style={{
              borderRadius: 16,
              minHeight: 120,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 4px 20px rgba(24, 144, 255, 0.1)",
              border: "1px solid #e6f7ff",
            }}>
            <Statistic
              title={
                <span style={{ fontWeight: 600, fontSize: 16, color: "#666" }}>
                  Total Services
                </span>
              }
              value={stats.totalServices}
              prefix={
                <MedicineBoxOutlined
                  style={{ color: "#1890ff", fontSize: 24 }}
                />
              }
              valueStyle={{
                color: "#1890ff",
                fontSize: 28,
                fontWeight: 700,
              }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            loading={loading}
            style={{
              borderRadius: 16,
              minHeight: 120,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 4px 20px rgba(250, 173, 20, 0.1)",
              border: "1px solid #fffbe6",
            }}>
            <Statistic
              title={
                <span style={{ fontWeight: 600, fontSize: 16, color: "#666" }}>
                  Average Price
                </span>
              }
              value={
                stats.avgPrice >= 1000000
                  ? `$${(stats.avgPrice / 1000000).toFixed(1)}M`
                  : stats.avgPrice >= 1000
                  ? `$${(stats.avgPrice / 1000).toFixed(1)}K`
                  : `$${stats.avgPrice}`
              }
              valueStyle={{
                color: "#faad14",
                fontSize: 28,
                fontWeight: 700,
              }}
            />
          </Card>
        </Col>
      </Row>{" "}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col
            xs={24}
            sm={16}
            lg={16}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}>
            <Input
              placeholder="Search by Service ID, Name, Type, ..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ maxWidth: 350, borderRadius: 6 }}
              size="large"
            />
          </Col>
          <Col
            xs={24}
            sm={8}
            lg={8}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}>
            <Space>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExportPDF}
                type="default">
                Export PDF
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchServices}
                loading={loading}
                type="primary">
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>{" "}
      <Card>
        <Table
          columns={serviceColumns}
          dataSource={filteredServices}
          loading={loading}
          rowKey="serviceID"
          bordered
          scroll={{ x: true }}
          pagination={false}
        />
      </Card>
      {/* Modal chỉnh sửa giá */}
      <Modal
        title={
          editingService
            ? `Edit Price for: ${editingService.name}`
            : "Edit Price"
        }
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingService(null);
          editForm.resetFields();
        }}
        onOk={() => editForm.submit()}
        okText="Save"
        cancelText="Cancel">
        <Form
          form={editForm}
          layout="vertical"
          onFinish={async (values) => {
            try {
              await api.patch(`/admin/${editingService.serviceID}/cost`, null, {
                params: {
                  serviceId: editingService.serviceID,
                  cost: values.cost,
                },
              });
              toast.success("Service price updated successfully");
              setIsEditModalVisible(false);
              setEditingService(null);
              editForm.resetFields();
              fetchServices();
            } catch (error) {
              toast.error(
                "Failed to update price: " +
                  (error.response?.data?.message || error.message)
              );
            }
          }}
          initialValues={{ cost: editingService?.cost }}>
          <Form.Item
            label="Service Name"
            name="name"
            initialValue={editingService?.name}>
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Type"
            name="type"
            initialValue={editingService?.type}>
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Cost ($)"
            name="cost"
            rules={[
              { required: true, message: "Please input the service cost!" },
            ]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceManagement;

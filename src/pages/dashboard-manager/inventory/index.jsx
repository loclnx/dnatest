// Description: Inventory Management Dashboard for Admins
import React from "react";
import { useState, useEffect } from "react";
import {
  Tabs,
  Table,
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Space,
  Input,
  Select,
  DatePicker,
  Tag,
  Typography,
  Progress,
  Alert,
  Modal,
  Form,
  InputNumber,
  Upload,
  Tooltip,
  Descriptions,
  Divider,
} from "antd";
import {
  InboxOutlined,
  PlusOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  DownloadOutlined,
  HistoryOutlined,
  BarChartOutlined,
  FileExcelOutlined,
  PrinterOutlined,
  SaveOutlined,
  DeleteOutlined,
  UploadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Dragger } = Upload;
const { TabPane } = Tabs;

const Inventory = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("inventory");

  // Inventory data
  const [inventory, setInventory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [inventoryStats, setInventoryStats] = useState({
    totalKits: 0,
    availableKits: 0,
    lowStockKits: 0,
    outOfStockKits: 0,
  });

  // Search and filter states
  const [typeFilter, setTypeFilter] = useState("");

  // Modal states
  const [isAddStockModalVisible, setIsAddStockModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isTransactionDetailModalVisible, setIsTransactionDetailModalVisible] =
    useState(false);
  const [selectedKit, setSelectedKit] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Form states
  const [form] = Form.useForm();

  // Table columns (đặt ở đầu, không lặp lại)
  const inventoryColumns = [
    {
      title: "Kit ID",
      dataIndex: "kitID",
      key: "kitID",
      sorter: (a, b) =>
        (a.kitID || "").toString().localeCompare((b.kitID || "").toString()),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
    },
    {
      title: "Available",
      dataIndex: "available",
      key: "available",
      render: (available) => (
        <Tag color={available ? "green" : "red"}>
          {available ? "Available" : "Unavailable"}
        </Tag>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => quantity || 0,
      sorter: (a, b) => (a.quantity || 0) - (b.quantity || 0),
    },
    {
      title: "Kit Sold",
      dataIndex: "isSelled",
      key: "isSelled",
      render: (isSelled) => <span>{isSelled || 0}</span>,
    },
  ];

  const transactionColumns = [
    {
      title: "Transaction ID",
      dataIndex: "transactionID",
      key: "transactionID",
      sorter: (a, b) =>
        (Number(a.transactionID) || 0) - (Number(b.transactionID) || 0),
    },
    {
      title: "Kit ID",
      dataIndex: "kitID",
      key: "kitID",
      sorter: (a, b) =>
        (a.kitID || "").toString().localeCompare((b.kitID || "").toString()),
    },
    {
      title: "Received",
      dataIndex: "received",
      key: "received",
      render: (received) => (
        <Tag color={received ? "green" : "red"}>
          {received ? "Received" : "Unreceived"}
        </Tag>
      ),
    },
    {
      title: "Booking ID",
      dataIndex: "bookingID",
      key: "bookingID",
    },
  ];

  // Transaction stats
  const transactionStats = {
    totalTransactions: transactions.length,
    kitReceived: transactions.filter((t) => t.received === true).length,
    kitUnreceived: transactions.filter((t) => t.received === false).length,
  };

  // Low stock threshold
  const LOW_STOCK_THRESHOLD = 20;

  // Fetch inventory data
  const fetchInventory = async () => {
    try {
      setLoading(true);
      // Sử dụng API mới lấy tất cả kit
      const response = await api.get("/admin/kitInventory/all");
      const inventoryData = response.data?.data || response.data || [];
      setInventory(inventoryData);

      // Tính toán lại stats dựa trên các trường mới
      const totalKits = inventoryData.reduce(
        (sum, kit) => sum + (kit.quantity || 0),
        0
      );
      // Đếm tổng số kit sold từ tất cả các kit
      const totalKitSold = inventoryData.reduce(
        (sum, kit) => sum + (kit.isSelled || 0),
        0
      );
      const availableKits = inventoryData.filter(
        (kit) => kit.available === true
      ).length;
      const lowStockKits = inventoryData.filter(
        (kit) =>
          kit.available === true && (kit.quantity || 0) < LOW_STOCK_THRESHOLD
      );
      const outOfStockKits = inventoryData.filter(
        (kit) => kit.available === false || (kit.quantity || 0) === 0
      ).length;

      setInventoryStats({
        totalKits,
        totalKitSold, // thêm trường này để hiển thị
        availableKits,
        lowStockKits: lowStockKits.length,
        outOfStockKits,
      });
    } catch (error) {
      toast.error(
        "Failed to fetch inventory: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch transactions data
  const fetchTransactions = async () => {
    try {
      const response = await api.get("/manager/kit-transaction");
      // console.log("Transactions response:", response); // Removed for clean console

      // Chuẩn hóa dữ liệu theo mẫu API mới
      const transactionsData = (response.data?.data || response.data || []).map(
        (item) => ({
          transactionID: item.transactionID,
          kitID: item.kitID,
          received: item.received,
          bookingID: item.bookingID,
        })
      );
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error(
        "Failed to fetch transactions: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Fetch data
  useEffect(() => {
    fetchInventory();
    fetchTransactions();
  }, []);

  // Handle add stock
  const handleAddStock = async (values) => {
    try {
      await api.post(`/admin/inventory/${selectedKit.id}/add-stock`, {
        quantity: values.quantity,
        notes: values.notes,
      });

      toast.success(`Added ${values.quantity} units to ${selectedKit.name}`);
      setIsAddStockModalVisible(false);
      form.resetFields();
      setSelectedKit(null);
      fetchInventory(); // Refresh the list
      fetchTransactions(); // Refresh transactions
    } catch (error) {
      console.error("Error adding stock:", error);
      toast.error(
        "Failed to add stock: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Handle single item form submission
  const handleSingleSubmit = async (values) => {
    try {
      setLoading(true);
      // Lấy đúng kitID và name từ form
      const kitID = values.kitID;
      const kitData = {
        name: values.name,
        quantity: values.quantity,
        isSelled: values.isSelled || 0,
        available: values.available !== undefined ? values.available : true,
        kitID: kitID,
      };
      await api.patch(`/manager/kit/${kitID}`, kitData);
      toast.success("Inventory item updated successfully!");
      form.resetFields();
      fetchInventory(); // Refresh the list
      fetchTransactions(); // Refresh transactions
    } catch (error) {
      console.error("Error adding inventory item:", error);
      toast.error(
        "Failed to add inventory item: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory;
  const filteredTransactions = transactions.filter((t) => {
    if (typeFilter === "received") return t.received === true;
    if (typeFilter === "not-received") return t.received === false;
    return true;
  });

  // Derived: Low stock kit names & items
  const lowStockKits = inventory.filter(
    (kit) => kit.available === true && (kit.quantity || 0) < LOW_STOCK_THRESHOLD
  );
  const lowStockKitNames = lowStockKits
    .map((kit) => kit.kitID || kit.id || kit.name)
    .filter(Boolean);

  // State for page size of transactions table
  const [transactionPageSize, setTransactionPageSize] = useState(10);

  // Export PDF for Inventory
  const handleExportInventoryPDF = () => {
    const doc = new jsPDF();
    doc.text("Test Kit Inventory List", 14, 16);
    autoTable(doc, {
      head: [["Kit ID", "Name", "Available", "Quantity", "Kit Sold"]],
      body: inventory.map((kit) => [
        kit.kitID || kit.id || "",
        kit.name || "",
        kit.available ? "Available" : "Unavailable",
        kit.quantity || 0,
        kit.isSelled || 0,
      ]),
      startY: 22,
    });
    doc.save("inventory-list.pdf");
  };

  // Export PDF for Transactions
  const handleExportTransactionsPDF = () => {
    const doc = new jsPDF();
    doc.text("Kit Transactions List", 14, 16);
    autoTable(doc, {
      head: [["Transaction ID", "Kit ID", "Received", "Booking ID"]],
      body: transactions.map((t) => [
        t.transactionID,
        t.kitID,
        t.received ? "Received" : "Unreceived",
        t.bookingID,
      ]),
      startY: 22,
    });
    doc.save("kit-transactions-list.pdf");
  };

  // Export both Inventory and Transactions
  const handleExportAllPDF = () => {
    const doc = new jsPDF();
    // Inventory Section
    doc.text("Test Kit Inventory List", 14, 16);
    autoTable(doc, {
      head: [["Kit ID", "Name", "Available", "Quantity", "Kit Sold"]],
      body: inventory.map((kit) => [
        kit.kitID || kit.id || "",
        kit.name || "",
        kit.available ? "Available" : "Unavailable",
        kit.quantity || 0,
        kit.isSelled || 0,
      ]),
      startY: 22,
    });
    // Transactions Section
    let nextY = doc.lastAutoTable.finalY + 10;
    doc.text("Kit Transactions List", 14, nextY);
    autoTable(doc, {
      head: [["Transaction ID", "Kit ID", "Received", "Booking ID"]],
      body: transactions.map((t) => [
        t.transactionID,
        t.kitID,
        t.received ? "Received" : "Unreceived",
        t.bookingID,
      ]),
      startY: nextY + 6,
    });
    doc.save("inventory-and-kit-transactions.pdf");
  };

  // Low stock detail modal
  const [isLowStockModalVisible, setIsLowStockModalVisible] = useState(false);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}>
        <Title level={2}>Test Kit Inventory Management</Title>
        <Space>
          <Button icon={<DownloadOutlined />} onClick={handleExportAllPDF}>
            Export
          </Button>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() => {
              fetchInventory();
              fetchTransactions();
            }}
            loading={loading}>
            Refresh
          </Button>
        </Space>
      </div>

      {/* Alerts */}
      {inventoryStats.lowStockKits > 0 && (
        <Alert
          message="Low Stock Alert"
          description={`${inventoryStats.lowStockKits} kit types are running low on stock. Please restock soon.`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {inventoryStats.outOfStockKits > 0 && (
        <Alert
          message="Out of Stock Alert"
          description={`${inventoryStats.outOfStockKits} kit types are out of stock. Please restock immediately.`}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Tabs items for new antd Tabs API */}
      {(() => {
        const tabItems = [
          {
            key: "inventory",
            label: (
              <span>
                <HistoryOutlined />
                Kit Transactions
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
                  <Title level={3}>Kit Inventory</Title>
                  <Space>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={handleExportInventoryPDF}>
                      Export Inventory
                    </Button>
                    <Button
                      type="primary"
                      icon={<ReloadOutlined />}
                      onClick={fetchInventory}
                      loading={loading}>
                      Refresh
                    </Button>
                  </Space>
                </div>
                {/* Stats Cards */}
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                  <Col xs={24} sm={12} lg={8}>
                    <Card>
                      <Statistic
                        title="Total Kits"
                        value={inventoryStats.totalKits}
                        prefix={<InboxOutlined />}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <Card>
                      <Statistic
                        title="Kit Sold"
                        value={inventoryStats.totalKitSold}
                        prefix={<BarChartOutlined />}
                        valueStyle={{ color: "#722ed1" }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <Card>
                      <Statistic
                        title="Low Stock Items"
                        value={
                          lowStockKitNames.length > 0
                            ? lowStockKitNames.join(", ")
                            : "None"
                        }
                        prefix={<WarningOutlined />}
                        valueStyle={{ color: "#faad14" }}
                      />
                    </Card>
                  </Col>
                </Row>

                {/* Inventory Table */}
                <Card>
                  <Table
                    loading={loading}
                    columns={inventoryColumns}
                    dataSource={filteredInventory}
                    rowKey={(kit) => kit.kitID || kit.id || kit.name}
                    pagination={false} // Loại bỏ phân trang
                    expandable={{
                      expandedRowRender: (record) => (
                        <div>
                          <Row gutter={[16, 16]}>
                            <Col span={8}>
                              <Text strong>Unit Price:</Text> $
                              {(record.unitPrice || 0).toFixed(2)}
                            </Col>
                            <Col span={8}>
                              <Text strong>Location:</Text>{" "}
                              {record.location || "N/A"}
                            </Col>
                            <Col span={8}>
                              <Text strong>Supplier:</Text>{" "}
                              {record.supplier || "N/A"}
                            </Col>
                          </Row>
                          <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
                            <Col span={8}>
                              <Text strong>Last Restocked:</Text>{" "}
                              {record.lastRestocked || "N/A"}
                            </Col>
                            <Col span={8}>
                              <Text strong>Expiry Date:</Text>{" "}
                              {record.expiryDate || "N/A"}
                            </Col>
                            <Col span={8}>
                              <Text strong>Batch Number:</Text>{" "}
                              {record.batchNumber || "N/A"}
                            </Col>
                          </Row>
                        </div>
                      ),
                    }}
                  />
                </Card>
              </>
            ),
          },
          {
            key: "add",
            label: (
              <span>
                <PlusOutlined />
                Add Inventory
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
                  <Title level={3}>Add Inventory</Title>
                </div>

                {/* Single Item Form */}
                <Card title="Add Inventory Item">
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSingleSubmit}
                    initialValues={{ quantity: 1 }}>
                    <Form.Item
                      name="kitID"
                      label="Kit ID"
                      rules={[
                        { required: true, message: "Please select Kit ID" },
                      ]}>
                      <Select
                        placeholder="Select Kit ID"
                        onChange={(value) => {
                          form.setFieldsValue({
                            name:
                              value === "K001"
                                ? "PowerPlex Fusion"
                                : value === "K002"
                                ? "Global Filer"
                                : "",
                          });
                        }}>
                        <Option value="K001">K001</Option>
                        <Option value="K002">K002</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="name"
                      label="Kit Name"
                      rules={[
                        { required: true, message: "Kit Name is required" },
                      ]}>
                      <Input
                        disabled
                        placeholder="Kit Name will be auto-filled"
                      />
                    </Form.Item>
                    <Form.Item
                      name="quantity"
                      label="Quantity"
                      rules={[
                        { required: true, message: "Please enter quantity" },
                      ]}>
                      <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        icon={<SaveOutlined />}>
                        Add Inventory Item
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </>
            ),
          },
          {
            key: "transactions",
            label: (
              <span>
                <HistoryOutlined />
                Kit Transactions
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
                  <Title level={3}>Kit Transactions</Title>
                  <Space>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={handleExportTransactionsPDF}>
                      Export Transactions
                    </Button>
                    <Button
                      type="primary"
                      icon={<ReloadOutlined />}
                      onClick={fetchTransactions}
                      loading={loading}>
                      Refresh
                    </Button>
                  </Space>
                </div>

                {/* Transaction Statistics Cards */}
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                  <Col xs={24} sm={12} lg={8}>
                    <Card>
                      <Statistic
                        title="Total Transactions"
                        value={transactionStats.totalTransactions}
                        prefix={<HistoryOutlined />}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <Card>
                      <Statistic
                        title="Kit Received"
                        value={transactionStats.kitReceived}
                        prefix={<ArrowUpOutlined />}
                        valueStyle={{ color: "#52c41a" }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <Card>
                      <Statistic
                        title="Kit Unreceived"
                        value={transactionStats.kitUnreceived}
                        prefix={<ArrowDownOutlined />}
                        valueStyle={{ color: "#ff4d4f" }}
                      />
                    </Card>
                  </Col>
                </Row>

                {/* Filter by Received/Not Received */}
                <Card style={{ marginBottom: 16 }}>
                  <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={6}>
                      <Select
                        placeholder="Filter by status"
                        value={typeFilter}
                        onChange={setTypeFilter}
                        style={{ width: "100%" }}
                        allowClear>
                        <Option value="received">Received</Option>
                        <Option value="not-received">Not Received</Option>
                      </Select>
                    </Col>
                  </Row>
                </Card>

                {/* Table */}
                <Card>
                  <Table
                    loading={loading}
                    columns={transactionColumns}
                    dataSource={filteredTransactions}
                    rowKey="transactionID"
                    pagination={{
                      pageSize: transactionPageSize,
                      pageSizeOptions: [5, 10, 20, 50, 100],
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} transactions`,
                      onShowSizeChange: (current, size) =>
                        setTransactionPageSize(size),
                      onChange: (page, size) => {
                        if (size !== transactionPageSize)
                          setTransactionPageSize(size);
                      },
                    }}
                  />
                </Card>
              </>
            ),
          },
        ];
        return (
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            type="card"
            items={tabItems}
          />
        );
      })()}

      {/* Add Stock Modal */}
      <Modal
        title="Add Stock"
        open={isAddStockModalVisible}
        onCancel={() => {
          setIsAddStockModalVisible(false);
          form.resetFields();
          setSelectedKit(null);
        }}
        footer={null}>
        {selectedKit && (
          <Form form={form} layout="vertical" onFinish={handleAddStock}>
            <Form.Item label="Kit Information">
              <Card size="small">
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <Text strong>ID:</Text> {selectedKit.id}
                  </Col>
                  <Col span={12}>
                    <Text strong>Code:</Text> {selectedKit.code}
                  </Col>
                  <Col span={24}>
                    <Text strong>Name:</Text> {selectedKit.name}
                  </Col>
                  <Col span={12}>
                    <Text strong>Current Stock:</Text>{" "}
                    {selectedKit.quantity || 0}
                  </Col>
                  <Col span={12}>
                    <Text strong>Threshold:</Text> {selectedKit.threshold || 0}
                  </Col>
                </Row>
              </Card>
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Quantity to Add"
              rules={[
                { required: true, message: "Please enter quantity" },
                {
                  type: "number",
                  min: 1,
                  message: "Quantity must be at least 1",
                },
              ]}>
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="notes" label="Notes">
              <TextArea
                rows={3}
                placeholder="Optional notes about this stock addition"
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Add Stock
                </Button>
                <Button
                  onClick={() => {
                    setIsAddStockModalVisible(false);
                    form.resetFields();
                    setSelectedKit(null);
                  }}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Kit Details Modal */}
      <Modal
        title="Kit Details"
        open={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false);
          setSelectedKit(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setIsDetailModalVisible(false);
              setSelectedKit(null);
            }}>
            Close
          </Button>,
        ]}
        width={700}>
        {selectedKit && (
          <Descriptions title="Kit Information" bordered column={2}>
            <Descriptions.Item label="Kit ID">
              {selectedKit.id}
            </Descriptions.Item>
            <Descriptions.Item label="Kit Code">
              {selectedKit.code}
            </Descriptions.Item>
            <Descriptions.Item label="Kit Name" span={2}>
              {selectedKit.name}
            </Descriptions.Item>
            <Descriptions.Item label="Current Quantity">
              {selectedKit.quantity || 0}
            </Descriptions.Item>
            <Descriptions.Item label="Threshold">
              {selectedKit.threshold || 0}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  selectedKit.status === "In Stock" ||
                  (selectedKit.quantity || 0) > (selectedKit.threshold || 0)
                    ? "green"
                    : selectedKit.status === "Low Stock" ||
                      (selectedKit.quantity || 0) <=
                        (selectedKit.threshold || 0)
                    ? "orange"
                    : "red"
                }>
                {selectedKit.status ||
                  ((selectedKit.quantity || 0) === 0
                    ? "Out of Stock"
                    : (selectedKit.quantity || 0) <=
                      (selectedKit.threshold || 0)
                    ? "Low Stock"
                    : "In Stock")}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Unit Price">
              ${(selectedKit.unitPrice || 0).toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Total Value">
              $
              {(
                (selectedKit.quantity || 0) * (selectedKit.unitPrice || 0)
              ).toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Location">
              {selectedKit.location || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Supplier">
              {selectedKit.supplier || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Batch Number">
              {selectedKit.batchNumber || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Last Restocked">
              {selectedKit.lastRestocked || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Expiry Date">
              {selectedKit.expiryDate || "N/A"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Transaction Details Modal */}
      <Modal
        title="Transaction Details"
        open={isTransactionDetailModalVisible}
        onCancel={() => {
          setIsTransactionDetailModalVisible(false);
          setSelectedTransaction(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setIsTransactionDetailModalVisible(false);
              setSelectedTransaction(null);
            }}>
            Close
          </Button>,
        ]}
        width={700}>
        {selectedTransaction && (
          <Descriptions title="Transaction Information" bordered column={2}>
            <Descriptions.Item label="Transaction ID">
              {selectedTransaction.id}
            </Descriptions.Item>
            <Descriptions.Item label="Date & Time">
              {selectedTransaction.date
                ? new Date(selectedTransaction.date).toLocaleString()
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              <Tag
                color={
                  selectedTransaction.type === "Stock In"
                    ? "green"
                    : selectedTransaction.type === "Stock Out"
                    ? "red"
                    : selectedTransaction.type === "Transfer"
                    ? "purple"
                    : "orange"
                }>
                {selectedTransaction.type}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  selectedTransaction.status === "Completed"
                    ? "green"
                    : "orange"
                }>
                {selectedTransaction.status || "Completed"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Kit Code">
              {selectedTransaction.kitCode}
            </Descriptions.Item>
            <Descriptions.Item label="Kit Name">
              {selectedTransaction.kitName}
            </Descriptions.Item>
            <Descriptions.Item label="Quantity">
              {selectedTransaction.quantity || 0}
            </Descriptions.Item>
            <Descriptions.Item label="Unit Price">
              ${(selectedTransaction.unitPrice || 0).toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Total Value">
              ${(selectedTransaction.totalValue || 0).toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Performed By">
              {selectedTransaction.performedBy || "N/A"}
            </Descriptions.Item>

            {selectedTransaction.location && (
              <Descriptions.Item label="Location">
                {selectedTransaction.location}
              </Descriptions.Item>
            )}
            {selectedTransaction.fromLocation && (
              <Descriptions.Item label="From Location">
                {selectedTransaction.fromLocation}
              </Descriptions.Item>
            )}
            {selectedTransaction.toLocation && (
              <Descriptions.Item label="To Location">
                {selectedTransaction.toLocation}
              </Descriptions.Item>
            )}
            {selectedTransaction.supplier && (
              <Descriptions.Item label="Supplier">
                {selectedTransaction.supplier}
              </Descriptions.Item>
            )}
            {selectedTransaction.batchNumber && (
              <Descriptions.Item label="Batch Number">
                {selectedTransaction.batchNumber}
              </Descriptions.Item>
            )}
            {selectedTransaction.orderNumber && (
              <Descriptions.Item label="Order Number">
                {selectedTransaction.orderNumber}
              </Descriptions.Item>
            )}
            {selectedTransaction.customerName && (
              <Descriptions.Item label="Customer">
                {selectedTransaction.customerName}
              </Descriptions.Item>
            )}
            {selectedTransaction.reason && (
              <Descriptions.Item label="Reason">
                {selectedTransaction.reason}
              </Descriptions.Item>
            )}
            {selectedTransaction.notes && (
              <Descriptions.Item label="Notes" span={2}>
                {selectedTransaction.notes}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Low Stock Kit Details Modal */}
      <Modal
        title="Low Stock Kit Details"
        open={isLowStockModalVisible}
        onCancel={() => setIsLowStockModalVisible(false)}
        footer={null}
        width={600}>
        <Table
          dataSource={lowStockKits}
          columns={inventoryColumns}
          rowKey={(kit) => kit.kitID || kit.id || kit.name}
          pagination={false}
        />
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default Inventory;

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
  Modal,
  Form,
  Rate, // Import Rate component
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  StarOutlined, // Using Star for rating display
  DownloadOutlined, // Import DownloadOutlined
} from "@ant-design/icons";
import api from "../../../configs/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CustomerFeedbackPage = () => {
  const [loading, setLoading] = useState(true);
  const [feedbackList, setFeedbackList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [ratingFilter, setRatingFilter] = useState(null); // Add state for rating filter

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    try {
      // Updated API path as requested
      const response = await api.get("/manager/all-feedback");
      setFeedbackList(response.data?.data || response.data || []);
    } catch (error) {
      toast.error(
        "Failed to fetch customer feedback: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Error fetching customer feedback:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  // Edit and Update functions are removed as they are no longer applicable
  // const handleEdit = (record) => { ... };
  // const handleUpdateFeedback = async (values) => { ... };
  const handleExportPDF = () => {
    try {
      if (!jsPDF || !jsPDF.prototype.autoTable) {
        toast.error("jsPDF autoTable plugin is not available.");
        return;
      }

      const doc = new jsPDF();
      const tableColumns = [
        "Customer ID",
        "Booking ID",
        "Title",
        "Content",
        "Rating",
        "Date",
      ];
      const tableRows = filteredFeedback.map((feedback) => [
        feedback.customerID,
        feedback.bookingID,
        feedback.title,
        feedback.content,
        feedback.rating,
        new Date(feedback.createAt).toLocaleDateString(),
      ]);

      doc.autoTable({
        head: [tableColumns],
        body: tableRows,
      });

      doc.save("customer_feedback.pdf");
    } catch (error) {
      toast.error("Failed to export PDF: " + error.message);
      console.error("PDF Export Error:", error);
    }
  };

  const filteredFeedback = feedbackList.filter((feedback) => {
    const searchString = searchText.toLowerCase();
    // Normalize data to prevent errors if some fields are null/undefined
    const customerId = String(feedback.customerID || "").toLowerCase();
    const bookingId = String(feedback.bookingID || "").toLowerCase();
    const title = String(feedback.title || "").toLowerCase();
    const content = String(feedback.content || "").toLowerCase();

    const matchesSearch =
      customerId.includes(searchString) ||
      bookingId.includes(searchString) ||
      title.includes(searchString) ||
      content.includes(searchString);

    const matchesRating =
      ratingFilter === null || feedback.rating === ratingFilter;

    return matchesSearch && matchesRating;
  });

  const columns = [
    {
      title: "Customer ID",
      dataIndex: "customerID",
      key: "customerID",
      sorter: (a, b) =>
        String(a.customerID || "").localeCompare(String(b.customerID || "")),
    },
    {
      title: "Booking ID",
      dataIndex: "bookingID",
      key: "bookingID",
      sorter: (a, b) =>
        String(a.bookingID || "").localeCompare(String(b.bookingID || "")),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      render: (text) => (
        <Typography.Paragraph ellipsis={{ rows: 2, tooltip: text }}>
          {text}
        </Typography.Paragraph>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => (
        <Rate disabled defaultValue={rating} style={{ fontSize: 16 }} />
      ),
      sorter: (a, b) => (a.rating || 0) - (b.rating || 0),
    },
    {
      title: "Date",
      dataIndex: "createAt",
      key: "createAt",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
      sorter: (a, b) =>
        new Date(a.createAt || 0).getTime() -
        new Date(b.createAt || 0).getTime(),
    },
    // Actions column is removed as it's no longer applicable
  ];

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
          Customer Feedback
        </Title>
        <Space>
          <Button icon={<DownloadOutlined />} onClick={handleExportPDF}>
            Export PDF
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchFeedback}
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
              placeholder="Search by Customer ID, Booking ID, Title, Content..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={6} lg={7}>
            <Select
              placeholder="Filter by rating"
              value={ratingFilter}
              onChange={setRatingFilter}
              style={{ width: "100%" }}
              allowClear>
              <Option value={null}>All Ratings</Option>
              {[5, 4, 3, 2, 1].map((r) => (
                <Option key={r} value={r}>
                  {r} Star{r > 1 ? "s" : ""}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredFeedback}
          rowKey="bookingID" // Assuming bookingID is unique for each feedback
          pagination={{
            pageSize: pageSize,
            pageSizeOptions: [5, 10, 20, 50, 100],
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} feedback`,
            onShowSizeChange: (current, size) => setPageSize(size),
            onChange: (page, size) => {
              if (size !== pageSize) setPageSize(size);
            },
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Modal is removed as it's no longer needed */}
      <ToastContainer />
    </div>
  );
};

export default CustomerFeedbackPage;

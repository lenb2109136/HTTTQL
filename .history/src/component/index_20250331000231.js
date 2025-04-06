import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './WelcomePage.css'; // File CSS tùy chỉnh

const WelcomePage = () => {
  const [employeeName, setEmployeeName] = useState('');
  const navigate = useNavigate();
  const API_URL = 'http://localhost:8080/api';

  // Giả lập lấy thông tin nhân viên từ token hoặc session sau khi đăng nhập
  const loggedInEmployeeId = 1; // Thay bằng cách lấy từ localStorage hoặc context sau khi login

  useEffect(() => {
    fetchEmployeeInfo();
  }, []);

  const fetchEmployeeInfo = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/nhanvien/${loggedInEmployeeId}`
      );
      console.log('Thông tin nhân viên:', response.data);
      setEmployeeName(response.data.NV_HOTEN);
    } catch (error) {
      console.error('Lỗi khi tải thông tin nhân viên:', error);
      toast.error(
        'Không thể tải thông tin nhân viên: ' +
          (error.response?.data || error.message)
      );
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard'); // Chuyển đến trang dashboard
  };

  return (
    <Container
      fluid
      className="welcome-container d-flex align-items-center justify-content-center min-vh-100"
    >
      <Row>
        <Col md={6} className="mx-auto">
          <Card className="welcome-card shadow-lg border-0 text-center">
            <Card.Body className="p-5">
              <h1 className="fw-bold mb-4 text-primary">Chào Mừng!</h1>
              <h3 className="mb-4">
                {employeeName ? `Xin chào, ${employeeName}` : 'Đang tải...'}
              </h3>
              <p className="text-muted mb-4">
                Bạn đã đăng nhập thành công vào hệ thống quản lý nhân sự.
              </p>
              <Button
                variant="primary"
                size="lg"
                className="rounded-pill px-4"
                onClick={handleGoToDashboard}
              >
                Xem Thông Tin Lương
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Container>
  );
};

export default WelcomePage;

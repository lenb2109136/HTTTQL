import React, { useState } from 'react';
import { Button, Container, Form, Card, Row, Col } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FiLock, FiMail } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // File CSS tùy chỉnh

const LoginPage = () => {
  const [formData, setFormData] = useState({
    identifier: '', // Email hoặc SĐT
    NV_PASSWORD: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const API_URL = 'http://localhost:8080/api';

  const validateForm = () => {
    const newErrors = {};
    if (!formData.identifier) {
      newErrors.identifier = 'Email hoặc số điện thoại là bắt buộc';
    }
    if (!formData.NV_PASSWORD) {
      newErrors.NV_PASSWORD = 'Mật khẩu là bắt buộc';
    }
    return newErrors;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      const payload = {
        identifier: formData.identifier,
        NV_PASSWORD: formData.NV_PASSWORD,
      };
      console.log('Dữ liệu gửi đi:', payload);

      const response = await axios.post(`${API_URL}/auth/login`, payload);
      console.log('Kết quả đăng nhập:', response.data);
      toast.success('Đăng nhập thành công!');

      // Lưu ID nhân viên (giả lập, có thể dùng token JWT trong thực tế)
      localStorage.setItem('employeeId', response.data.NV_ID);

      // Kiểm tra phòng ban để chuyển hướng
      const departmentName = response.data.PB_ID.PB_TEN;
      if (departmentName === 'Phòng Kế toán') {
        navigate('/'); // Dashboard cho kế toán
      } else {
        navigate('/userhome'); // UserHome cho các phòng ban khác
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      const errorMessage = error.response?.data || error.message;
      if (errorMessage === 'Invalid credentials') {
        toast.error('Email/SĐT hoặc mật khẩu không đúng!');
      } else {
        toast.error('Đăng nhập thất bại: ' + errorMessage);
      }
    }
  };

  return (
    <Container
      fluid
      className="login-container d-flex align-items-center justify-content-center min-vh-100"
    >
      <Row className="w-100">
        <Col md={4} className="mx-auto">
          <Card className="login-card shadow-lg border-0">
            <Card.Body className="p-5">
              <h2 className="text-center mb-4 fw-bold">Đăng Nhập</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4" controlId="formIdentifier">
                  <Form.Label className="fw-semibold">
                    Email hoặc Số điện thoại
                  </Form.Label>
                  <div className="input-icon">
                    <FiMail className="icon" />
                    <Form.Control
                      type="text"
                      placeholder="Nhập email hoặc số điện thoại"
                      value={formData.identifier}
                      onChange={e =>
                        setFormData({ ...formData, identifier: e.target.value })
                      }
                      isInvalid={!!errors.identifier}
                      className="rounded-pill ps-5"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.identifier}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4" controlId="formPassword">
                  <Form.Label className="fw-semibold">Mật khẩu</Form.Label>
                  <div className="input-icon">
                    <FiLock className="icon" />
                    <Form.Control
                      type="password"
                      placeholder="Nhập mật khẩu"
                      value={formData.NV_PASSWORD}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          NV_PASSWORD: e.target.value,
                        })
                      }
                      isInvalid={!!errors.NV_PASSWORD}
                      className="rounded-pill ps-5"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.NV_PASSWORD}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 rounded-pill py-2 fw-semibold"
                >
                  Đăng Nhập
                </Button>
              </Form>
              <div className="text-center mt-3">
                <a href="#" className="text-muted small">
                  Quên mật khẩu?
                </a>
              </div>
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

export default LoginPage;

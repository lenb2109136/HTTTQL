import React, { useState } from 'react';
import { Button, Container, Form, Card, Row, Col } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FiLock, FiMail } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    NV_PASSWORD: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const API_URL = 'http://localhost:8080/api';

  // Hàm validate form
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

  // Hàm xử lý thay đổi input
  const handleInputChange = e => {
    const { name, value } = e.target;
    console.log(`Input thay đổi - ${name}: ${value}`); // Debug giá trị input
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Hàm xử lý submit
  const handleSubmit = async e => {
    e.preventDefault();

    console.log('formData trước khi validate:', formData); // Debug toàn bộ formData

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const payload = {
      identifier: formData.identifier,
      NV_PASSWORD: formData.NV_PASSWORD,
    };
    console.log('Payload trước khi gửi:', payload); // Debug payload trước khi gửi

    try {
      const response = await axios.post(`${API_URL}/auth/login`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Kết quả từ server:', response.data);
      toast.success('Đăng nhập thành công!');

      localStorage.setItem('employeeId', response.data.NV_ID);

      const departmentName = response.data.PB_ID.PB_TEN;
      if (departmentName === 'Phòng Kế toán') {
        navigate('/');
      } else {
        navigate('/userhome');
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
    <div className="login-background">
      <Container
        fluid
        className="d-flex align-items-center justify-content-center min-vh-100"
      >
        <Row className="w-100">
          <Col xs={12} md={6} lg={4} className="mx-auto">
            <Card className="login-card shadow-lg border-0">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/1280px-Samsung_Logo.svg.png"
                    alt="Samsung Logo"
                    className="login-logo"
                  />
                  <h2 className="login-title mt-3">Đăng Nhập</h2>
                </div>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4" controlId="formIdentifier">
                    <Form.Label className="fw-medium text-muted">
                      Email hoặc Số điện thoại
                    </Form.Label>
                    <div className="input-wrapper">
                      <FiMail className="input-icon" />
                      <Form.Control
                        type="text"
                        name="identifier"
                        placeholder="Email hoặc số điện thoại"
                        value={formData.identifier}
                        onChange={handleInputChange}
                        isInvalid={!!errors.identifier}
                        className="custom-input"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.identifier}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formPassword">
                    <Form.Label className="fw-medium text-muted">
                      Mật khẩu
                    </Form.Label>
                    <div className="input-wrapper">
                      <FiLock className="input-icon" />
                      <Form.Control
                        type="password"
                        name="NV_PASSWORD"
                        placeholder="Mật khẩu"
                        value={formData.NV_PASSWORD}
                        onChange={handleInputChange}
                        isInvalid={!!errors.NV_PASSWORD}
                        className="custom-input"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.NV_PASSWORD}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 login-button"
                  >
                    Đăng Nhập
                  </Button>
                </Form>
                <div className="text-center mt-3">
                  <a href="#" className="text-muted small forgot-password">
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
    </div>
  );
};

export default LoginPage;

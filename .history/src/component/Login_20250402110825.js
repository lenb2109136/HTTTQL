import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { FiLock, FiMail } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const API_URL = 'http://localhost:8080/api';

  const validateForm = () => {
    const newErrors = {};
    if (!formData.identifier) {
      newErrors.identifier = 'Email là bắt buộc';
    }
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    }
    return newErrors;
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    console.log(`Input thay đổi - ${name}: ${value}`);
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const payload = {
      identifier: formData.identifier,
      password: formData.password,
    };

    try {
      const response = await axios.post(`${API_URL}/auth/login`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Phản hồi từ server:', response.data);

      // Kiểm tra nếu đăng nhập thành công
      if (response.data && response.data.NV_ID) {
        const employeeData = {
          NV_ID: response.data.NV_ID,
          NV_HOTEN: response.data.NV_HOTEN || 'Người dùng',
          avatar:
            response.data.avatar ||
            'https://cdn-icons-png.flaticon.com/512/219/219986.png',
        };

        // Lưu thông tin vào localStorage
        localStorage.setItem('employee', JSON.stringify(employeeData));
        console.log('Đã lưu employee vào localStorage:', employeeData);

        // Điều hướng ngay lập tức về /userhome mà không hiển thị toast
        console.log('Điều hướng đến /userhome');
        navigate('/userhome', { replace: true });
      } else {
        console.log('Đăng nhập thất bại: Không có NV_ID trong response');
        setErrors({ general: 'Email hoặc mật khẩu không đúng!' });
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      const errorMessage = error.response?.data || error.message;
      setErrors({ general: 'Đăng nhập thất bại: ' + errorMessage });
    }
  };

  return (
    <div className="login-page">
      <Container className="login-container">
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} md={6} lg={4}>
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
                  {errors.general && (
                    <div
                      className="alert alert-danger text-center mb-3"
                      role="alert"
                    >
                      {errors.general}
                    </div>
                  )}
                  <Form.Group className="mb-4" controlId="formIdentifier">
                    <Form.Label className="fw-medium text-muted">
                      Email
                    </Form.Label>
                    <div className="input-wrapper">
                      <FiMail className="input-icon" />
                      <Form.Control
                        type="text"
                        name="identifier"
                        placeholder="Nhập email"
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
                        name="password"
                        placeholder="Nhập mật khẩu"
                        value={formData.password}
                        onChange={handleInputChange}
                        isInvalid={!!errors.password}
                        className="custom-input"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
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
      </Container>
    </div>
  );
};

export default LoginPage;

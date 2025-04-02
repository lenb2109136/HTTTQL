import React, { useState } from 'react';
import { Button, Container, Form, Card, Alert } from 'react-bootstrap';
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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = 'http://localhost:8080/api';

  const validateForm = () => {
    const newErrors = {};
    if (!formData.identifier) newErrors.identifier = 'Vui lòng nhập email';
    else if (!/\S+@\S+\.\S+/.test(formData.identifier))
      newErrors.identifier = 'Email không hợp lệ';
    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu';
    return newErrors;
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    // Clear errors for the field being edited
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrors({});

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        {
          identifier: formData.identifier,
          password: formData.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data && response.data.NV_ID) {
        const employeeData = {
          NV_ID: response.data.NV_ID,
          NV_HOTEN: response.data.NV_HOTEN || 'Người dùng',
          avatar:
            response.data.avatar ||
            'https://cdn-icons-png.flaticon.com/512/219/219986.png',
        };

        localStorage.setItem('employee', JSON.stringify(employeeData));
        navigate('/userhome', { replace: true });
      } else {
        setErrors({ general: 'Email hoặc mật khẩu không đúng' });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'Đăng nhập thất bại. Vui lòng thử lại.';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container className="login-container">
        <Card className="login-card">
          <Card.Body>
            <div className="text-center mb-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/1280px-Samsung_Logo.svg.png"
                alt="Samsung Logo"
                className="login-logo"
              />
              <h2 className="login-title">Đăng Nhập</h2>
            </div>
            <Form onSubmit={handleSubmit}>
              {errors.general && (
                <Alert variant="danger">{errors.general}</Alert>
              )}
              <Form.Group className="mb-3" controlId="formIdentifier">
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <Form.Control
                    type="email"
                    name="identifier"
                    placeholder="Nhập email"
                    value={formData.identifier}
                    onChange={handleInputChange}
                    isInvalid={!!errors.identifier}
                    className="custom-input"
                    autoComplete="email"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.identifier}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>

              <Form.Group className="mb-4" controlId="formPassword">
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
                    autoComplete="current-password"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>

              <Button
                type="submit"
                className="w-100 login-button"
                disabled={isLoading}
              >
                {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
              </Button>
            </Form>
            <div className="text-center mt-3">
              <a href="#" className="forgot-password">
                Quên mật khẩu?
              </a>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default LoginPage;

import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Card, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';
import { FiLock, FiMail } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const navigate = useNavigate();
  const API_URL = 'http://localhost:8080/api';

  useEffect(() => {
    const employee = localStorage.getItem('employee');
    if (employee) {
      const parsedEmployee = JSON.parse(employee);
      if (parsedEmployee.email === 'admin@gmail.com') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/userhome', { replace: true });
      }
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.identifier) newErrors.identifier = 'Vui lòng nhập email';
    else if (!/\S+@\S+\.\S+/.test(formData.identifier))
      newErrors.identifier = 'Email không hợp lệ';
    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu';
    return newErrors;
  };

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
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

    // Kiểm tra nếu là admin@gmail.com thì chuyển hướng ngay
    if (formData.identifier === 'admin@gmail.com') {
      const employeeData = {
        NV_ID: 'admin', // Giá trị mặc định cho admin
        NV_HOTEN: 'Admin', // Tên mặc định
        email: formData.identifier,
        avatar: 'https://cdn-icons-png.flaticon.com/512/219/219986.png',
      };

      if (!formData.rememberMe) {
        localStorage.setItem('employee', JSON.stringify(employeeData));
        localStorage.setItem('loginSuccess', 'true');
      }

      navigate('/dashboard', { replace: true });
      setIsLoading(false);
      return; // Thoát khỏi hàm để không gọi API
    }

    // Nếu không phải admin, tiếp tục gọi API
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
          email: formData.identifier,
          avatar:
            response.data.avatar ||
            'https://cdn-icons-png.flaticon.com/512/219/219986.png',
        };

        if (!formData.rememberMe) {
          localStorage.setItem('employee', JSON.stringify(employeeData));
          localStorage.setItem('loginSuccess', 'true');
        }

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

  const handleResetPassword = e => {
    e.preventDefault();
    if (!resetEmail) {
      alert('Vui lòng nhập email để đặt lại mật khẩu.');
      return;
    }
    console.log('Gửi yêu cầu đặt lại mật khẩu cho:', resetEmail);
    alert(`Yêu cầu đặt lại mật khẩu đã được gửi đến ${resetEmail}`);
    setResetEmail('');
    setShowResetModal(false);
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

              <Form.Group className="mb-3" controlId="formPassword">
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

              <Form.Group className="mb-4 d-flex justify-content-between align-items-center">
                <Form.Check
                  type="checkbox"
                  label="Ghi nhớ đăng nhập"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
                <a
                  href="#"
                  className="forgot-password"
                  onClick={() => setShowResetModal(true)}
                >
                  Quên mật khẩu?
                </a>
              </Form.Group>

              <Button
                type="submit"
                className="w-100 login-button"
                disabled={isLoading}
              >
                <span className="login-button-text">
                  {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                </span>
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>

      <Modal
        show={showResetModal}
        onHide={() => setShowResetModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Đặt lại mật khẩu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleResetPassword}>
            <Form.Group className="mb-3" controlId="formResetEmail">
              <Form.Label>Nhập email của bạn</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                autoComplete="email"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Gửi yêu cầu
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LoginPage;

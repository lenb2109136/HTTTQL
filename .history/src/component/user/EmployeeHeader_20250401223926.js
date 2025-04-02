import React, { useState, useEffect } from 'react';
import {
  Navbar,
  Container,
  FormControl,
  Badge,
  Dropdown,
  Modal,
  Form,
  Button,
  Row,
  Col,
  InputGroup,
} from 'react-bootstrap';
import {
  FiBell,
  FiLogOut,
  FiEdit,
  FiLock,
  FiClock,
  FiSearch,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './EmployeeHeader.css';

const EmployeeHeader = () => {
  const navigate = useNavigate();
  const API_URL = 'http://localhost:8080/api';

  // Lấy thông tin người dùng từ localStorage
  const employee = JSON.parse(localStorage.getItem('employee')) || {
    NV_HOTEN: 'Người dùng',
    NV_ID: null,
    avatar: 'https://cdn-icons-png.flaticon.com/512/219/219986.png',
  };

  // Lấy ngày tháng hiện tại
  const today = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Danh sách thông báo (dữ liệu mẫu)
  const [notifications] = useState([
    {
      id: 1,
      message: 'Yêu cầu ứng lương đã được phê duyệt',
      time: '2 giờ trước',
    },
    { id: 2, message: 'Bạn có lương mới tháng 4/2025', time: '1 ngày trước' },
    { id: 3, message: 'Khiếu nại đã được xử lý', time: '2 ngày trước' },
  ]);

  // Trạng thái hiển thị modal
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  // Trạng thái cho modal chỉnh sửa thông tin cá nhân
  const [profileFormData, setProfileFormData] = useState({
    NV_HOTEN: '',
    NV_NGAYSINH: '',
    NV_SDT: '',
    NV_DIACHI: '',
  });
  const [profileErrors, setProfileErrors] = useState({});

  // Trạng thái cho modal đổi mật khẩu
  const [passwordFormData, setPasswordFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Tải thông tin cá nhân khi mở modal chỉnh sửa
  useEffect(() => {
    if (showEditProfileModal && employee.NV_ID) {
      axios
        .get(`${API_URL}/nhanvien/${employee.NV_ID}`)
        .then(response => {
          const data = response.data;
          setProfileFormData({
            NV_HOTEN: data.NV_HOTEN || '',
            NV_NGAYSINH: data.NV_NGAYSINH || '',
            NV_SDT: data.NV_SDT || '',
            NV_DIACHI: data.NV_DIACHI || '',
          });
        })
        .catch(error => {
          console.error('Lỗi khi tải thông tin cá nhân:', error);
          toast.error('Không thể tải thông tin cá nhân!');
        });
    }
  }, [showEditProfileModal, employee.NV_ID]);

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast.success('Đăng xuất thành công!', {
      position: 'top-right',
      autoClose: 2000,
    });
    navigate('/login', { replace: true });
  };

  // Validate form chỉnh sửa thông tin cá nhân
  const validateProfileForm = () => {
    const newErrors = {};
    if (!profileFormData.NV_HOTEN) newErrors.NV_HOTEN = 'Họ tên là bắt buộc';
    if (!profileFormData.NV_NGAYSINH)
      newErrors.NV_NGAYSINH = 'Ngày sinh là bắt buộc';
    if (!profileFormData.NV_SDT) newErrors.NV_SDT = 'Số điện thoại là bắt buộc';
    if (!profileFormData.NV_DIACHI) newErrors.NV_DIACHI = 'Địa chỉ là bắt buộc';
    return newErrors;
  };

  // Xử lý submit chỉnh sửa thông tin cá nhân
  const handleProfileSubmit = async e => {
    e.preventDefault();
    const formErrors = validateProfileForm();
    if (Object.keys(formErrors).length > 0) {
      setProfileErrors(formErrors);
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      const payload = {
        NV_HOTEN: profileFormData.NV_HOTEN,
        NV_NGAYSINH: profileFormData.NV_NGAYSINH,
        NV_SDT: profileFormData.NV_SDT,
        NV_DIACHI: profileFormData.NV_DIACHI,
        pbIdTemp: null,
        NV_GIOITINH: null,
        NV_EMAIL: null,
        NV_USERNAME: null,
        NV_PASSWORD: null,
      };

      const response = await axios.put(
        `${API_URL}/nhanvien/${employee.NV_ID}`,
        payload
      );
      toast.success('Cập nhật thông tin thành công!');
      localStorage.setItem(
        'employee',
        JSON.stringify({ ...employee, NV_HOTEN: profileFormData.NV_HOTEN })
      );
      setShowEditProfileModal(false);
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      toast.error(
        'Không thể cập nhật thông tin: ' +
          (error.response?.data || error.message)
      );
    }
  };

  // Validate form đổi mật khẩu
  const validatePasswordForm = () => {
    const newErrors = {};
    if (!passwordFormData.oldPassword)
      newErrors.oldPassword = 'Mật khẩu cũ là bắt buộc';
    if (!passwordFormData.newPassword)
      newErrors.newPassword = 'Mật khẩu mới là bắt buộc';
    if (!passwordFormData.confirmPassword)
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    if (
      passwordFormData.newPassword &&
      passwordFormData.confirmPassword &&
      passwordFormData.newPassword !== passwordFormData.confirmPassword
    )
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    return newErrors;
  };

  // Xử lý submit đổi mật khẩu
  const handlePasswordSubmit = async e => {
    e.preventDefault();
    const formErrors = validatePasswordForm();
    if (Object.keys(formErrors).length > 0) {
      setPasswordErrors(formErrors);
      toast.error('Vui lòng kiểm tra lại thông tin!');
      return;
    }

    try {
      const payload = {
        NV_PASSWORD: passwordFormData.newPassword,
        oldPassword: passwordFormData.oldPassword,
      };
      const response = await axios.put(
        `${API_URL}/nhanvien/${employee.NV_ID}/change-password`,
        payload
      );
      toast.success('Đổi mật khẩu thành công!');
      setShowChangePasswordModal(false);
      setPasswordFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordErrors({});
    } catch (error) {
      console.error('Lỗi khi đổi mật khẩu:', error);
      const errorMessage = error.response?.data || error.message;
      if (errorMessage.includes('Mật khẩu cũ không đúng')) {
        setPasswordErrors({ oldPassword: 'Mật khẩu cũ không đúng' });
      }
      toast.error('Đổi mật khẩu thất bại: ' + errorMessage);
    }
  };

  return (
    <>
      <Navbar className="header">
        <Container>
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <FormControl
              type="search"
              placeholder="Tìm kiếm..."
              className="search-input"
            />
          </div>

          <div className="header-right">
            <div className="current-date-time">
              <FiClock className="clock-icon" />
              <span>{today}</span>
            </div>

            <div className="notification-icon-wrapper">
              <Dropdown>
                <Dropdown.Toggle
                  variant="link"
                  id="dropdown-notifications"
                  className="notification-toggle"
                  noCaret
                >
                  <FiBell className="notification-icon" />
                  <Badge bg="danger" className="notification-badge">
                    {notifications.length}
                  </Badge>
                </Dropdown.Toggle>

                <Dropdown.Menu className="notification-menu">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <Dropdown.Item
                        key={notification.id}
                        className="notification-item"
                      >
                        <div className="notification-content">
                          <span>{notification.message}</span>
                          <small>{notification.time}</small>
                        </div>
                      </Dropdown.Item>
                    ))
                  ) : (
                    <Dropdown.Item className="notification-item">
                      Không có thông báo
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div className="profile-section">
              <Dropdown>
                <Dropdown.Toggle
                  variant="link"
                  id="dropdown-user"
                  className="profile-toggle"
                >
                  <div className="avatar">
                    <img
                      src={employee.avatar}
                      alt="Avatar"
                      className="avatar-img"
                    />
                  </div>
                  <span className="user-name">{employee.NV_HOTEN}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu className="profile-menu">
                  <Dropdown.Item
                    onClick={() => setShowEditProfileModal(true)}
                    className="menu-item"
                  >
                    <FiEdit className="menu-icon" /> Thông tin cá nhân
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setShowChangePasswordModal(true)}
                    className="menu-item"
                  >
                    <FiLock className="menu-icon" /> Đổi mật khẩu
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout} className="menu-item">
                    <FiLogOut className="menu-icon" /> Đăng xuất
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Container>
      </Navbar>

      {/* Modal chỉnh sửa thông tin cá nhân */}
      <Modal
        show={showEditProfileModal}
        onHide={() => setShowEditProfileModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="d-flex justify-content-center">
          <Modal.Title className="w-100 text-center">
            Chỉnh sửa thông tin cá nhân
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleProfileSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Họ tên</Form.Label>
                  <Form.Control
                    type="text"
                    value={profileFormData.NV_HOTEN}
                    onChange={e =>
                      setProfileFormData({
                        ...profileFormData,
                        NV_HOTEN: e.target.value,
                      })
                    }
                    isInvalid={!!profileErrors.NV_HOTEN}
                  />
                  <Form.Control.Feedback type="invalid">
                    {profileErrors.NV_HOTEN}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Ngày sinh</Form.Label>
                  <Form.Control
                    type="date"
                    value={profileFormData.NV_NGAYSINH}
                    onChange={e =>
                      setProfileFormData({
                        ...profileFormData,
                        NV_NGAYSINH: e.target.value,
                      })
                    }
                    isInvalid={!!profileErrors.NV_NGAYSINH}
                  />
                  <Form.Control.Feedback type="invalid">
                    {profileErrors.NV_NGAYSINH}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    value={profileFormData.NV_SDT}
                    onChange={e =>
                      setProfileFormData({
                        ...profileFormData,
                        NV_SDT: e.target.value,
                      })
                    }
                    isInvalid={!!profileErrors.NV_SDT}
                  />
                  <Form.Control.Feedback type="invalid">
                    {profileErrors.NV_SDT}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Địa chỉ</Form.Label>
                  <Form.Control
                    type="text"
                    value={profileFormData.NV_DIACHI}
                    onChange={e =>
                      setProfileFormData({
                        ...profileFormData,
                        NV_DIACHI: e.target.value,
                      })
                    }
                    isInvalid={!!profileErrors.NV_DIACHI}
                  />
                  <Form.Control.Feedback type="invalid">
                    {profileErrors.NV_DIACHI}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-center mt-3">
              <Button variant="primary" type="submit">
                Lưu
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal đổi mật khẩu */}
      <Modal
        show={showChangePasswordModal}
        onHide={() => setShowChangePasswordModal(false)}
        centered
      >
        <Modal.Header closeButton className="d-flex justify-content-center">
          <Modal.Title className="w-100 text-center">Đổi mật khẩu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePasswordSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu cũ</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showOldPassword ? 'text' : 'password'}
                  value={passwordFormData.oldPassword}
                  onChange={e =>
                    setPasswordFormData({
                      ...passwordFormData,
                      oldPassword: e.target.value,
                    })
                  }
                  isInvalid={!!passwordErrors.oldPassword}
                />
                <InputGroup.Text
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  style={{ cursor: 'pointer' }}
                >
                  {showOldPassword ? <FiEyeOff /> : <FiEye />}
                </InputGroup.Text>
                <Form.Control.Feedback type="invalid">
                  {passwordErrors.oldPassword}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu mới</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordFormData.newPassword}
                  onChange={e =>
                    setPasswordFormData({
                      ...passwordFormData,
                      newPassword: e.target.value,
                    })
                  }
                  isInvalid={!!passwordErrors.newPassword}
                />
                <InputGroup.Text
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{ cursor: 'pointer' }}
                >
                  {showNewPassword ? <FiEyeOff /> : <FiEye />}
                </InputGroup.Text>
                <Form.Control.Feedback type="invalid">
                  {passwordErrors.newPassword}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Xác nhận mật khẩu mới</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordFormData.confirmPassword}
                  onChange={e =>
                    setPasswordFormData({
                      ...passwordFormData,
                      confirmPassword: e.target.value,
                    })
                  }
                  isInvalid={!!passwordErrors.confirmPassword}
                />
                <InputGroup.Text
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ cursor: 'pointer' }}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </InputGroup.Text>
                <Form.Control.Feedback type="invalid">
                  {passwordErrors.confirmPassword}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <div className="d-flex justify-content-center mt-3">
              <Button variant="primary" type="submit">
                Lưu
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EmployeeHeader;

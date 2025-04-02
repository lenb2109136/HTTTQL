import React, { useState, useEffect } from 'react';
import {
  Container,
  Navbar,
  Form,
  FormControl,
  Button,
  Table,
  Modal,
  Row,
  Col,
  Dropdown,
  Badge,
} from 'react-bootstrap';
import { FiBell, FiLogOut, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserHome = () => {
  const [phieuLuong, setPhieuLuong] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    NV_HOTEN: '',
    NV_EMAIL: '',
    NV_SDT: '',
    NV_DIACHI: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const API_URL = 'http://localhost:8080/api';
  const employeeId = localStorage.getItem('employeeId');

  // Lấy ngày tháng hiện tại
  const today = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    if (!employeeId) {
      navigate('/login');
      return;
    }

    fetchPhieuLuong();
    fetchEmployee();
  }, [employeeId, navigate]);

  const fetchPhieuLuong = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/phieu-luong?employeeId=${employeeId}`
      );
      console.log('Dữ liệu phiếu lương:', response.data);
      setPhieuLuong(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy phiếu lương:', error);
      toast.error('Không thể tải danh sách phiếu lương: ' + error.message);
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`${API_URL}/nhanvien/${employeeId}`);
      console.log('Dữ liệu nhân viên:', response.data);
      setEmployee(response.data);
      setFormData({
        NV_HOTEN: response.data.NV_HOTEN || '',
        NV_EMAIL: response.data.NV_EMAIL || '',
        NV_SDT: response.data.NV_SDT || '',
        NV_DIACHI: response.data.NV_DIACHI || '',
      });
    } catch (error) {
      console.error('Lỗi khi lấy thông tin nhân viên:', error);
      toast.error('Không thể tải thông tin nhân viên: ' + error.message);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.NV_HOTEN) {
      newErrors.NV_HOTEN = 'Họ tên là bắt buộc';
    }
    if (!formData.NV_EMAIL) {
      newErrors.NV_EMAIL = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.NV_EMAIL)) {
      newErrors.NV_EMAIL = 'Email không hợp lệ';
    }
    if (!formData.NV_SDT) {
      newErrors.NV_SDT = 'Số điện thoại là bắt buộc';
    } else if (!/^\d{10}$/.test(formData.NV_SDT)) {
      newErrors.NV_SDT = 'Số điện thoại phải có 10 chữ số';
    }
    if (!formData.NV_DIACHI) {
      newErrors.NV_DIACHI = 'Địa chỉ là bắt buộc';
    }
    return newErrors;
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleUpdateProfile = async e => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error('Vui lòng điền đầy đủ và đúng thông tin!');
      return;
    }

    try {
      const payload = {
        ...formData,
      };
      const response = await axios.put(
        `${API_URL}/nhanvien/${employeeId}`,
        payload
      );
      console.log('Cập nhật thông tin:', response.data);
      toast.success('Cập nhật thông tin thành công!');
      setEmployee(response.data);
      setShowModal(false);
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      toast.error(
        'Cập nhật thông tin thất bại: ' +
          (error.response?.data || error.message)
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('employeeId');
    toast.success('Đăng xuất thành công!');
    navigate('/login');
  };

  return (
    <>
      {/* Header */}
      <Navbar bg="light" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/1280px-Samsung_Logo.svg.png"
              alt="Samsung Logo"
              style={{ height: '40px' }}
            />
          </Navbar.Brand>
          <Form className="d-flex mx-auto" style={{ width: '40%' }}>
            <FormControl
              type="search"
              placeholder="Tìm kiếm..."
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-primary">Tìm</Button>
          </Form>
          <div className="d-flex align-items-center">
            <span className="me-3">{today}</span>
            <div className="position-relative me-3">
              <FiBell size={24} />
              <Badge
                bg="danger"
                className="position-absolute top-0 start-100 translate-middle"
              >
                3
              </Badge>
            </div>
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                id="dropdown-user"
                className="d-flex align-items-center text-decoration-none"
              >
                <img
                  src="https://via.placeholder.com/40"
                  alt="Avatar"
                  className="rounded-circle me-2"
                  style={{ width: '40px', height: '40px' }}
                />
                <span>{employee ? employee.NV_HOTEN : 'Nhân viên'}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item onClick={() => setShowModal(true)}>
                  <FiUser className="me-2" /> Chỉnh sửa thông tin cá nhân
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>
                  <FiLogOut className="me-2" /> Đăng xuất
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Container>
      </Navbar>

      {/* Nội dung chính */}
      <Container className="py-4">
        <h1 className="text-center mb-4">Trang Nhân Viên</h1>
        <p className="text-center mb-4">
          Chào mừng {employee ? employee.NV_HOTEN : 'bạn'} đến với trang cá nhân
          của nhân viên!
        </p>

        {/* Bảng phiếu lương */}
        <h3 className="mb-3">Danh sách phiếu lương</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tháng/Năm</th>
              <th>Lương cơ bản</th>
              <th>Lương tăng ca</th>
              <th>Tổng thu nhập</th>
              <th>Tổng khấu trừ</th>
              <th>Ứng lương</th>
              <th>Lương nhận</th>
              <th>Nợ</th>
              <th>Ngày phát</th>
            </tr>
          </thead>
          <tbody>
            {phieuLuong.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center">
                  Không có phiếu lương nào.
                </td>
              </tr>
            ) : (
              phieuLuong.map((phieu, index) => (
                <tr key={phieu.id}>
                  <td>{index + 1}</td>
                  <td>
                    {new Date(phieu.ngayPhat).toLocaleDateString('vi-VN', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </td>
                  <td>{phieu.luongCoBan?.toLocaleString()} VNĐ</td>
                  <td>{phieu.luongTangCa?.toLocaleString()} VNĐ</td>
                  <td>{phieu.tongThuNhap?.toLocaleString()} VNĐ</td>
                  <td>{phieu.tongKhauTru?.toLocaleString()} VNĐ</td>
                  <td>{phieu.ungLuong?.toLocaleString()} VNĐ</td>
                  <td>{phieu.luongNhan?.toLocaleString()} VNĐ</td>
                  <td>{phieu.no?.toLocaleString()} VNĐ</td>
                  <td>
                    {new Date(phieu.ngayPhat).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Container>

      {/* Modal chỉnh sửa thông tin cá nhân */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa thông tin cá nhân</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateProfile}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Họ tên</Form.Label>
                  <Form.Control
                    type="text"
                    name="NV_HOTEN"
                    value={formData.NV_HOTEN}
                    onChange={handleInputChange}
                    isInvalid={!!errors.NV_HOTEN}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.NV_HOTEN}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="NV_EMAIL"
                    value={formData.NV_EMAIL}
                    onChange={handleInputChange}
                    isInvalid={!!errors.NV_EMAIL}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.NV_EMAIL}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    name="NV_SDT"
                    value={formData.NV_SDT}
                    onChange={handleInputChange}
                    isInvalid={!!errors.NV_SDT}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.NV_SDT}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Địa chỉ</Form.Label>
                  <Form.Control
                    type="text"
                    name="NV_DIACHI"
                    value={formData.NV_DIACHI}
                    onChange={handleInputChange}
                    isInvalid={!!errors.NV_DIACHI}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.NV_DIACHI}
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

      <ToastContainer />
    </>
  );
};

export default UserHome;

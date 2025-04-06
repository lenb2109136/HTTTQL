import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Container,
  Row,
  Col,
  Modal,
  Form,
  Alert,
  InputGroup,
} from 'react-bootstrap';
import { FiPlus, FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    nv_HOTEN: '',
    pb_ID: '',
    nv_NGAYSINH: '',
    nv_GIOITINH: null,
    nv_EMAIL: '',
    nv_SDT: '',
    nv_USERNAME: '',
    nv_PASSWORD: '',
    nv_DIACHI: '',
  });
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const API_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_URL}/nhanvien`);
      console.log('Dữ liệu nhân viên từ backend:', response.data);
      setEmployees(response.data);
      // Xóa toast.success('Đã tải danh sách nhân viên thành công!');
    } catch (error) {
      console.error('Lỗi khi tải danh sách nhân viên:', error);
      toast.error(
        'Không thể tải danh sách nhân viên: ' +
          (error.response?.data || error.message)
      );
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${API_URL}/phongban`);
      console.log('Dữ liệu phòng ban từ backend:', response.data);
      setDepartments(response.data);
      // Xóa toast.success('Đã tải danh sách phòng ban thành công!');
    } catch (error) {
      console.error('Lỗi khi tải danh sách phòng ban:', error);
      toast.error(
        'Không thể tải danh sách phòng ban: ' +
          (error.response?.data || error.message)
      );
    }
  };

  const handleDelete = id => {
    console.log('Chuẩn bị xóa nhân viên ID:', id);
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      console.log('Xác nhận xóa nhân viên ID:', deleteId);
      const response = await axios.delete(`${API_URL}/nhanvien/${deleteId}`);
      console.log('Kết quả xóa:', response.data);
      toast.success('Đã xóa nhân viên thành công!');
      fetchEmployees();
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Lỗi khi xóa nhân viên:', error);
      const errorMessage = error.response?.data || error.message;
      if (errorMessage.includes('foreign key constraint fails')) {
        toast.error(
          'Không thể xóa nhân viên vì nhân viên này đang được tham chiếu trong dữ liệu khác (ví dụ: chi tiết bậc lương, ứng lương).'
        );
      } else {
        toast.error('Không thể xóa nhân viên: ' + errorMessage);
      }
      setShowDeleteModal(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nv_HOTEN) newErrors.nv_HOTEN = 'Họ tên là bắt buộc';
    if (!formData.pb_ID) newErrors.pb_ID = 'Phòng ban là bắt buộc';
    if (!formData.nv_NGAYSINH) newErrors.nv_NGAYSINH = 'Ngày sinh là bắt buộc';
    if (formData.nv_GIOITINH === null)
      newErrors.nv_GIOITINH = 'Giới tính là bắt buộc';
    if (!formData.nv_EMAIL) newErrors.nv_EMAIL = 'Email là bắt buộc';
    if (!formData.nv_SDT) newErrors.nv_SDT = 'Số điện thoại là bắt buộc';
    if (!formData.nv_USERNAME) newErrors.nv_USERNAME = 'Username là bắt buộc';
    if (!formData.nv_PASSWORD) newErrors.nv_PASSWORD = 'Mật khẩu là bắt buộc';
    if (!formData.nv_DIACHI) newErrors.nv_DIACHI = 'Địa chỉ là bắt buộc';
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
        ...formData,
        pb_ID: { pb_ID: parseInt(formData.pb_ID) },
      };
      console.log('Gửi dữ liệu:', payload);

      if (editingEmployee) {
        const response = await axios.put(
          `${API_URL}/nhanvien/${editingEmployee.nv_ID}`,
          payload
        );
        console.log('Kết quả sửa:', response.data);
        toast.success('Đã sửa thông tin nhân viên thành công!');
      } else {
        const response = await axios.post(`${API_URL}/nhanvien`, payload);
        console.log('Kết quả thêm:', response.data);
        toast.success('Đã thêm nhân viên thành công!');
      }
      setShowModal(false);
      setEditingEmployee(null);
      resetForm();
      fetchEmployees();
    } catch (error) {
      console.error('Lỗi khi lưu nhân viên:', error);
      toast.error(
        'Không thể lưu nhân viên: ' + (error.response?.data || error.message)
      );
    }
  };

  const handleEdit = employee => {
    console.log('Chỉnh sửa nhân viên:', employee);
    setEditingEmployee(employee);
    setFormData({
      nv_HOTEN: employee.nv_HOTEN || '',
      pb_ID: employee.pb_ID?.pb_ID || '',
      nv_NGAYSINH: employee.nv_NGAYSINH || '',
      nv_GIOITINH: employee.nv_GIOITINH,
      nv_EMAIL: employee.nv_EMAIL || '',
      nv_SDT: employee.nv_SDT || '',
      nv_USERNAME: employee.nv_USERNAME || '',
      nv_PASSWORD: employee.nv_PASSWORD || '',
      nv_DIACHI: employee.nv_DIACHI || '',
    });
    setErrors({});
    setShowPassword(false);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      nv_HOTEN: '',
      pb_ID: '',
      nv_NGAYSINH: '',
      nv_GIOITINH: null,
      nv_EMAIL: '',
      nv_SDT: '',
      nv_USERNAME: '',
      nv_PASSWORD: '',
      nv_DIACHI: '',
    });
    setErrors({});
    setShowPassword(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
    resetForm();
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container>
      <h1 className="text-center my-4">Quản lý nhân viên</h1>
      <Row className="mb-3 d-flex justify-content-between align-items-center">
        <Col>
          <h2>Danh sách nhân viên</h2>
        </Col>
        <Col className="text-end">
          <Button
            variant="primary"
            onClick={() => {
              setShowModal(true);
              resetForm();
            }}
          >
            <FiPlus /> Thêm nhân viên
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>STT</th>
            <th>Họ tên</th>
            <th>Phòng ban</th>
            <th>Số điện thoại</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                Không có nhân viên nào.
              </td>
            </tr>
          ) : (
            employees.map((emp, index) => (
              <tr key={emp.nv_ID}>
                <td>{index + 1}</td>
                <td>{emp.nv_HOTEN || 'N/A'}</td>
                <td>{emp.pb_ID?.pb_TEN || 'N/A'}</td>
                <td>{emp.nv_SDT || 'N/A'}</td>
                <td>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => handleEdit(emp)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(emp.nv_ID)}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton className="d-flex justify-content-center">
          <Modal.Title className="w-100 text-center">
            {editingEmployee ? 'Sửa nhân viên' : 'Thêm nhân viên'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Họ tên</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.nv_HOTEN}
                    onChange={e =>
                      setFormData({ ...formData, nv_HOTEN: e.target.value })
                    }
                    isInvalid={!!errors.nv_HOTEN}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nv_HOTEN}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phòng ban</Form.Label>
                  <Form.Select
                    value={formData.pb_ID}
                    onChange={e =>
                      setFormData({ ...formData, pb_ID: e.target.value })
                    }
                    isInvalid={!!errors.pb_ID}
                  >
                    <option value="">Chọn phòng ban</option>
                    {departments.map(dep => (
                      <option key={dep.pb_ID} value={dep.pb_ID}>
                        {dep.pb_TEN}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.pb_ID}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Ngày sinh</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.nv_NGAYSINH}
                    onChange={e =>
                      setFormData({ ...formData, nv_NGAYSINH: e.target.value })
                    }
                    isInvalid={!!errors.nv_NGAYSINH}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nv_NGAYSINH}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Giới tính</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Nam"
                      name="gender"
                      checked={formData.nv_GIOITINH === true}
                      onChange={() =>
                        setFormData({ ...formData, nv_GIOITINH: true })
                      }
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Nữ"
                      name="gender"
                      checked={formData.nv_GIOITINH === false}
                      onChange={() =>
                        setFormData({ ...formData, nv_GIOITINH: false })
                      }
                    />
                  </div>
                  {errors.nv_GIOITINH && (
                    <Alert variant="danger" className="mt-2">
                      {errors.nv_GIOITINH}
                    </Alert>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.nv_EMAIL}
                    onChange={e =>
                      setFormData({ ...formData, nv_EMAIL: e.target.value })
                    }
                    isInvalid={!!errors.nv_EMAIL}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nv_EMAIL}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.nv_SDT}
                    onChange={e =>
                      setFormData({ ...formData, nv_SDT: e.target.value })
                    }
                    isInvalid={!!errors.nv_SDT}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nv_SDT}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.nv_USERNAME}
                    onChange={e =>
                      setFormData({ ...formData, nv_USERNAME: e.target.value })
                    }
                    isInvalid={!!errors.nv_USERNAME}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nv_USERNAME}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      value={formData.nv_PASSWORD}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          nv_PASSWORD: e.target.value,
                        })
                      }
                      isInvalid={!!errors.nv_PASSWORD}
                    />
                    <InputGroup.Text
                      onClick={toggleShowPassword}
                      style={{ cursor: 'pointer' }}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.nv_PASSWORD}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Địa chỉ</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.nv_DIACHI}
                    onChange={e =>
                      setFormData({ ...formData, nv_DIACHI: e.target.value })
                    }
                    isInvalid={!!errors.nv_DIACHI}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nv_DIACHI}
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

      {/* Modal xác nhận xóa */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn xóa nhân viên này không?</p>
          <p className="text-danger">Hành động này không thể hoàn tác!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>

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

export default EmployeesPage;

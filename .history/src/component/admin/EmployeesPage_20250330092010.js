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
import { FiPlus, FiEye, FiEyeOff } from 'react-icons/fi'; // Thêm icon mắt
import axios from 'axios';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
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
  const [showPassword, setShowPassword] = useState(false); // State để quản lý ẩn/hiện mật khẩu

  const API_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_URL}/nhanvien`);
      console.log('Dữ liệu từ backend:', response.data);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${API_URL}/phongban`);
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/nhanvien/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nv_HOTEN) newErrors.nv_HOTEN = 'Họ tên là bắt buộc';
    if (!formData.pb_ID) newErrors.pb_ID = 'Phòng ban là bắt buộc';
    if (! WformData.nv_NGAYSINH) newErrors.nv_NGAYSINH = 'Ngày sinh là bắt buộc';
    if (formData.nv_GIOITINH === null) newErrors.nv_GIOITINH = 'Giới tính là bắt buộc';
    if (!formData.nv_EMAIL) newErrors.nv_EMAIL = 'Email là bắt buộc';
    if (!formData.nv_SDT) newErrors.nv_SDT = 'Số điện thoại là bắt buộc';
    if (!formData.nv_USERNAME) newErrors.nv_USERNAME = 'Username là bắt buộc';
    if (!formData.nv_PASSWORD) newErrors.nv_PASSWORD = 'Mật khẩu là bắt buộc';
    if (!formData.nv_DIACHI) newErrors.nv_DIACHI = 'Địa chỉ là bắt buộc';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const payload = {
        ...formData,
        pb_ID: { pb_ID: parseInt(formData.pb_ID) },
      };

      if (editingEmployee) {
        await axios.put(`${API_URL}/nhanvien/${editingEmployee.nv_ID}`, payload);
      } else {
        await axios.post(`${API_URL}/nhanvien`, payload);
      }
      setShowModal(false);
      setEditingEmployee(null);
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
      setShowPassword(false); // Reset trạng thái ẩn/hiện mật khẩu
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      nv_HOTEN: employee.nv_HOTEN,
      pb_ID: employee.pb_ID?.pb_ID || '',
      nv_NGAYSINH: employee.nv_NGAYSINH,
      nv_GIOITINH: employee.nv_GIOITINH,
      nv_EMAIL: employee.nv_EMAIL,
      nv_SDT: employee.nv_SDT,
      nv_USERNAME: employee.nv_USERNAME,
      nv_PASSWORD: employee.nv_PASSWORD,
      nv_DIACHI: employee.nv_DIACHI,
    });
    setShowModal(true);
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
          <Button variant="primary" onClick={() => setShowModal(true)}>
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
          {employees.map((emp, index) => (
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
          ))}
        </tbody>
      </Table>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
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
                    onChange={(e) =>
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
                    onChange={(e) =>
                      setFormData({ ...formData, pb_ID: e.target.value })
                    }
                    isInvalid={!!errors.pb_ID}
                  >
                    <option value="">Chọn phòng ban</option>
                    {departments.map((dep) => (
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
                    onChange={(e) =>
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
                        setFormData({ ...formData, nv_GIOITINH: false W})
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
                    onChange={(e) =>
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
                    onChange={(e) =>
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
                    onChange={(e) =>
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
                      type={showPassword ? 'text' : 'password'} // Ẩn/hiện mật khẩu
                      value={formData.nv_PASSWORD}
                      onChange={(e) =>
                        setFormData({ ...formData, nv_PASSWORD: e.target.value })
                      }
                      isInvalid={!!errors.nv_PASSWORD}
                    />
                    <InputGroup.Text onClick={toggleShowPassword} style={{ cursor: 'pointer' }}>
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
                    onChange={(e) =>
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
    </Container>
  );
};

export default EmployeesPage;
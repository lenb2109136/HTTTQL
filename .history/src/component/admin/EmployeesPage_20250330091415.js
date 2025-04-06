import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Container,
  Row,
  Col,
  Modal,
  Form,
} from 'react-bootstrap';
import { FiPlus } from 'react-icons/fi';
import axios from 'axios';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    nv_HOTEN: '',
    pb_ID: '',
    nv_NGAYSINH: '',
    nv_GIOITINH: false,
    nv_EMAIL: '',
    nv_SDT: '',
    nv_USERNAME: '',
    nv_PASSWORD: '',
    nv_DIACHI: '',
  });
  const [departments, setDepartments] = useState([]);

  const API_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_URL}/nhanvien`);
      console.log('Dữ liệu từ backend:', response.data); // Debug dữ liệu
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

  const handleDelete = async id => {
    try {
      await axios.delete(`${API_URL}/nhanvien/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        pb_ID: { pb_ID: parseInt(formData.pb_ID) },
      };

      if (editingEmployee) {
        await axios.put(
          `${API_URL}/nhanvien/${editingEmployee.nv_ID}`,
          payload
        );
      } else {
        await axios.post(`${API_URL}/nhanvien`, payload);
      }
      setShowModal(false);
      setEditingEmployee(null);
      setFormData({
        nv_HOTEN: '',
        pb_ID: '',
        nv_NGAYSINH: '',
        nv_GIOITINH: false,
        nv_EMAIL: '',
        nv_SDT: '',
        nv_USERNAME: '',
        nv_PASSWORD: '',
        nv_DIACHI: '',
      });
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleEdit = employee => {
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
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingEmployee ? 'Sửa nhân viên' : 'Thêm nhân viên'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Họ tên</Form.Label>
              <Form.Control
                type="text"
                value={formData.nv_HOTEN}
                onChange={e =>
                  setFormData({ ...formData, nv_HOTEN: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phòng ban</Form.Label>
              <Form.Select
                value={formData.pb_ID}
                onChange={e =>
                  setFormData({ ...formData, pb_ID: e.target.value })
                }
                required
              >
                <option value="">Chọn phòng ban</option>
                {departments.map(dep => (
                  <option key={dep.pb_ID} value={dep.pb_ID}>
                    {dep.pb_TEN}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ngày sinh</Form.Label>
              <Form.Control
                type="date"
                value={formData.nv_NGAYSINH}
                onChange={e =>
                  setFormData({ ...formData, nv_NGAYSINH: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Giới tính (Nam)"
                checked={formData.nv_GIOITINH}
                onChange={e =>
                  setFormData({ ...formData, nv_GIOITINH: e.target.checked })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.nv_EMAIL}
                onChange={e =>
                  setFormData({ ...formData, nv_EMAIL: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                value={formData.nv_SDT}
                onChange={e =>
                  setFormData({ ...formData, nv_SDT: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={formData.nv_USERNAME}
                onChange={e =>
                  setFormData({ ...formData, nv_USERNAME: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                value={formData.nv_PASSWORD}
                onChange={e =>
                  setFormData({ ...formData, nv_PASSWORD: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                value={formData.nv_DIACHI}
                onChange={e =>
                  setFormData({ ...formData, nv_DIACHI: e.target.value })
                }
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Lưu
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default EmployeesPage;

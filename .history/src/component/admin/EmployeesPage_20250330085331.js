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
    NV_HOTEN: '',
    PB_ID: '',
    NV_NGAYSINH: '',
    NV_GIOITINH: false,
    NV_EMAIL: '',
    NV_SDT: '',
    NV_USERNAME: '',
    NV_PASSWORD: '',
    NV_DIACHI: '',
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
        PB_ID: { PB_ID: parseInt(formData.PB_ID) },
      };

      if (editingEmployee) {
        await axios.put(
          `${API_URL}/nhanvien/${editingEmployee.NV_ID}`,
          payload
        );
      } else {
        await axios.post(`${API_URL}/nhanvien`, payload);
      }
      setShowModal(false);
      setEditingEmployee(null);
      setFormData({
        NV_HOTEN: '',
        PB_ID: '',
        NV_NGAYSINH: '',
        NV_GIOITINH: false,
        NV_EMAIL: '',
        NV_SDT: '',
        NV_USERNAME: '',
        NV_PASSWORD: '',
        NV_DIACHI: '',
      });
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleEdit = employee => {
    setEditingEmployee(employee);
    setFormData({
      NV_HOTEN: employee.NV_HOTEN,
      PB_ID: employee.PB_ID?.PB_ID || '',
      NV_NGAYSINH: employee.NV_NGAYSINH,
      NV_GIOITINH: employee.NV_GIOITINH,
      NV_EMAIL: employee.NV_EMAIL,
      NV_SDT: employee.NV_SDT,
      NV_USERNAME: employee.NV_USERNAME,
      NV_PASSWORD: employee.NV_PASSWORD,
      NV_DIACHI: employee.NV_DIACHI,
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
            <tr key={emp.NV_ID}>
              <td>{index + 1}</td>
              <td>{emp.NV_HOTEN}</td>
              <td>{emp.PB_ID?.PB_TEN || 'N/A'}</td>
              <td>{emp.NV_SDT}</td>
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
                  onClick={() => handleDelete(emp.NV_ID)}
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
                value={formData.NV_HOTEN}
                onChange={e =>
                  setFormData({ ...formData, NV_HOTEN: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phòng ban</Form.Label>
              <Form.Select
                value={formData.PB_ID}
                onChange={e =>
                  setFormData({ ...formData, PB_ID: e.target.value })
                }
                required
              >
                <option value="">Chọn phòng ban</option>
                {departments.map(dep => (
                  <option key={dep.PB_ID} value={dep.PB_ID}>
                    {dep.PB_TEN}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ngày sinh</Form.Label>
              <Form.Control
                type="date"
                value={formData.NV_NGAYSINH}
                onChange={e =>
                  setFormData({ ...formData, NV_NGAYSINH: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Giới tính (Nam)"
                checked={formData.NV_GIOITINH}
                onChange={e =>
                  setFormData({ ...formData, NV_GIOITINH: e.target.checked })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.NV_EMAIL}
                onChange={e =>
                  setFormData({ ...formData, NV_EMAIL: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                value={formData.NV_SDT}
                onChange={e =>
                  setFormData({ ...formData, NV_SDT: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={formData.NV_USERNAME}
                onChange={e =>
                  setFormData({ ...formData, NV_USERNAME: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                value={formData.NV_PASSWORD}
                onChange={e =>
                  setFormData({ ...formData, NV_PASSWORD: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                value={formData.NV_DIACHI}
                onChange={e =>
                  setFormData({ ...formData, NV_DIACHI: e.target.value })
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

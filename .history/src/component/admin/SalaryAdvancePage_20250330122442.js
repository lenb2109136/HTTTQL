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
} from 'react-bootstrap';
import { FiPlus, FiEdit, FiTrash } from 'react-icons/fi';
import axios from 'axios';

const AdvanceSalaryPage = () => {
  const [advanceRequests, setAdvanceRequests] = useState([]); // Danh sách yêu cầu ứng lương
  const [employees, setEmployees] = useState([]); // Danh sách nhân viên để chọn
  const [showModal, setShowModal] = useState(false); // Modal thêm/sửa ứng lương
  const [isEditMode, setIsEditMode] = useState(false); // Chế độ sửa
  const [formData, setFormData] = useState({
    UL_ID: null, // ID ứng lương (dùng khi sửa)
    NV_ID: '', // ID nhân viên
    UL_TIEN: '', // Số tiền ứng lương
    UL_NGAYUL: '', // Ngày ứng lương
    UL_TRANGTHAI: 'Chờ duyệt', // Trạng thái: "Chờ duyệt", "Đã duyệt", "Từ chối"
  });
  const [errors, setErrors] = useState({}); // Lỗi validation

  const API_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchAdvanceRequests();
    fetchEmployees();
  }, []);

  // Lấy danh sách yêu cầu ứng lương
  const fetchAdvanceRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/ung-luong`);
      console.log('Dữ liệu ứng lương từ backend:', response.data);
      setAdvanceRequests(response.data);
    } catch (error) {
      console.error('Error fetching advance requests:', error);
    }
  };

  // Lấy danh sách nhân viên để chọn trong modal
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_URL}/nhanvien`);
      console.log('Dữ liệu nhân viên từ backend:', response.data);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Validation form thêm/sửa ứng lương
  const validateForm = () => {
    const newErrors = {};
    if (!formData.NV_ID) newErrors.NV_ID = 'Vui lòng chọn nhân viên';
    if (!formData.UL_TIEN || formData.UL_TIEN <= 0)
      newErrors.UL_TIEN = 'Số tiền ứng lương phải lớn hơn 0';
    if (!formData.UL_NGAYUL)
      newErrors.UL_NGAYUL = 'Vui lòng chọn ngày ứng lương';
    return newErrors;
  };

  // Xử lý thêm/sửa ứng lương
  const handleSubmit = async e => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const payload = {
        ...formData,
        UL_NGAYUL: new Date(formData.UL_NGAYUL).toISOString(),
      };

      if (isEditMode) {
        // Sửa ứng lương
        await axios.put(`${API_URL}/ung-luong/${formData.UL_ID}`, payload);
      } else {
        // Thêm ứng lương
        payload.UL_TRANGTHAI = 'Chờ duyệt'; // Mặc định khi thêm mới
        await axios.post(`${API_URL}/ung-luong`, payload);
      }

      setShowModal(false);
      resetForm();
      fetchAdvanceRequests();
    } catch (error) {
      console.error('Error submitting advance request:', error);
    }
  };

  // Xử lý duyệt yêu cầu ứng lương
  const handleApprove = async id => {
    try {
      await axios.put(`${API_URL}/ung-luong/${id}`, {
        UL_TRANGTHAI: 'Đã duyệt',
      });
      fetchAdvanceRequests();
    } catch (error) {
      console.error('Error approving advance request:', error);
    }
  };

  // Xử lý từ chối yêu cầu ứng lương
  const handleReject = async id => {
    try {
      await axios.put(`${API_URL}/ung-luong/${id}`, {
        UL_TRANGTHAI: 'Từ chối',
      });
      fetchAdvanceRequests();
    } catch (error) {
      console.error('Error rejecting advance request:', error);
    }
  };

  // Xử lý xóa ứng lương
  const handleDelete = async id => {
    if (window.confirm('Bạn có chắc chắn muốn xóa yêu cầu ứng lương này?')) {
      try {
        await axios.delete(`${API_URL}/ung-luong/${id}`);
        fetchAdvanceRequests();
      } catch (error) {
        console.error('Error deleting advance request:', error);
      }
    }
  };

  // Xử lý mở modal để sửa ứng lương
  const handleEdit = request => {
    setFormData({
      UL_ID: request.UL_ID,
      NV_ID: request.NV_ID?.NV_ID || '',
      UL_TIEN: request.UL_TIEN,
      UL_NGAYUL: request.UL_NGAYUL
        ? new Date(request.UL_NGAYUL).toISOString().split('T')[0]
        : '',
      UL_TRANGTHAI: request.UL_TRANGTHAI,
    });
    setIsEditMode(true);
    setShowModal(true);
  };

  // Reset form khi đóng modal
  const resetForm = () => {
    setFormData({
      UL_ID: null,
      NV_ID: '',
      UL_TIEN: '',
      UL_NGAYUL: '',
      UL_TRANGTHAI: 'Chờ duyệt',
    });
    setErrors({});
    setIsEditMode(false);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <Container>
      <h1 className="text-center my-4">Quản lý ứng lương</h1>
      <Row className="mb-3 d-flex justify-content-between align-items-center">
        <Col>
          <h2>Danh sách ứng lương</h2>
        </Col>
        <Col className="text-end">
          <Button
            variant="primary"
            onClick={() => {
              setShowModal(true);
              resetForm();
            }}
          >
            <FiPlus /> Thêm yêu cầu ứng lương
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên</th>
            <th>Bộ phận</th>
            <th>Ngày ứng lương</th>
            <th>Ứng lương bao nhiêu</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {advanceRequests.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                Không có yêu cầu ứng lương nào.
              </td>
            </tr>
          ) : (
            advanceRequests.map((request, index) => (
              <tr key={request.UL_ID}>
                <td>{index + 1}</td>
                <td>{request.NV_ID?.NV_HOTEN || 'N/A'}</td>
                <td>{request.NV_ID?.PB_ID?.PB_TEN || 'N/A'}</td>
                <td>
                  {request.UL_NGAYUL
                    ? new Date(request.UL_NGAYUL).toLocaleDateString()
                    : 'N/A'}
                </td>
                <td>
                  {request.UL_TIEN
                    ? `${request.UL_TIEN.toLocaleString()} VNĐ`
                    : 'N/A'}
                </td>
                <td>{request.UL_TRANGTHAI}</td>
                <td>
                  {request.UL_TRANGTHAI === 'Chờ duyệt' && (
                    <>
                      <Button
                        variant="success"
                        className="me-2"
                        onClick={() => handleApprove(request.UL_ID)}
                      >
                        Duyệt
                      </Button>
                      <Button
                        variant="danger"
                        className="me-2"
                        onClick={() => handleReject(request.UL_ID)}
                      >
                        Từ chối
                      </Button>
                    </>
                  )}
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => handleEdit(request)}
                  >
                    <FiEdit /> Sửa
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(request.UL_ID)}
                  >
                    <FiTrash /> Xóa
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Modal thêm/sửa ứng lương */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton className="d-flex justify-content-center">
          <Modal.Title className="w-100 text-center">
            {isEditMode ? 'Sửa yêu cầu ứng lương' : 'Thêm yêu cầu ứng lương'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nhân viên</Form.Label>
                  <Form.Select
                    value={formData.NV_ID}
                    onChange={e =>
                      setFormData({ ...formData, NV_ID: e.target.value })
                    }
                    isInvalid={!!errors.NV_ID}
                  >
                    <option value="">Chọn nhân viên</option>
                    {employees.map(emp => (
                      <option key={emp.NV_ID} value={emp.NV_ID}>
                        {emp.NV_HOTEN}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.NV_ID}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Số tiền ứng lương (VNĐ)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.UL_TIEN}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        UL_TIEN: parseFloat(e.target.value),
                      })
                    }
                    isInvalid={!!errors.UL_TIEN}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.UL_TIEN}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày ứng lương</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.UL_NGAYUL}
                    onChange={e =>
                      setFormData({ ...formData, UL_NGAYUL: e.target.value })
                    }
                    isInvalid={!!errors.UL_NGAYUL}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.UL_NGAYUL}
                  </Form.Control.Feedback>
                </Form.Group>

                {isEditMode && (
                  <Form.Group className="mb-3">
                    <Form.Label>Trạng thái</Form.Label>
                    <Form.Select
                      value={formData.UL_TRANGTHAI}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          UL_TRANGTHAI: e.target.value,
                        })
                      }
                    >
                      <option value="Chờ duyệt">Chờ duyệt</option>
                      <option value="Đã duyệt">Đã duyệt</option>
                      <option value="Từ chối">Từ chối</option>
                    </Form.Select>
                  </Form.Group>
                )}
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

export default AdvanceSalaryPage;

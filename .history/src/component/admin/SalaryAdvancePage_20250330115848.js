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
import { FiPlus } from 'react-icons/fi';
import axios from 'axios';

const AdvanceSalaryPage = () => {
  const [advanceRequests, setAdvanceRequests] = useState([]); // Danh sách yêu cầu ứng lương
  const [employees, setEmployees] = useState([]); // Danh sách nhân viên để chọn
  const [showModal, setShowModal] = useState(false); // Modal thêm yêu cầu ứng lương
  const [formData, setFormData] = useState({
    nv_ID: '', // ID nhân viên
    advanceAmount: '', // Số tiền ứng lương
    advanceDate: '', // Ngày ứng lương
    reason: '', // Lý do ứng lương
    status: null, // Trạng thái: true (Duyệt), false (Không duyệt), null (Chưa duyệt)
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
      const response = await axios.get(`${API_URL}/advance-requests`);
      setAdvanceRequests(response.data);
    } catch (error) {
      console.error('Error fetching advance requests:', error);
    }
  };

  // Lấy danh sách nhân viên để chọn trong modal
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_URL}/nhanvien`);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Validation form thêm yêu cầu ứng lương
  const validateForm = () => {
    const newErrors = {};
    if (!formData.nv_ID) newErrors.nv_ID = 'Vui lòng chọn nhân viên';
    if (!formData.advanceAmount || formData.advanceAmount <= 0)
      newErrors.advanceAmount = 'Số tiền ứng lương phải lớn hơn 0';
    if (!formData.advanceDate)
      newErrors.advanceDate = 'Vui lòng chọn ngày ứng lương';
    if (!formData.reason) newErrors.reason = 'Vui lòng nhập lý do ứng lương';
    return newErrors;
  };

  // Xử lý thêm yêu cầu ứng lương
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
        status: null, // Mặc định là chưa duyệt
      };
      await axios.post(`${API_URL}/advance-requests`, payload);
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
      await axios.put(`${API_URL}/advance-requests/${id}`, { status: true });
      fetchAdvanceRequests();
    } catch (error) {
      console.error('Error approving advance request:', error);
    }
  };

  // Xử lý từ chối yêu cầu ứng lương
  const handleReject = async id => {
    try {
      await axios.put(`${API_URL}/advance-requests/${id}`, { status: false });
      fetchAdvanceRequests();
    } catch (error) {
      console.error('Error rejecting advance request:', error);
    }
  };

  // Reset form khi đóng modal
  const resetForm = () => {
    setFormData({
      nv_ID: '',
      advanceAmount: '',
      advanceDate: '',
      reason: '',
      status: null,
    });
    setErrors({});
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
          {advanceRequests.map((request, index) => (
            <tr key={request.id}>
              <td>{index + 1}</td>
              <td>{request.employee?.nv_HOTEN || 'N/A'}</td>
              <td>{request.employee?.pb_ID?.pb_TEN || 'N/A'}</td>
              <td>{request.advanceDate || 'N/A'}</td>
              <td>
                {request.advanceAmount
                  ? `${request.advanceAmount.toLocaleString()} VNĐ`
                  : 'N/A'}
              </td>
              <td>
                {request.status === null
                  ? 'Chưa duyệt'
                  : request.status
                  ? 'Đã duyệt'
                  : 'Từ chối'}
              </td>
              <td>
                {request.status === null && (
                  <>
                    <Button
                      variant="success"
                      className="me-2"
                      onClick={() => handleApprove(request.id)}
                    >
                      Duyệt
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleReject(request.id)}
                    >
                      Từ chối
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal thêm yêu cầu ứng lương */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton className="d-flex justify-content-center">
          <Modal.Title className="w-100 text-center">
            Thêm yêu cầu ứng lương
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nhân viên</Form.Label>
                  <Form.Select
                    value={formData.nv_ID}
                    onChange={e =>
                      setFormData({ ...formData, nv_ID: e.target.value })
                    }
                    isInvalid={!!errors.nv_ID}
                  >
                    <option value="">Chọn nhân viên</option>
                    {employees.map(emp => (
                      <option key={emp.nv_ID} value={emp.nv_ID}>
                        {emp.nv_HOTEN}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.nv_ID}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Số tiền ứng lương (VNĐ)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.advanceAmount}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        advanceAmount: e.target.value,
                      })
                    }
                    isInvalid={!!errors.advanceAmount}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.advanceAmount}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày ứng lương</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.advanceDate}
                    onChange={e =>
                      setFormData({ ...formData, advanceDate: e.target.value })
                    }
                    isInvalid={!!errors.advanceDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.advanceDate}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Lý do ứng lương</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.reason}
                    onChange={e =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    isInvalid={!!errors.reason}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.reason}
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

export default AdvanceSalaryPage;

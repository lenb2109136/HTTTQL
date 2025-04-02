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
import { FiPlus, FiEdit, FiTrash } from 'react-icons/fi';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdvanceSalaryPage = () => {
  const [advanceRequests, setAdvanceRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    ul_ID: null,
    nv_ID: '',
    ul_TIEN: '',
    ul_NGAYUL: '',
    ul_TRANGTHAI: 'Chờ duyệt',
  });
  const [errors, setErrors] = useState({});

  const API_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchAdvanceRequests();
    fetchEmployees();
  }, []);

  const fetchAdvanceRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/ung-luong`);
      console.log('Dữ liệu ứng lương từ backend:', response.data);
      setAdvanceRequests(response.data);
    } catch (error) {
      console.error('Error fetching advance requests:', error);
      toast.error('Không thể tải danh sách ứng lương: ' + error.message);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_URL}/nhanvien`);
      console.log('Dữ liệu nhân viên từ backend:', response.data);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Không thể tải danh sách nhân viên: ' + error.message);
    }
  };

  const getEmployeeName = nvId => {
    const employee = employees.find(emp => emp.NV_ID === nvId); // Sửa từ nv_ID thành NV_ID
    return employee ? employee.NV_HOTEN : 'N/A'; // Sửa từ nv_HOTEN thành NV_HOTEN
  };

  const getDepartmentName = nvId => {
    const employee = employees.find(emp => emp.NV_ID === nvId); // Sửa từ nv_ID thành NV_ID
    return employee && employee.PB_ID ? employee.PB_ID.PB_TEN : 'N/A';
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nv_ID) {
      newErrors.nv_ID = 'Vui lòng chọn nhân viên';
    }
    if (!formData.ul_TIEN) {
      newErrors.ul_TIEN = 'Vui lòng nhập số tiền ứng lương';
    } else if (isNaN(formData.ul_TIEN) || parseFloat(formData.ul_TIEN) <= 0) {
      newErrors.ul_TIEN = 'Số tiền ứng lương phải là số hợp lệ và lớn hơn 0';
    }
    if (!formData.ul_NGAYUL) {
      newErrors.ul_NGAYUL = 'Vui lòng chọn ngày ứng lương';
    } else if (!isEditMode) {
      const selectedDate = new Date(formData.ul_NGAYUL);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.ul_NGAYUL = 'Ngày ứng lương không được là ngày trong quá khứ';
      }
    }
    return newErrors;
  };

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
        nv_ID: parseInt(formData.nv_ID),
        ul_TIEN: parseFloat(formData.ul_TIEN),
        ul_NGAYUL: new Date(formData.ul_NGAYUL).toISOString(),
      };

      let response;
      if (isEditMode) {
        response = await axios.put(
          `${API_URL}/ung-luong/${formData.ul_ID}`,
          payload
        );
        console.log('Cập nhật ứng lương:', response.data);
        toast.success('Đã sửa yêu cầu ứng lương thành công!');
      } else {
        payload.ul_TRANGTHAI = 'Chờ duyệt';
        response = await axios.post(`${API_URL}/ung-luong`, payload);
        console.log('Thêm ứng lương:', response.data);
        toast.success('Đã tạo yêu cầu ứng lương thành công!');
      }

      setShowModal(false);
      resetForm();
      fetchAdvanceRequests();
    } catch (error) {
      console.error('Error submitting advance request:', error);
      toast.error(
        'Lỗi khi lưu yêu cầu: ' + (error.response?.data || error.message)
      );
    }
  };

  const handleApprove = async id => {
    try {
      const response = await axios.put(`${API_URL}/ung-luong/${id}`, {
        ul_TRANGTHAI: 'Đã duyệt',
      });
      console.log('Duyệt ứng lương:', response.data);
      toast.success('Đã duyệt yêu cầu ứng lương thành công!');
      fetchAdvanceRequests();
    } catch (error) {
      console.error('Error approving advance request:', error);
      toast.error('Lỗi khi duyệt: ' + (error.response?.data || error.message));
    }
  };

  const handleReject = async id => {
    try {
      const response = await axios.put(`${API_URL}/ung-luong/${id}`, {
        ul_TRANGTHAI: 'Từ chối',
      });
      console.log('Từ chối ứng lương:', response.data);
      toast.success('Đã từ chối yêu cầu ứng lương thành công!');
      fetchAdvanceRequests();
    } catch (error) {
      console.error('Error rejecting advance request:', error);
      toast.error(
        'Lỗi khi từ chối: ' + (error.response?.data || error.message)
      );
    }
  };

  const handleDelete = id => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/ung-luong/${deleteId}`);
      console.log('Đã xóa ứng lương ID:', deleteId);
      toast.success('Đã xóa yêu cầu ứng lương thành công!');
      fetchAdvanceRequests();
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting advance request:', error);
      toast.error('Lỗi khi xóa: ' + (error.response?.data || error.message));
      setShowDeleteModal(false);
    }
  };

  const handleEdit = request => {
    setFormData({
      ul_ID: request.ul_ID,
      nv_ID: request.nv_ID || '',
      ul_TIEN: request.ul_TIEN || '',
      ul_NGAYUL: request.ul_NGAYUL
        ? new Date(request.ul_NGAYUL).toISOString().split('T')[0]
        : '',
      ul_TRANGTHAI: request.ul_TRANGTHAI || '',
    });
    setIsEditMode(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      ul_ID: null,
      nv_ID: '',
      ul_TIEN: '',
      ul_NGAYUL: '',
      ul_TRANGTHAI: 'Chờ duyệt',
    });
    setErrors({});
    setIsEditMode(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
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
              <tr key={request.ul_ID}>
                <td>{index + 1}</td>
                <td>{getEmployeeName(request.nv_ID)}</td>
                <td>{getDepartmentName(request.nv_ID)}</td>
                <td>
                  {request.ul_NGAYUL
                    ? new Date(request.ul_NGAYUL).toLocaleDateString()
                    : 'N/A'}
                </td>
                <td>
                  {request.ul_TIEN && request.ul_TIEN > 0
                    ? `${request.ul_TIEN.toLocaleString()} VNĐ`
                    : 'N/A'}
                </td>
                <td>{request.ul_TRANGTHAI}</td>
                <td>
                  {request.ul_TRANGTHAI === 'Chờ duyệt' && (
                    <>
                      <Button
                        variant="success"
                        className="me-2"
                        onClick={() => handleApprove(request.ul_ID)}
                      >
                        Duyệt
                      </Button>
                      <Button
                        variant="danger"
                        className="me-2"
                        onClick={() => handleReject(request.ul_ID)}
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
                    onClick={() => handleDelete(request.ul_ID)}
                  >
                    <FiTrash /> Xóa
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Modal thêm/sửa yêu cầu */}
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
                    value={formData.nv_ID}
                    onChange={e =>
                      setFormData({ ...formData, nv_ID: e.target.value })
                    }
                    isInvalid={!!errors.nv_ID}
                  >
                    <option value="">Chọn nhân viên</option>
                    {employees.map(emp => (
                      <option key={emp.NV_ID} value={emp.NV_ID}>
                        {emp.NV_HOTEN}
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
                    value={formData.ul_TIEN}
                    onChange={e => {
                      const value = e.target.value;
                      setFormData({
                        ...formData,
                        ul_TIEN: value && parseFloat(value) > 0 ? value : '',
                      });
                    }}
                    isInvalid={!!errors.ul_TIEN}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.ul_TIEN}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày ứng lương</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.ul_NGAYUL}
                    min={
                      !isEditMode
                        ? new Date().toISOString().split('T')[0]
                        : undefined
                    }
                    onChange={e =>
                      setFormData({ ...formData, ul_NGAYUL: e.target.value })
                    }
                    isInvalid={!!errors.ul_NGAYUL}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.ul_NGAYUL}
                  </Form.Control.Feedback>
                </Form.Group>

                {isEditMode && (
                  <Form.Group className="mb-3">
                    <Form.Label>Trạng thái</Form.Label>
                    <Form.Select
                      value={formData.ul_TRANGTHAI}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          ul_TRANGTHAI: e.target.value,
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

      {/* Modal xác nhận xóa */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn xóa yêu cầu ứng lương này không?</p>
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

      <ToastContainer />
    </Container>
  );
};

export default AdvanceSalaryPage;

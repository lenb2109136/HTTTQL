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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    pb_TEN: '',
  });
  const [errors, setErrors] = useState({});

  const API_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${API_URL}/phongban`);
      console.log('Dữ liệu phòng ban từ backend:', response.data);
      setDepartments(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách phòng ban:', error);
      toast.error(
        'Không thể tải danh sách phòng ban: ' +
          (error.response?.data || error.message)
      );
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.pb_TEN) newErrors.pb_TEN = 'Tên phòng ban là bắt buộc';
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
        pb_TEN: formData.pb_TEN,
      };
      console.log('Gửi dữ liệu:', payload);

      if (editingDepartment) {
        const response = await axios.put(
          `${API_URL}/phongban/${editingDepartment.pb_ID}`,
          payload
        );
        console.log('Kết quả sửa:', response.data);
        toast.success('Đã sửa thông tin phòng ban thành công!');
      } else {
        const response = await axios.post(`${API_URL}/phongban`, payload);
        console.log('Kết quả thêm:', response.data);
        toast.success('Đã thêm phòng ban thành công!');
      }
      setShowModal(false);
      setEditingDepartment(null);
      resetForm();
      fetchDepartments();
    } catch (error) {
      console.error('Lỗi khi lưu phòng ban:', error);
      toast.error(
        'Không thể lưu phòng ban: ' + (error.response?.data || error.message)
      );
    }
  };

  const handleEdit = department => {
    console.log('Chỉnh sửa phòng ban:', department);
    setEditingDepartment(department);
    setFormData({
      pb_TEN: department.pb_TEN || '',
    });
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = id => {
    console.log('Chuẩn bị xóa phòng ban ID:', id);
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      console.log('Xác nhận xóa phòng ban ID:', deleteId);
      await axios.delete(`${API_URL}/phongban/${deleteId}`);
      toast.success('Đã xóa phòng ban thành công!');
      fetchDepartments();
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Lỗi khi xóa phòng ban:', error);
      const errorMessage = error.response?.data || error.message;
      if (errorMessage.includes('foreign key constraint fails')) {
        toast.error(
          'Không thể xóa phòng ban vì phòng ban này đang được tham chiếu bởi nhân viên hoặc dữ liệu khác.'
        );
      } else {
        toast.error('Không thể xóa phòng ban: ' + errorMessage);
      }
      setShowDeleteModal(false);
    }
  };

  const resetForm = () => {
    setFormData({
      pb_TEN: '',
    });
    setErrors({});
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDepartment(null);
    resetForm();
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  return (
    <Container>
      <h1 className="text-center my-4">Quản lý phòng ban</h1>
      <Row className="mb-3 d-flex justify-content-between align-items-center">
        <Col>
          <h2>Danh sách phòng ban</h2>
        </Col>
        <Col className="text-end">
          <Button
            variant="primary"
            onClick={() => {
              setShowModal(true);
              resetForm();
            }}
          >
            <FiPlus /> Thêm phòng ban
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên phòng ban</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {departments.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">
                Không có phòng ban nào.
              </td>
            </tr>
          ) : (
            departments.map((dep, index) => (
              <tr key={dep.pb_ID}>
                <td>{index + 1}</td>
                <td>{dep.pb_TEN || 'N/A'}</td>
                <td>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => handleEdit(dep)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(dep.pb_ID)}
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
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="d-flex justify-content-center">
          <Modal.Title className="w-100 text-center">
            {editingDepartment ? 'Sửa phòng ban' : 'Thêm phòng ban'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tên phòng ban</Form.Label>
              <Form.Control
                type="text"
                value={formData.pb_TEN}
                onChange={e =>
                  setFormData({ ...formData, pb_TEN: e.target.value })
                }
                isInvalid={!!errors.pb_TEN}
              />
              <Form.Control.Feedback type="invalid">
                {errors.pb_TEN}
              </Form.Control.Feedback>
            </Form.Group>
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
          <p>Bạn có chắc chắn muốn xóa phòng ban này không?</p>
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

export default DepartmentsPage;

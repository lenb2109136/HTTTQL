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
import { FiPlus, FiEdit, FiTrash2, FiMessageSquare } from 'react-icons/fi';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [formData, setFormData] = useState({
    kn_NOIDUNG: '',
    kn_NGAYKN: '',
    nv_ID: '',
  });
  const [responseData, setResponseData] = useState({
    responseContent: '',
  });

  const API_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(`${API_URL}/khieu-nai`);
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Không thể tải danh sách khiếu nại.');
    }
  };

  const handleDelete = async id => {
    if (window.confirm('Bạn có chắc muốn xóa khiếu nại này?')) {
      try {
        await axios.delete(`${API_URL}/khieu-nai/${id}`);
        toast.success('Xóa khiếu nại thành công!');
        setComplaints(complaints.filter(complaint => complaint.kn_ID !== id));
      } catch (error) {
        console.error('Error deleting complaint:', error);
        toast.error('Không thể xóa khiếu nại.');
      }
    }
  };

  const handleEdit = complaint => {
    setSelectedComplaint(complaint);
    setFormData({
      kn_NOIDUNG: complaint.kn_NOIDUNG,
      kn_NGAYKN: new Date(complaint.kn_NGAYKN).toISOString().slice(0, 16),
      nv_ID: complaint.nv_ID.nv_ID, // Lấy nv_ID từ đối tượng NhanVien
    });
    setShowModal(true);
  };

  const handleResponse = complaint => {
    setSelectedComplaint(complaint);
    setResponseData({ responseContent: '' });
    setShowResponseModal(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const requestData = {
        kn_NOIDUNG: formData.kn_NOIDUNG,
        kn_NGAYKN: new Date(formData.kn_NGAYKN).toISOString(),
        nv_ID: { nv_ID: parseInt(formData.nv_ID) }, // Gửi đúng định dạng cho backend
      };
      if (selectedComplaint) {
        await axios.put(
          `${API_URL}/khieu-nai/${selectedComplaint.kn_ID}`,
          requestData
        );
        toast.success('Cập nhật khiếu nại thành công!');
      } else {
        await axios.post(`${API_URL}/khieu-nai`, requestData);
        toast.success('Thêm khiếu nại thành công!');
      }
      setShowModal(false);
      fetchComplaints();
    } catch (error) {
      console.error('Error saving complaint:', error);
      toast.error('Lỗi khi lưu khiếu nại.');
    }
  };

  const handleResponseSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_URL}/khieu-nai/${selectedComplaint.kn_ID}/respond`,
        {
          responseContent: responseData.responseContent,
          kn_TRANGTHAI: 'Đã xử lý', // Cập nhật trạng thái khiếu nại
        }
      );
      toast.success('Phản hồi đã được gửi qua email!');
      setShowResponseModal(false);
      fetchComplaints(); // Làm mới danh sách khiếu nại
    } catch (error) {
      console.error('Error sending response:', error);
      toast.error('Lỗi khi gửi phản hồi.');
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedComplaint(null);
    setFormData({
      kn_NOIDUNG: '',
      kn_NGAYKN: '',
      nv_ID: '',
    });
  };

  const handleResponseClose = () => {
    setShowResponseModal(false);
    setSelectedComplaint(null);
    setResponseData({ responseContent: '' });
  };

  return (
    <Container>
      <h1 className="text-center my-4">Quản lý Khiếu Nại</h1>
      <Row className="mb-3 d-flex justify-content-between align-items-center">
        <Col>
          <h2>Danh sách khiếu nại</h2>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <FiPlus /> Thêm khiếu nại
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên Nhân Viên</th>
            <th>Nội Dung</th>
            <th>Ngày Khiếu Nại</th>
            <th>Trạng Thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint, index) => (
            <tr key={complaint.kn_ID}>
              <td>{index + 1}</td>
              <td>{complaint.nv_ID?.nv_HOTEN || 'N/A'}</td>
              <td>{complaint.kn_NOIDUNG}</td>
              <td>{new Date(complaint.kn_NGAYKN).toLocaleDateString()}</td>
              <td>{complaint.kn_TRANGTHAI}</td>
              <td>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => handleEdit(complaint)}
                >
                  <FiEdit /> Sửa
                </Button>
                <Button
                  variant="danger"
                  className="me-2"
                  onClick={() => handleDelete(complaint.kn_ID)}
                >
                  <FiTrash2 /> Xóa
                </Button>
                {complaint.kn_TRANGTHAI !== 'Đã xử lý' && (
                  <Button
                    variant="success"
                    onClick={() => handleResponse(complaint)}
                  >
                    <FiMessageSquare /> Phản hồi
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Thêm/Sửa Khiếu Nại */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedComplaint ? 'Sửa Khiếu Nại' : 'Thêm Khiếu Nại'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {!selectedComplaint && (
              <Form.Group controlId="formNV_ID" className="mb-3">
                <Form.Label>Mã Nhân Viên</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.nv_ID}
                  onChange={e =>
                    setFormData({ ...formData, nv_ID: e.target.value })
                  }
                  required
                />
              </Form.Group>
            )}
            <Form.Group controlId="formKN_NOIDUNG" className="mb-3">
              <Form.Label>Nội Dung</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.kn_NOIDUNG}
                onChange={e =>
                  setFormData({ ...formData, kn_NOIDUNG: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="formKN_NGAYKN" className="mb-3">
              <Form.Label>Ngày Khiếu Nại</Form.Label>
              <Form.Control
                type="datetime-local"
                value={formData.kn_NGAYKN}
                onChange={e =>
                  setFormData({ ...formData, kn_NGAYKN: e.target.value })
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

      {/* Modal Phản Hồi */}
      <Modal show={showResponseModal} onHide={handleResponseClose}>
        <Modal.Header closeButton>
          <Modal.Title>Phản Hồi Khiếu Nại</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleResponseSubmit}>
            <Form.Group controlId="formResponseContent" className="mb-3">
              <Form.Label>Nội Dung Phản Hồi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={responseData.responseContent}
                onChange={e =>
                  setResponseData({
                    ...responseData,
                    responseContent: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Gửi
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer />
    </Container>
  );
};

export default ComplaintsPage;

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
      if (response.status === 200) {
        setComplaints(response.data);
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error(
        'Error fetching complaints:',
        error.response || error.message
      );
      toast.error(
        error.response?.data?.message || 'Không thể tải danh sách khiếu nại.'
      );
    }
  };

  const handleDelete = async id => {
    if (window.confirm('Bạn có chắc muốn xóa khiếu nại này?')) {
      try {
        const response = await axios.delete(`${API_URL}/khieu-nai/${id}`);
        if (response.status === 200 || response.status === 204) {
          toast.success('Xóa khiếu nại thành công!');
          setComplaints(complaints.filter(complaint => complaint.kn_ID !== id));
        } else {
          throw new Error(`Unexpected status code: ${response.status}`);
        }
      } catch (error) {
        console.error(
          'Error deleting complaint:',
          error.response || error.message
        );
        toast.error(
          error.response?.data?.message || 'Không thể xóa khiếu nại.'
        );
      }
    }
  };

  const handleEdit = complaint => {
    setSelectedComplaint(complaint);
    setFormData({
      kn_NOIDUNG: complaint.kn_NOIDUNG || '',
      kn_NGAYKN: complaint.kn_NGAYKN
        ? new Date(complaint.kn_NGAYKN).toISOString().slice(0, 16)
        : '',
      nv_ID: complaint.nv_ID?.nv_ID || '',
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
        nv_ID: { nv_ID: parseInt(formData.nv_ID) },
      };

      let response;
      if (selectedComplaint) {
        response = await axios.put(
          `${API_URL}/khieu-nai/${selectedComplaint.kn_ID}`,
          requestData
        );
        if (response.status === 200) {
          toast.success('Cập nhật khiếu nại thành công!');
        }
      } else {
        response = await axios.post(`${API_URL}/khieu-nai`, requestData);
        if (response.status === 201) {
          toast.success('Thêm khiếu nại thành công!');
        }
      }
      setShowModal(false);
      fetchComplaints();
    } catch (error) {
      console.error('Error saving complaint:', error.response || error.message);
      toast.error(error.response?.data?.message || 'Lỗi khi lưu khiếu nại.');
    }
  };

  const handleResponseSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/khieu-nai/${selectedComplaint.kn_ID}/respond`,
        {
          responseContent: responseData.responseContent,
          kn_TRANGTHAI: 'Đã xử lý',
        }
      );
      if (response.status === 200) {
        toast.success('Phản hồi đã được gửi qua email!');
        setShowResponseModal(false);
        fetchComplaints();
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error('Error sending response:', error.response || error.message);
      toast.error(error.response?.data?.message || 'Lỗi khi gửi phản hồi.');
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
          {complaints.length > 0 ? (
            complaints.map((complaint, index) => (
              <tr key={complaint.kn_ID}>
                <td>{index + 1}</td>
                <td>{complaint.nv_ID?.NV_HOTEN || 'N/A'}</td>
                <td>{complaint.kn_NOIDUNG || 'Không có nội dung'}</td>
                <td>
                  {complaint.kn_NGAYKN
                    ? new Date(complaint.kn_NGAYKN).toLocaleDateString()
                    : 'N/A'}
                </td>
                <td>{complaint.kn_TRANGTHAI || 'Chưa xử lý'}</td>
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
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                Không có khiếu nại nào.
              </td>
            </tr>
          )}
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

export default ComplaintsPage;

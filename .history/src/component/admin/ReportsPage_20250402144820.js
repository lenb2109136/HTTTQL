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
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [formData, setFormData] = useState({
    KN_ID: '',
    NV_ID: '',
    KN_NOIDUNG: '',
    KN_NGAYKN: '',
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/khieu-nai');
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const handleDelete = async id => {
    if (window.confirm('Bạn có chắc muốn xóa khiếu nại này?')) {
      try {
        await axios.delete(`http://localhost:8080/api/khieu-nai/${id}`);
        setComplaints(complaints.filter(complaint => complaint.KN_ID !== id));
      } catch (error) {
        console.error('Error deleting complaint:', error);
      }
    }
  };

  const handleEdit = complaint => {
    setSelectedComplaint(complaint);
    setFormData({
      KN_ID: complaint.KN_ID,
      NV_ID: complaint.NV_ID.KN_ID, // Điều chỉnh nếu cần
      KN_NOIDUNG: complaint.KN_NOIDUNG,
      KN_NGAYKN: complaint.KN_NGAYKN,
    });
    setShowModal(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (selectedComplaint) {
        await axios.put(
          `http://localhost:8080/api/khieu-nai/${selectedComplaint.KN_ID}`,
          formData
        );
      } else {
        await axios.post('http://localhost:8080/api/khieu-nai', formData);
      }
      setShowModal(false);
      fetchComplaints();
    } catch (error) {
      console.error('Error saving complaint:', error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedComplaint(null);
    setFormData({
      KN_ID: '',
      NV_ID: '',
      KN_NOIDUNG: '',
      KN_NGAYKN: '',
    });
  };

  return (
    <Container>
      <h1 className="text-center my-4">Quản lý Khiếu Nại</h1>
      <Row className="mb-3 d-flex justify-content-between align-items-center">
        <Col>
          <h2>Danh sách khiếu nại</h2>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <FiPlus /> Thêm khiếu nại
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã Khiếu Nại</th>
            <th>Tên Nhân Viên</th>
            <th>Nội Dung</th>
            <th>Ngày Khiếu Nại</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint, index) => (
            <tr key={complaint.KN_ID}>
              <td>{index + 1}</td>
              <td>{complaint.KN_ID}</td>
              <td>{complaint.NV_ID ? complaint.NV_ID.getNV_HOTEN() : 'N/A'}</td>
              <td>{complaint.KN_NOIDUNG}</td>
              <td>{new Date(complaint.KN_NGAYKN).toLocaleDateString()}</td>
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
                  onClick={() => handleDelete(complaint.KN_ID)}
                >
                  <FiTrash2 /> Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedComplaint ? 'Sửa Khiếu Nại' : 'Thêm Khiếu Nại'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNV_ID">
              <Form.Label>Mã Nhân Viên</Form.Label>
              <Form.Control
                type="number"
                value={formData.NV_ID}
                onChange={e =>
                  setFormData({ ...formData, NV_ID: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="formKN_NOIDUNG">
              <Form.Label>Nội Dung</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.KN_NOIDUNG}
                onChange={e =>
                  setFormData({ ...formData, KN_NOIDUNG: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="formKN_NGAYKN">
              <Form.Label>Ngày Khiếu Nại</Form.Label>
              <Form.Control
                type="datetime-local"
                value={formData.KN_NGAYKN}
                onChange={e =>
                  setFormData({ ...formData, KN_NGAYKN: e.target.value })
                }
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Lưu
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ComplaintsPage;

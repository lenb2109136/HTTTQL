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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS của toast

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [formData, setFormData] = useState({
    kn_NOIDUNG: '',
    kn_NGAYKN: '',
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/khieu-nai');
      console.log('Dữ liệu từ API:', response.data);
      setComplaints(response.data);
    } catch (error) {
      console.error(
        'Error fetching complaints:',
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleDelete = async id => {
    if (window.confirm('Bạn có chắc muốn xóa khiếu nại này?')) {
      try {
        const response = await axios.delete(
          `http://localhost:8080/api/khieu-nai/${id}`
        );
        console.log('Xóa thành công:', response.data);
        setComplaints(complaints.filter(complaint => complaint.kn_ID !== id));
      } catch (error) {
        console.error(
          'Error deleting complaint:',
          error.response ? error.response.data : error.message
        );
      }
    }
  };

  const handleEdit = complaint => {
    console.log('Chỉnh sửa khiếu nại:', complaint);
    setSelectedComplaint(complaint);
    setFormData({
      kn_NOIDUNG: complaint.kn_NOIDUNG,
      kn_NGAYKN: new Date(complaint.kn_NGAYKN).toISOString().slice(0, 16),
    });
    setShowModal(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const requestData = {
        kn_NOIDUNG: formData.kn_NOIDUNG,
        kn_NGAYKN: new Date(formData.kn_NGAYKN).toISOString(),
      };
      console.log('Dữ liệu gửi đi:', requestData);
      if (selectedComplaint) {
        const response = await axios.put(
          `http://localhost:8080/api/khieu-nai/${selectedComplaint.kn_ID}`,
          requestData
        );
        console.log('Cập nhật thành công:', response.data);
        toast.success('Cập nhật khiếu nại thành công!'); // Hiển thị toast khi sửa thành công
      } else {
        const response = await axios.post(
          'http://localhost:8080/api/khieu-nai',
          {
            ...requestData,
            nv_ID: parseInt(formData.nv_ID), // Gửi nv_ID khi thêm mới
          }
        );
        console.log('Thêm mới thành công:', response.data);
        toast.success('Thêm khiếu nại thành công!'); // Hiển thị toast khi thêm thành công
      }
      setShowModal(false);
      fetchComplaints();
    } catch (error) {
      console.error(
        'Error saving complaint:',
        error.response ? error.response.data : error.message
      );
      alert(
        'Lỗi khi lưu khiếu nại: ' +
          (error.response ? error.response.data : error.message)
      );
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedComplaint(null);
    setFormData({
      kn_NOIDUNG: '',
      kn_NGAYKN: '',
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
            <th>Tên Nhân Viên</th>
            <th>Nội Dung</th>
            <th>Ngày Khiếu Nại</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint, index) => (
            <tr key={complaint.kn_ID}>
              <td>{index + 1}</td>
              <td>{complaint.nv_ID ? complaint.nv_ID.NV_HOTEN : 'N/A'}</td>
              <td>{complaint.kn_NOIDUNG}</td>
              <td>{new Date(complaint.kn_NGAYKN).toLocaleDateString()}</td>
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
                  onClick={() => handleDelete(complaint.kn_ID)}
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
            {!selectedComplaint && (
              <Form.Group controlId="formNV_ID">
                <Form.Label>Mã Nhân Viên</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.nv_ID || ''}
                  onChange={e =>
                    setFormData({ ...formData, nv_ID: e.target.value })
                  }
                  required
                />
              </Form.Group>
            )}
            <Form.Group controlId="formKN_NOIDUNG">
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
            <Form.Group controlId="formKN_NGAYKN">
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

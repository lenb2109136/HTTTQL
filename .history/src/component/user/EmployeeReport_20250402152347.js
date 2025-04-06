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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nv_ID: '',
    kn_NOIDUNG: '',
    kn_NGAYKN: '',
  });

  // Lấy NV_ID từ localStorage
  const user = JSON.parse(localStorage.getItem('userId')); // Parse JSON
  const NV_ID = user ? user.NV_ID : null; // Lấy NV_ID

  useEffect(() => {
    if (NV_ID) {
      fetchMyComplaints();
    } else {
      console.error('NV_ID không tồn tại trong localStorage');
      toast.error('Vui lòng đăng nhập để xem khiếu nại!');
    }
  }, [NV_ID]);

  const fetchMyComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/khieu-nai');
      console.log('Dữ liệu từ API:', response.data);
      const myComplaints = response.data.filter(
        complaint => complaint.nv_ID && complaint.nv_ID.NV_ID === NV_ID
      );
      console.log('Khiếu nại sau khi lọc:', myComplaints);
      setComplaints(myComplaints);
    } catch (error) {
      console.error(
        'Error fetching complaints:',
        error.response ? error.response.data : error.message
      );
      toast.error('Lỗi khi tải khiếu nại!');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const requestData = {
        nv_ID: { NV_ID: parseInt(formData.nv_ID || NV_ID) }, // Gửi nv_ID dưới dạng object
        kn_NOIDUNG: formData.kn_NOIDUNG,
        kn_NGAYKN: new Date(formData.kn_NGAYKN).toISOString(),
      };
      console.log('Dữ liệu gửi đi:', requestData);
      const response = await axios.post(
        'http://localhost:8080/api/khieu-nai',
        requestData
      );
      console.log('Thêm mới thành công:', response.data);
      toast.success('Thêm khiếu nại thành công!');
      setShowModal(false);
      setFormData({
        nv_ID: '',
        kn_NOIDUNG: '',
        kn_NGAYKN: '',
      });
      fetchMyComplaints();
    } catch (error) {
      console.error(
        'Error saving complaint:',
        error.response ? error.response.data : error.message
      );
      toast.error(
        'Lỗi khi thêm khiếu nại: ' +
          (error.response ? error.response.data : error.message)
      );
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setFormData({
      nv_ID: '',
      kn_NOIDUNG: '',
      kn_NGAYKN: '',
    });
  };

  return (
    <Container>
      <h1 className="text-center my-4">Khiếu Nại Của Tôi</h1>
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
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint, index) => (
            <tr key={complaint.kn_ID}>
              <td>{index + 1}</td>
              <td>{complaint.nv_ID ? complaint.nv_ID.NV_HOTEN : 'N/A'}</td>
              <td>{complaint.kn_NOIDUNG}</td>
              <td>{new Date(complaint.kn_NGAYKN).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm Khiếu Nại</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNV_ID">
              <Form.Label>Mã Nhân Viên</Form.Label>
              <Form.Control
                type="number"
                value={formData.nv_ID || NV_ID || ''} // Sử dụng NV_ID từ localStorage
                onChange={e =>
                  setFormData({ ...formData, nv_ID: e.target.value })
                }
                required
                disabled={!!NV_ID} // Vô hiệu hóa nếu NV_ID đã có
              />
            </Form.Group>
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

export default MyComplaintsPage;

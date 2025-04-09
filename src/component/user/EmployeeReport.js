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

const EmployeeReport = () => {
  const [complaints, setComplaints] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    kn_NOIDUNG: '',
  });
  const [ngachLuongList, setNgachLuongList] = useState([]);
  const [bacLuongList, setBacLuongList] = useState([]);
  const [selectedNgachLuong, setSelectedNgachLuong] = useState('');
  const [selectedBacLuong, setSelectedBacLuong] = useState('');

  // Lấy NV_ID từ localStorage
  const user = JSON.parse(localStorage.getItem('employee')); // Sử dụng key 'employee'
  const NV_ID = user ? user.NV_ID : null; // Lấy NV_ID từ object
  const API_URL = 'http://localhost:8080/api';

  useEffect(() => {
    if (NV_ID) {
      fetchMyComplaints();
      fetchNgachLuong(); // Lấy danh sách ngạch lương
    } else {
      console.error('NV_ID không tồn tại trong localStorage');
      toast.error('Vui lòng đăng nhập để xem khiếu nại!');
    }
  }, [NV_ID]);

  const fetchMyComplaints = async () => {
    try {
      const response = await axios.get(`${API_URL}/khieu-nai`);
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

  const fetchNgachLuong = async () => {
    try {
      const response = await axios.get(`${API_URL}/ngach-luong/latest`);
      setNgachLuongList(response.data);
      if (response.data.length > 0) {
        setSelectedNgachLuong(response.data[0].ten); // Chọn tên ngạch đầu tiên mặc định
        fetchBacLuong(response.data[0].ten); // Lấy danh sách bậc lương tương ứng
      }
    } catch (error) {
      console.error('Lỗi khi lấy ngạch lương:', error);
      toast.error('Không thể tải danh sách ngạch lương.');
    }
  };

  const fetchBacLuong = async (ngachTen) => {
    try {
      const response = await axios.get(`${API_URL}/bac-luong/ngach/${ngachTen}/old`);
      setBacLuongList(response.data);
      if (response.data.length > 0) {
        setSelectedBacLuong(response.data[0].id); // Chọn bậc đầu tiên mặc định
      } else {
        setSelectedBacLuong('');
      }
    } catch (error) {
      console.error('Lỗi khi lấy bậc lương:', error);
      toast.error('Không thể tải danh sách bậc lương.');
    }
  };

  const handleNgachLuongChange = (e) => {
    const ngachTen = e.target.value;
    setSelectedNgachLuong(ngachTen);
    fetchBacLuong(ngachTen); // Cập nhật danh sách bậc lương khi chọn ngạch
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const requestData = {
        nv_ID: { NV_ID: NV_ID }, // Sử dụng NV_ID từ localStorage
        kn_NOIDUNG: formData.kn_NOIDUNG,
        kn_NGAYKN: new Date().toISOString(), // Lấy thời gian hiện tại
      };
      console.log('Dữ liệu gửi đi:', requestData);
      const response = await axios.post(
        `${API_URL}/khieu-nai`,
        requestData
      );
      console.log('Thêm mới thành công:', response.data);
      toast.success('Thêm khiếu nại thành công!');
      setShowModal(false);
      setFormData({
        kn_NOIDUNG: '',
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
      kn_NOIDUNG: '',
    });
  };

  return (
    <Container>
      <h1 className="text-center my-4">Khiếu Nại Của Tôi</h1>

      {/* Dropdown chọn ngạch và bậc lương */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group controlId="ngachLuongSelect">
            <Form.Label>Ngạch lương</Form.Label>
            <Form.Control
              as="select"
              value={selectedNgachLuong}
              onChange={handleNgachLuongChange}
            >
              <option value="">Chọn ngạch lương</option>
              {ngachLuongList.map((ngach) => (
                <option key={ngach.id} value={ngach.ten}>
                  {ngach.ten}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="bacLuongSelect">
            <Form.Label>Bậc lương</Form.Label>
            <Form.Control
              as="select"
              value={selectedBacLuong}
              onChange={(e) => setSelectedBacLuong(e.target.value)}
              disabled={!selectedNgachLuong}
            >
              <option value="">Chọn bậc lương</option>
              {bacLuongList.map((bac) => (
                <option key={bac.id} value={bac.id}>
                  {bac.ten}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

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
            <Button variant="primary" type="submit" className="mt-3">
              Lưu
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default EmployeeReport;
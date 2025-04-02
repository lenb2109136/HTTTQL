import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeeSalaryAdvance = () => {
  const [salaryAdvances, setSalaryAdvances] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    UL_NGAYUL: '',
    UL_TIEN: '',
  });
  const [errors, setErrors] = useState({});
  const employeeData = JSON.parse(localStorage.getItem('employee')) || {};
  const nvId = employeeData.NV_ID || 0;
  const ws = new WebSocket('ws://localhost:8080/hethongquanly/websocket'); // Đường dẫn WebSocket, cần điều chỉnh

  // Fetch salary advances khi component mount
  useEffect(() => {
    fetchSalaryAdvances();
    setupWebSocket();
    return () => ws.close(); // Đóng WebSocket khi component unmount
  }, [nvId]);

  // Thiết lập WebSocket
  const setupWebSocket = () => {
    ws.onopen = () => {
      console.log('WebSocket connected');
      ws.send(JSON.stringify({ type: 'subscribe', nvId })); // Gửi yêu cầu subscribe
    };

    ws.onmessage = event => {
      const data = JSON.parse(event.data);
      if (data.type === 'statusUpdate' && data.nvId === nvId) {
        toast.success(
          `Trạng thái ứng lương đã được cập nhật: ${data.UL_TRANGTHAI}`
        );
        fetchSalaryAdvances(); // Cập nhật danh sách sau khi nhận thông báo
      }
    };

    ws.onerror = error => console.error('WebSocket error:', error);
    ws.onclose = () => console.log('WebSocket disconnected');
  };

  // Lấy danh sách ứng lương
  const fetchSalaryAdvances = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/ung-luong?nvId=${nvId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSalaryAdvances(data.filter(item => item.NV_ID === nvId));
      }
    } catch (error) {
      console.error('Error fetching salary advances:', error);
      toast.error('Lỗi khi lấy danh sách ứng lương');
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    const currentDate = new Date();
    const selectedDate = new Date(formData.UL_NGAYUL);
    if (!formData.UL_NGAYUL || selectedDate <= currentDate) {
      newErrors.UL_NGAYUL = 'Ngày ứng lương phải lớn hơn ngày hiện tại';
    }
    if (
      !formData.UL_TIEN ||
      formData.UL_TIEN <= 0 ||
      formData.UL_TIEN > 10000000
    ) {
      newErrors.UL_TIEN = 'Số tiền phải lớn hơn 0 và không vượt quá 10,000,000';
    }
    return newErrors;
  };

  // Xử lý submit form
  const handleSubmit = async e => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const payload = {
      NV_ID: nvId,
      UL_NGAYUL: formData.UL_NGAYUL,
      UL_TIEN: parseFloat(formData.UL_TIEN),
      UL_TRANGTHAI: 'Chờ duyệt', // Trạng thái mặc định
    };

    try {
      const response = await fetch('http://localhost:8080/api/ung-luong', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        toast.success('Yêu cầu ứng lương đã được gửi thành công!');
        setShowModal(false);
        setFormData({ UL_NGAYUL: '', UL_TIEN: '' });
        setErrors({});
        fetchSalaryAdvances(); // Cập nhật danh sách
      } else {
        toast.error('Lỗi khi gửi yêu cầu ứng lương');
      }
    } catch (error) {
      console.error('Error submitting salary advance:', error);
      toast.error('Lỗi khi gửi yêu cầu ứng lương');
    }
  };

  // Xử lý thay đổi input
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Xóa lỗi khi thay đổi
  };

  return (
    <div className="salary-advance-container">
      <h1>Ứng Lương Của Tôi</h1>
      <Button
        variant="primary"
        onClick={() => setShowModal(true)}
        className="mb-3"
      >
        Yêu cầu ứng lương
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ngày Ứng</th>
            <th>Số Tiền</th>
            <th>Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          {salaryAdvances.map(advance => (
            <tr key={advance.UL_ID}>
              <td>{advance.UL_ID}</td>
              <td>{new Date(advance.UL_NGAYUL).toLocaleDateString()}</td>
              <td>{advance.UL_TIEN.toLocaleString()} VND</td>
              <td>{advance.UL_TRANGTHAI}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Yêu cầu ứng lương</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formDate">
              <Form.Label>Ngày ứng lương</Form.Label>
              <Form.Control
                type="date"
                name="UL_NGAYUL"
                value={formData.UL_NGAYUL}
                onChange={handleInputChange}
                isInvalid={!!errors.UL_NGAYUL}
              />
              <Form.Control.Feedback type="invalid">
                {errors.UL_NGAYUL}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAmount">
              <Form.Label>Số tiền (VND)</Form.Label>
              <Form.Control
                type="number"
                name="UL_TIEN"
                value={formData.UL_TIEN}
                onChange={handleInputChange}
                isInvalid={!!errors.UL_TIEN}
              />
              <Form.Control.Feedback type="invalid">
                {errors.UL_TIEN}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit">
              Gửi yêu cầu
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EmployeeSalaryAdvance;

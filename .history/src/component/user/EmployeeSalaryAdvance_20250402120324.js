import React, { useState, useEffect, useRef } from 'react';
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

  // State để lưu trữ các thông báo đã hiển thị (cho WebSocket deduplication)
  const [displayedNotifications, setDisplayedNotifications] = useState([]);
  // State để lưu trữ các message đã hiển thị toast
  const [displayedToastMessages, setDisplayedToastMessages] = useState([]);
  const ws = useRef(null); // Sử dụng useRef để quản lý WebSocket instance

  // Hàm helper để hiển thị toast với deduplication
  const showToast = (type, message, options = {}) => {
    if (!displayedToastMessages.includes(message)) {
      setDisplayedToastMessages(prev => [...prev, message]);
      if (type === 'success') {
        toast.success(message, options);
      } else if (type === 'error') {
        toast.error(message, options);
      }
    } else {
      console.log('Duplicate toast skipped:', message);
    }
  };

  useEffect(() => {
    const connectWebSocket = () => {
      if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
        console.log('Initializing WebSocket');
        ws.current = new WebSocket('ws://localhost:8080/websocket');

        ws.current.onopen = () => {
          console.log('WebSocket connected');
          ws.current.send(`subscribe:${nvId}`); // Gửi subscription
          showToast('success', 'Kết nối WebSocket thành công!'); // Thông báo khi kết nối thành công
        };

        ws.current.onmessage = event => {
          console.log('WebSocket message:', event.data);
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'statusUpdate' && data.nvId === nvId) {
              // Kiểm tra trùng lặp dựa trên message và time (dù không hiển thị toast, vẫn giữ logic để tránh xử lý dư thừa)
              const message = `Trạng thái ứng lương đã được cập nhật: ${data.UL_TRANGTHAI}`;
              const isDuplicate = displayedNotifications.some(
                n => n.message === message && n.time === data.time
              );
              if (!isDuplicate) {
                // Thêm thông báo vào danh sách đã hiển thị (dù không hiển thị toast)
                setDisplayedNotifications(prev => [
                  ...prev,
                  { message, time: data.time },
                ]);
                // Không hiển thị toast cho trạng thái ứng lương
                fetchSalaryAdvances(); // Cập nhật lại danh sách
              } else {
                console.log('Duplicate notification skipped:', message);
              }
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        ws.current.onerror = error => {
          console.error('WebSocket error:', error);
          // Không hiển thị toast.error ở đây
        };

        ws.current.onclose = () => {
          console.log('WebSocket disconnected. Retrying in 5 seconds...');
          setTimeout(connectWebSocket, 5000); // Tự động kết nối lại
        };
      }
    };

    connectWebSocket();
    fetchSalaryAdvances();

    // Cleanup
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [nvId]);

  const fetchSalaryAdvances = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/ung-luong?nvId=${nvId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log('Dữ liệu từ API:', data);
        setSalaryAdvances(data.filter(item => item.nv_ID === nvId));
      } else {
        console.error('Response not ok:', response.status, response.statusText);
        showToast(
          'error',
          `Lỗi khi lấy danh sách ứng lương: ${response.status}`
        );
        setSalaryAdvances([]);
      }
    } catch (error) {
      console.error('Error fetching salary advances:', error);
      showToast('error', 'Lỗi khi lấy danh sách ứng lương');
      setSalaryAdvances([]);
    }
  };

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
      UL_TRANGTHAI: 'Chờ duyệt',
    };

    try {
      const response = await fetch('http://localhost:8080/api/ung-luong', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        showToast('success', 'Yêu cầu ứng lương đã được gửi thành công!');
        setShowModal(false);
        setFormData({ UL_NGAYUL: '', UL_TIEN: '' });
        setErrors({});
        fetchSalaryAdvances();
      } else {
        showToast('error', 'Lỗi khi gửi yêu cầu ứng lương');
      }
    } catch (error) {
      console.error('Error submitting salary advance:', error);
      showToast('error', 'Lỗi khi gửi yêu cầu ứng lương');
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
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
          {salaryAdvances.length > 0 ? (
            salaryAdvances.map(advance => (
              <tr key={advance.ul_ID}>
                <td>{advance.ul_ID}</td>
                <td>{new Date(advance.ul_NGAYUL).toLocaleDateString()}</td>
                <td>{advance.ul_TIEN.toLocaleString()} VND</td>
                <td>{advance.ul_TRANGTHAI}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                Không có yêu cầu ứng lương nào.
              </td>
            </tr>
          )}
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

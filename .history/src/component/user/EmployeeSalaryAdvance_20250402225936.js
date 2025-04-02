import React, { useState, useEffect, useRef } from 'react';
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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // Added for redirection

const EmployeeSalaryAdvance = () => {
  const [salaryAdvances, setSalaryAdvances] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    UL_NGAYUL: '',
    UL_TIEN: '',
  });
  const [errors, setErrors] = useState({});
  const [nvId, setNvId] = useState(0); // State to store NV_ID
  const navigate = useNavigate(); // For redirecting to login

  // State for deduplication of notifications and toasts
  const [displayedNotifications, setDisplayedNotifications] = useState([]);
  const [displayedToastMessages, setDisplayedToastMessages] = useState([]);
  const ws = useRef(null); // WebSocket instance

  // Helper function to display toast with deduplication
  const showToast = (type, message, options = {}) => {
    if (!displayedToastMessages.includes(message)) {
      setDisplayedToastMessages((prev) => [...prev, message]);
      if (type === 'success') {
        toast.success(message, options);
      } else if (type === 'error') {
        toast.error(message, options);
      }
    } else {
      console.log('Duplicate toast skipped:', message);
    }
  };

  // Fetch NV_ID from localStorage on component mount
  useEffect(() => {
    const employeeDataString = localStorage.getItem('employee');
    if (!employeeDataString) {
      showToast('error', 'Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.');
      navigate('/login'); // Redirect to login if no employee data
      return;
    }

    try {
      const employeeData = JSON.parse(employeeDataString);
      const id = employeeData.NV_ID || 0;
      if (!id) {
        showToast('error', 'Không tìm thấy NV_ID hợp lệ. Vui lòng đăng nhập lại.');
        navigate('/login'); // Redirect to login if NV_ID is 0
        return;
      }
      setNvId(id);
      console.log('Employee data from localStorage:', employeeData);
      console.log('Extracted NV_ID:', id);
    } catch (error) {
      console.error('Error parsing employee data from localStorage:', error);
      showToast('error', 'Lỗi khi lấy thông tin nhân viên từ localStorage');
      setNvId(0);
      navigate('/login'); // Redirect to login on parsing error
    }
  }, [navigate]);

  // Listen for localStorage changes (e.g., logout from another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'employee' && !e.newValue) {
        showToast('error', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setNvId(0);
        navigate('/login');
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  // WebSocket and salary advances fetching
  useEffect(() => {
    const connectWebSocket = () => {
      if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
        console.log('Initializing WebSocket');
        ws.current = new WebSocket('ws://localhost:8080/websocket');

        ws.current.onopen = () => {
          console.log('WebSocket connected');
          if (nvId) {
            ws.current.send(`subscribe:${nvId}`);
            showToast('success', 'Kết nối WebSocket thành công!');
          } else {
            showToast('error', 'Không thể kết nối WebSocket: NV_ID không hợp lệ');
          }
        };

        ws.current.onmessage = (event) => {
          console.log('WebSocket message:', event.data);
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'statusUpdate' && data.nvId === nvId) {
              const message = `Trạng thái ứng lương đã được cập nhật: ${data.UL_TRANGTHAI}`;
              const isDuplicate = displayedNotifications.some(
                (n) => n.message === message && n.time === data.time
              );
              if (!isDuplicate) {
                setDisplayedNotifications((prev) => [
                  ...prev,
                  { message, time: data.time },
                ]);
                fetchSalaryAdvances();
              } else {
                console.log('Duplicate notification skipped:', message);
              }
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        ws.current.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        ws.current.onclose = () => {
          console.log('WebSocket disconnected. Retrying in 5 seconds...');
          setTimeout(connectWebSocket, 5000);
        };
      }
    };

    if (nvId) {
      connectWebSocket();
      fetchSalaryAdvances();
    }

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [nvId]);

  const fetchSalaryAdvances = async () => {
    if (!nvId) {
      showToast('error', 'Không thể tải danh sách ứng lương: NV_ID không hợp lệ');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/ung-luong?nvId=${nvId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        setSalaryAdvances(data.filter((item) => item.nv_ID === nvId));
      } else {
        showToast('error', `Lỗi khi lấy danh sách ứng lương: ${response.status}`);
        setSalaryAdvances([]);
      }
    } catch (error) {
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
    if (!formData.UL_TIEN || formData.UL_TIEN <= 0 || formData.UL_TIEN > 10000000) {
      newErrors.UL_TIEN = 'Số tiền phải lớn hơn 0 và không vượt quá 10,000,000';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nvId) {
      showToast('error', 'Vui lòng đăng nhập để gửi yêu cầu ứng lương');
      navigate('/login'); // Redirect to login if nvId is 0
      return;
    }

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const payload = {
      NV_ID: nvId, // NV_ID taken from state (sourced from localStorage)
      UL_NGAYUL: formData.UL_NGAYUL,
      UL_TIEN: parseFloat(formData.UL_TIEN),
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
        const errorText = await response.text();
        showToast('error', `Lỗi khi gửi yêu cầu ứng lương: ${errorText}`);
      }
    } catch (error) {
      showToast('error', 'Lỗi khi gửi yêu cầu ứng lương');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <Container>
      <h1 className="text-center my-4">Ứng Lương Của Tôi</h1>
      <Row className="mb-3 d-flex justify-content-between align-items-center">
        <Col>
          <h2>Danh sách ứng lương</h2>
        </Col>
        <Col className="text-end">
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
            disabled={!nvId}
          >
            <FiPlus /> Yêu cầu ứng lương
          </Button>
        </Col>
      </Row>
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
            salaryAdvances.map((advance) => (
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
                disabled={!nvId}
              />
              <Form.Control.Feedback type="invalid">
                {errors.UL_NGAYUL}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAmount">
              "Số tiền (VND)</Form.Label>
              <Form.Control
                type="number"
                name="UL_TIEN"
                value={formData.UL_TIEN}
                onChange={handleInputChange}
                isInvalid={!!errors.UL_TIEN}
                disabled={!nvId}
              />
              <Form.Control.Feedback type="invalid">
                {errors.UL_TIEN}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" disabled={!nvId}>
              Gửi yêu cầu
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default EmployeeSalaryAdvance;
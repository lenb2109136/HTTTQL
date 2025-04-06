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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const EmployeeSalaryAdvance = () => {
  const [salaryAdvances, setSalaryAdvances] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    ul_NGAYUL: '',
    ul_TIEN: '',
  });
  const [errors, setErrors] = useState({});
  const [nvId, setNvId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Hàm hiển thị toast
  const showToast = (type, message, options = {}) => {
    if (type === 'success') {
      toast.success(message, options);
    } else if (type === 'error') {
      toast.error(message, options);
    }
  };

  // Lấy NV_ID từ localStorage khi component mount
  useEffect(() => {
    const loadEmployeeData = () => {
      const employeeDataString = localStorage.getItem('employee');
      console.log('Raw employee data from localStorage:', employeeDataString);
      if (!employeeDataString) {
        showToast(
          'error',
          'Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.'
        );
        navigate('/login');
        return;
      }

      try {
        const employeeData = JSON.parse(employeeDataString);
        console.log('Parsed employee data:', employeeData);
        const id = employeeData.NV_ID || 0;
        if (!id || id === 0) {
          console.log('NV_ID không hợp lệ:', id);
          showToast(
            'error',
            'Không tìm thấy NV_ID hợp lệ. Vui lòng đăng nhập lại.'
          );
          localStorage.removeItem('employee');
          navigate('/login');
          return;
        }
        setNvId(id);
        console.log('Extracted NV_ID:', id);
        fetchSalaryAdvances(id); // Gọi hàm lấy danh sách ứng lương
      } catch (error) {
        console.error('Error parsing employee data from localStorage:', error);
        showToast('error', 'Lỗi khi lấy thông tin nhân viên từ localStorage');
        localStorage.removeItem('employee');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployeeData();
  }, [navigate]);

  // Lắng nghe sự thay đổi của localStorage (ví dụ: logout từ tab khác)
  useEffect(() => {
    const handleStorageChange = e => {
      if (e.key === 'employee' && !e.newValue) {
        showToast(
          'error',
          'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
        );
        setNvId(null);
        navigate('/login');
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  // Hàm lấy danh sách ứng lương
  const fetchSalaryAdvances = async id => {
    if (!id) {
      showToast(
        'error',
        'Không thể tải danh sách ứng lương: NV_ID không hợp lệ'
      );
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/ung-luong?nvId=${id}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSalaryAdvances(data.filter(item => item.nv_ID === id));
      } else {
        showToast(
          'error',
          `Lỗi khi lấy danh sách ứng lương: ${response.status}`
        );
        setSalaryAdvances([]);
      }
    } catch (error) {
      showToast('error', 'Lỗi khi lấy danh sách ứng lương');
      setSalaryAdvances([]);
    }
  };

  // Hàm validate form
  const validateForm = () => {
    const newErrors = {};
    const currentDate = new Date();
    const selectedDate = new Date(formData.ul_NGAYUL);
    if (!formData.ul_NGAYUL || selectedDate <= currentDate) {
      newErrors.ul_NGAYUL = 'Ngày ứng lương phải lớn hơn ngày hiện tại';
    }
    if (
      !formData.ul_TIEN ||
      formData.ul_TIEN <= 0 ||
      formData.ul_TIEN > 10000000
    ) {
      newErrors.ul_TIEN = 'Số tiền phải lớn hơn 0 và không vượt quá 10,000,000';
    }
    return newErrors;
  };

  // Hàm xử lý gửi yêu cầu ứng lương
  const handleSubmit = async e => {
    e.preventDefault();
    if (!nvId) {
      showToast('error', 'Vui lòng đăng nhập để gửi yêu cầu ứng lương');
      navigate('/login');
      return;
    }

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    console.log('NV_ID being sent in the request:', nvId);
    console.log('Request payload:', {
      nv_ID: nvId,
      ul_NGAYUL: formData.ul_NGAYUL,
      ul_TIEN: parseFloat(formData.ul_TIEN),
    });

    const payload = {
      nv_ID: nvId,
      ul_NGAYUL: formData.ul_NGAYUL,
      ul_TIEN: parseFloat(formData.ul_TIEN),
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
        setFormData({ ul_NGAYUL: '', ul_TIEN: '' });
        setErrors({});
        fetchSalaryAdvances(nvId); // Cập nhật danh sách ứng lương
      } else {
        const errorText = await response.text();
        showToast('error', `Lỗi khi gửi yêu cầu ứng lương: ${errorText}`);
      }
    } catch (error) {
      showToast('error', 'Lỗi khi gửi yêu cầu ứng lương');
    }
  };

  // Hàm xử lý thay đổi input
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

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
                name="ul_NGAYUL"
                value={formData.ul_NGAYUL}
                onChange={handleInputChange}
                isInvalid={!!errors.ul_NGAYUL}
                disabled={!nvId}
              />
              <Form.Control.Feedback type="invalid">
                {errors.ul_NGAYUL}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAmount">
              <Form.Label>Số tiền (VND)</Form.Label>
              <Form.Control
                type="number"
                name="ul_TIEN"
                value={formData.ul_TIEN}
                onChange={handleInputChange}
                isInvalid={!!errors.ul_TIEN}
                disabled={!nvId}
              />
              <Form.Control.Feedback type="invalid">
                {errors.ul_TIEN}
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

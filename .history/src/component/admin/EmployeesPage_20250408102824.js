import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Container,
  Row,
  Col,
  Modal,
  Form,
  Alert,
  InputGroup,
} from 'react-bootstrap';
import {
  FiPlus,
  FiEye,
  FiEyeOff,
  FiList,
  FiEdit,
  FiTrash,
} from 'react-icons/fi';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [historyEmployeeId, setHistoryEmployeeId] = useState(null);
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    NV_HOTEN: '',
    PB_ID: '',
    NV_NGAYSINH: '',
    NV_GIOITINH: null,
    NV_EMAIL: '',
    NV_SDT: '',
    NV_USERNAME: '',
    NV_PASSWORD: '',
    NV_DIACHI: '',
    NGACH_ID: '',
    BAC_ID: '',
  });
  const [departments, setDepartments] = useState([]);
  const [ngachLuongs, setNgachLuongs] = useState([]);
  const [bacLuongs, setBacLuongs] = useState([]);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const API_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchNgachLuongs();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_URL}/nhanvien`);
      console.log('Dữ liệu nhân viên từ backend:', response.data);

      const employeesWithSalaryDetails = await Promise.all(
        response.data.map(async emp => {
          try {
            const salaryResponse = await axios.get(
              `${API_URL}/chi-tiet-bac-luong/nhan-vien/${emp.NV_ID}/latest`
            );
            return {
              ...emp,
              latestChiTietBacLuong: salaryResponse.data,
            };
          } catch (error) {
            console.error(
              `Lỗi khi lấy thông tin bậc lương cho nhân viên ${emp.NV_ID}:`,
              error
            );
            return { ...emp, latestChiTietBacLuong: null };
          }
        })
      );

      const sortedEmployees = employeesWithSalaryDetails.sort((a, b) =>
        (a.PB_ID?.PB_TEN || '').localeCompare(b.PB_ID?.PB_TEN || '')
      );
      setEmployees(sortedEmployees);
    } catch (error) {
      console.error('Lỗi khi tải danh sách nhân viên:', error);
      toast.error(
        'Không thể tải danh sách nhân viên: ' +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${API_URL}/phongban`);
      console.log('Dữ liệu phòng ban từ backend:', response.data);
      setDepartments(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách phòng ban:', error);
      toast.error(
        'Không thể tải danh sách phòng ban: ' +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const fetchNgachLuongs = async () => {
    try {
      const response = await axios.get(`${API_URL}/ngach-luong/latest`);
      console.log('Dữ liệu ngạch lương từ backend:', response.data);
      setNgachLuongs(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách ngạch lương:', error);
      toast.error(
        'Không thể tải danh sách ngạch lương: ' +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const fetchBacLuongs = async ngachId => {
    if (!ngachId) {
      setBacLuongs([]);
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/bac-luong/ngach/${ngachId}`);
      console.log('Dữ liệu bậc lương từ backend:', response.data);
      setBacLuongs(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách bậc lương:', error);
      toast.error(
        'Không thể tải danh sách bậc lương: ' +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const fetchSalaryHistory = async employeeId => {
    try {
      const response = await axios.get(
        `${API_URL}/chi-tiet-bac-luong/nhan-vien/${employeeId}`
      );
      console.log('Lịch sử bậc lương:', response.data);
      // Sắp xếp theo ngày áp dụng để xác định bản ghi "Hiện tại"
      const sortedHistory = response.data.sort(
        (a, b) => new Date(b.ngayApDung) - new Date(a.ngayApDung)
      );
      setSalaryHistory(sortedHistory);
      setShowHistoryModal(true);
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử bậc lương:', error);
      toast.error(
        'Không thể tải lịch sử bậc lương: ' +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDelete = id => {
    console.log('Chuẩn bị xóa nhân viên ID:', id);
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      console.log('Xác nhận xóa nhân viên ID:', deleteId);
      await axios.delete(`${API_URL}/nhanvien/${deleteId}`);
      toast.success('Đã xóa nhân viên thành công!');
      fetchEmployees();
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Lỗi khi xóa nhân viên:', error);
      const errorMessage = error.response?.data?.message || error.message;
      const employeeName =
        employees.find(emp => emp.NV_ID === deleteId)?.NV_HOTEN ||
        'Không xác định';
      if (errorMessage.includes('foreign key constraint fails')) {
        toast.error(
          `Nhân viên (${employeeName}) còn dữ liệu ở các bảng khác nên không thể xóa!`
        );
      } else {
        toast.error(`Lỗi khi xóa nhân viên (${employeeName}): ${errorMessage}`);
      }
      setShowDeleteModal(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.NV_HOTEN) newErrors.NV_HOTEN = 'Họ tên là bắt buộc';
    if (!formData.PB_ID) newErrors.PB_ID = 'Phòng ban là bắt buộc';
    if (!formData.NV_NGAYSINH) newErrors.NV_NGAYSINH = 'Ngày sinh là bắt buộc';
    if (formData.NV_GIOITINH === null)
      newErrors.NV_GIOITINH = 'Giới tính là bắt buộc';
    if (!formData.NV_EMAIL) newErrors.NV_EMAIL = 'Email là bắt buộc';
    if (!formData.NV_SDT) newErrors.NV_SDT = 'Số điện thoại là bắt buộc';
    if (!formData.NV_USERNAME) newErrors.NV_USERNAME = 'Username là bắt buộc';
    if (!formData.NV_PASSWORD) newErrors.NV_PASSWORD = 'Mật khẩu là bắt buộc';
    if (!formData.NV_DIACHI) newErrors.NV_DIACHI = 'Địa chỉ là bắt buộc';
    if (!formData.NGACH_ID) newErrors.NV_ID = 'Ngạch lương là bắt buộc';
    if (!formData.BAC_ID) newErrors.BAC_ID = 'Bậc lương là bắt buộc';
    return newErrors;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      const payload = {
        NV_HOTEN: formData.NV_HOTEN,
        pbIdTemp: parseInt(formData.PB_ID),
        NV_NGAYSINH: formData.NV_NGAYSINH,
        NV_GIOITINH: formData.NV_GIOITINH ? 1 : 0,
        NV_EMAIL: formData.NV_EMAIL,
        NV_SDT: formData.NV_SDT,
        NV_USERNAME: formData.NV_USERNAME,
        NV_PASSWORD: formData.NV_PASSWORD,
        NV_DIACHI: formData.NV_DIACHI,
      };

      let newEmployeeId;

      if (editingEmployee) {
        await axios.put(
          `${API_URL}/nhanvien/${editingEmployee.NV_ID}`,
          payload
        );
        newEmployeeId = editingEmployee.NV_ID;

        if (formData.BAC_ID) {
          await axios.post(`${API_URL}/chi-tiet-bac-luong`, null, {
            params: {
              nhanVienId: newEmployeeId,
              bacLuongId: parseInt(formData.BAC_ID),
            },
          });
        }
        toast.success('Đã sửa thông tin nhân viên thành công!');
      } else {
        const newEmployeeResponse = await axios.post(
          `${API_URL}/nhanvien`,
          payload
        );
        newEmployeeId = newEmployeeResponse.data.NV_ID;

        if (formData.BAC_ID) {
          await axios.post(`${API_URL}/chi-tiet-bac-luong`, null, {
            params: {
              nhanVienId: newEmployeeId,
              bacLuongId: parseInt(formData.BAC_ID),
            },
          });
        }
        toast.success('Đã thêm nhân viên thành công!');
      }

      setShowModal(false);
      setEditingEmployee(null);
      resetForm();
      fetchEmployees();
    } catch (error) {
      console.error('Lỗi khi lưu nhân viên:', error);
      toast.error(
        'Không thể lưu nhân viên: ' +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleEdit = employee => {
    console.log('Chỉnh sửa nhân viên:', employee);
    setEditingEmployee(employee);
    setFormData({
      NV_HOTEN: employee.NV_HOTEN || '',
      PB_ID: employee.PB_ID?.PB_ID || '',
      NV_NGAYSINH: employee.NV_NGAYSINH || '',
      NV_GIOITINH: employee.NV_GIOITINH === 1,
      NV_EMAIL: employee.NV_EMAIL || '',
      NV_SDT: employee.NV_SDT || '',
      NV_USERNAME: employee.NV_USERNAME || '',
      NV_PASSWORD: employee.NV_PASSWORD || '',
      NV_DIACHI: employee.NV_DIACHI || '',
      NGACH_ID: employee.latestChiTietBacLuong?.bac_ID?.ngachLuong?.id || '',
      BAC_ID: employee.latestChiTietBacLuong?.bac_ID?.id || '',
    });
    if (employee.latestChiTietBacLuong?.bac_ID?.ngachLuong?.id) {
      fetchBacLuongs(employee.latestChiTietBacLuong.bac_ID.ngachLuong.id);
    }
    setErrors({});
    setShowPassword(false);
    setShowModal(true);
  };

  const handleShowHistory = employeeId => {
    setHistoryEmployeeId(employeeId);
    fetchSalaryHistory(employeeId);
  };

  const resetForm = () => {
    setFormData({
      NV_HOTEN: '',
      PB_ID: '',
      NV_NGAYSINH: '',
      NV_GIOITINH: null,
      NV_EMAIL: '',
      NV_SDT: '',
      NV_USERNAME: '',
      NV_PASSWORD: '',
      NV_DIACHI: '',
      NGACH_ID: '',
      BAC_ID: '',
    });
    setErrors({});
    setShowPassword(false);
    setBacLuongs([]);
  };

  const handleNgachChange = e => {
    const ngachId = e.target.value;
    setFormData({ ...formData, NGACH_ID: ngachId, BAC_ID: '' });
    if (ngachId) fetchBacLuongs(ngachId);
    else setBacLuongs([]);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
    resetForm();
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleCloseHistoryModal = () => {
    setShowHistoryModal(false);
    setSalaryHistory([]);
    setHistoryEmployeeId(null);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container>
      <h1 className="text-center my-4">Quản lý nhân viên</h1>
      <Row className="mb-3 d-flex justify-content-between align-items-center">
        <Col>
          <h2>Danh sách nhân viên</h2>
        </Col>
        <Col className="text-end">
          <Button
            variant="primary"
            onClick={() => {
              setShowModal(true);
              resetForm();
            }}
          >
            <FiPlus /> Thêm nhân viên
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>STT</th>
            <th>Họ tên</th>
            <th>Phòng ban</th>
            <th>Ngạch lương</th>
            <th>Bậc lương</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                Không có nhân viên nào.
              </td>
            </tr>
          ) : (
            employees.map((emp, index) => (
              <tr key={emp.NV_ID}>
                <td>{index + 1}</td>
                <td>{emp.NV_HOTEN || 'N/A'}</td>
                <td>{emp.PB_ID?.PB_TEN || 'N/A'}</td>
                <td>
                  {emp.latestChiTietBacLuong?.bac_ID?.ngachLuong?.ten ||
                    'Chưa có ngạch lương'}
                </td>
                <td>
                  {emp.latestChiTietBacLuong?.bac_ID?.ten ||
                    'Chưa có bậc lương'}
                </td>
                <td>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => handleEdit(emp)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="danger"
                    className="me-2"
                    onClick={() => handleDelete(emp.NV_ID)}
                  >
                    Xóa
                  </Button>
                  <Button
                    variant="info"
                    onClick={() => handleShowHistory(emp.NV_ID)}
                  >
                    <FiList /> Lịch sử
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton className="d-flex justify-content-center">
          <Modal.Title className="w-100 text-center">
            {editingEmployee ? 'Sửa nhân viên' : 'Thêm nhân viên'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Họ tên</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.NV_HOTEN}
                    onChange={e =>
                      setFormData({ ...formData, NV_HOTEN: e.target.value })
                    }
                    isInvalid={!!errors.NV_HOTEN}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.NV_HOTEN}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phòng ban</Form.Label>
                  <Form.Select
                    value={formData.PB_ID}
                    onChange={e =>
                      setFormData({ ...formData, PB_ID: e.target.value })
                    }
                    isInvalid={!!errors.PB_ID}
                  >
                    <option value="">Chọn phòng ban</option>
                    {departments.map(dep => (
                      <option key={dep.PB_ID} value={dep.PB_ID}>
                        {dep.PB_TEN}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.PB_ID}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Ngày sinh</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.NV_NGAYSINH}
                    onChange={e =>
                      setFormData({ ...formData, NV_NGAYSINH: e.target.value })
                    }
                    isInvalid={!!errors.NV_NGAYSINH}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.NV_NGAYSINH}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Giới tính</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Nam"
                      name="gender"
                      checked={formData.NV_GIOITINH === true}
                      onChange={() =>
                        setFormData({ ...formData, NV_GIOITINH: true })
                      }
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Nữ"
                      name="gender"
                      checked={formData.NV_GIOITINH === false}
                      onChange={() =>
                        setFormData({ ...formData, NV_GIOITINH: false })
                      }
                    />
                  </div>
                  {errors.NV_GIOITINH && (
                    <Alert variant="danger" className="mt-2">
                      {errors.NV_GIOITINH}
                    </Alert>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.NV_EMAIL}
                    onChange={e =>
                      setFormData({ ...formData, NV_EMAIL: e.target.value })
                    }
                    isInvalid={!!errors.NV_EMAIL}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.NV_EMAIL}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.NV_SDT}
                    onChange={e =>
                      setFormData({ ...formData, NV_SDT: e.target.value })
                    }
                    isInvalid={!!errors.NV_SDT}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.NV_SDT}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.NV_USERNAME}
                    onChange={e =>
                      setFormData({ ...formData, NV_USERNAME: e.target.value })
                    }
                    isInvalid={!!errors.NV_USERNAME}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.NV_USERNAME}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      value={formData.NV_PASSWORD}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          NV_PASSWORD: e.target.value,
                        })
                      }
                      isInvalid={!!errors.NV_PASSWORD}
                    />
                    <InputGroup.Text
                      onClick={toggleShowPassword}
                      style={{ cursor: 'pointer' }}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.NV_PASSWORD}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Địa chỉ</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.NV_DIACHI}
                    onChange={e =>
                      setFormData({ ...formData, NV_DIACHI: e.target.value })
                    }
                    isInvalid={!!errors.NV_DIACHI}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.NV_DIACHI}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Ngạch lương</Form.Label>
                  <Form.Select
                    value={formData.NGACH_ID}
                    onChange={handleNgachChange}
                    isInvalid={!!errors.NGACH_ID}
                  >
                    <option value="">Chọn ngạch lương</option>
                    {ngachLuongs.map(ngach => (
                      <option key={ngach.id} value={ngach.id}>
                        {ngach.ten}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.NGACH_ID}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Bậc lương</Form.Label>
                  <Form.Select
                    value={formData.BAC_ID}
                    onChange={e =>
                      setFormData({ ...formData, BAC_ID: e.target.value })
                    }
                    isInvalid={!!errors.BAC_ID}
                    disabled={!formData.NGACH_ID}
                  >
                    <option value="">Chọn bậc lương</option>
                    {bacLuongs.map(bac => (
                      <option key={bac.id} value={bac.id}>
                        {bac.ten}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.BAC_ID}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-center mt-3">
              <Button variant="primary" type="submit">
                Lưu
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal xác nhận xóa */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {employees
            .filter(emp => emp.NV_ID === deleteId)
            .map(emp => (
              <div key={emp.NV_ID}>
                <p>
                  Bạn có chắc chắn muốn xóa nhân viên{' '}
                  <strong>{emp.NV_HOTEN}</strong> không?
                </p>
                <p>
                  Phòng ban: <strong>{emp.PB_ID?.PB_TEN || 'N/A'}</strong>
                </p>
                <p>
                  Ngạch lương:{' '}
                  <strong>
                    {emp.latestChiTietBacLuong?.bac_ID?.ngachLuong?.ten ||
                      'Chưa có'}
                  </strong>
                </p>
                <p>
                  Bậc lương:{' '}
                  <strong>
                    {emp.latestChiTietBacLuong?.bac_ID?.ten || 'Chưa có'}
                  </strong>
                </p>
                <p className="text-danger">Hành động này không thể hoàn tác!</p>
              </div>
            ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal xem lịch sử bậc lương */}
      <Modal
        show={showHistoryModal}
        onHide={handleCloseHistoryModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Lịch sử bậc lương</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {salaryHistory.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th className="text-center">Ngạch lương</th>
                  <th className="text-center">Bậc lương</th>
                  <th className="text-center">Hệ số</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {salaryHistory.map((history, index) => {
                  const isCurrent = index === 0; // Bản ghi đầu tiên là mới nhất (Hiện tại)
                  const status = isCurrent
                    ? 'Hiện tại'
                    : `${new Date(history.ngayApDung).toLocaleDateString()} - ${
                        index < salaryHistory.length - 1
                          ? new Date(
                              salaryHistory[index + 1].ngayApDung
                            ).toLocaleDateString()
                          : 'N/A'
                      }`;
                  return (
                    <tr key={history.id}>
                      <td className="text-center">
                        {history.bac_ID?.ngachLuong?.ten || 'N/A'}
                      </td>
                      <td className="text-center">
                        {history.bac_ID?.ten || 'N/A'}
                      </td>
                      <td className="text-center">
                        {history.bac_ID?.heSo || 'N/A'}
                      </td>
                      <td className="text-center">{status}</td>
                      <td className="text-center">
                        <Button variant="warning" size="sm" className="me-2">
                          <FiEdit /> Sửa
                        </Button>
                        <Button variant="danger" size="sm">
                          <FiTrash /> Xóa
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <p>Không có dữ liệu lịch sử bậc lương.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseHistoryModal}>
            Đóng
          </Button>
        </Modal.Footer>
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

export default EmployeesPage;

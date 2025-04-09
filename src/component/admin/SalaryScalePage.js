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
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import moment from 'moment'


const SalaryScalePage = () => {
    const idchon =useRef({
        "id": 0,
        "luongCoSo": 0,
        "ten": "",
        "ngayApDung": "2025-01-01"
    })
    const [lichsu,setlicchsu]= useState([])
  const [ngachLuongs, setNgachLuongs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate=useNavigate()
  const [editingNgachLuong, setEditingNgachLuong] = useState(null);
  const [formData, setFormData] = useState({
    NGACH_TEN: '',
    NGACH_LUONGCOSO: 0,
  });
  const [errors, setErrors] = useState({});

  const API_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchNgachLuongs();
  }, []);

  const fetchNgachLuongs = async () => {
    try {
      const response = await axios.get(`${API_URL}/ngach-luong/latest`);
      console.log('Dữ liệu ngạch lương từ backend:', response.data);
      setNgachLuongs(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách ngạch lương:', error);
      toast.error(
        'Không thể tải danh sách ngạch lương: ' +
          (error.response?.data || error.message)
      );
    }
  };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.NGACH_TEN) newErrors.NGACH_TEN = 'Tên ngạch lương là bắt buộc';
//     // if (!formData.NL_MA) newErrors.NL_MA = 'Mã ngạch là bắt buộc';
//     if (!formData.NGACH_LUONGCOSO || formData.NGACH_LUONGCOSO <= 0)
//       newErrors.NGACH_LUONGCOSO = 'Hệ số lương phải lớn hơn 0';
//     return newErrors;
//   };



  const handleEdit = ngachLuong => {
    console.log('Chỉnh sửa ngạch lương:', ngachLuong);
    setEditingNgachLuong(ngachLuong);
    setFormData({
      NGACH_LUONGCOSO: ngachLuong.heSoLuong || 0,
    });
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = id => {
    console.log('Chuẩn bị xóa ngạch lương ID:', id);
    setDeleteId(id);
    setShowDeleteModal(true);
  };
// const handleSubmit = async e => {
//     e.preventDefault();
//     // const formErrors = validateForm();
//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       toast.error('Vui lòng điền đầy đủ thông tin!');
//       return;
//     }

//     try {
//       const payload = {
//         tenNgach: formData.NGACH_TEN,
//         heSoLuong: formData.NGACH_LUONGCOSO,
//       };
//       console.log('Gửi dữ liệu:', payload);

//       if (editingNgachLuong) {
//         const response = await axios.put(
//           `${API_URL}/${editingNgachLuong.id}`,
//           payload
//         );
//         console.log('Kết quả sửa:', response.data);
//         toast.success('Đã sửa thông tin ngạch lương thành công!');
//       } else {
//         const response = await axios.post(API_URL, payload);
//         console.log('Kết quả thêm:', response.data);
//         toast.success('Đã thêm ngạch lương thành công!');
//       }
//       setShowModal(false);
//       setEditingNgachLuong(null);
//       resetForm();
//       fetchNgachLuongs();
//     } catch (error) {
//       console.error('Lỗi khi lưu ngạch lương:', error);
//       toast.error(
//         'Không thể lưu ngạch lương: ' + (error.response?.data || error.message)
//       );
//     }
//   };
  const confirmDelete = async () => {
    try {
      console.log('Xác nhận xóa ngạch lương ID:', deleteId);
      await axios.delete(`${API_URL}/${deleteId}`);
      toast.success('Đã xóa ngạch lương thành công!');
      fetchNgachLuongs();
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Lỗi khi xóa ngạch lương:', error);
      const errorMessage = error.response?.data || error.message;
      if (errorMessage.includes('foreign key constraint fails')) {
        toast.error(
          'Không thể xóa ngạch lương vì đang được sử dụng bởi nhân viên.'
        );
      } else {
        toast.error('Không thể xóa ngạch lương: ' + errorMessage);
      }
      setShowDeleteModal(false);
    }
  };

  const resetForm = () => {
    setFormData({
      NGACH_TEN: '',
      NGACH_LUONGCOSO: 0,
    });
    setErrors({});
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingNgachLuong(null);
    resetForm();
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  return (
    <Container>
      <h1 className="text-center my-4">Quản lý ngạch lương</h1>
      <Row className="mb-3 d-flex justify-content-between align-items-center">
        <Col>
          <h2>Danh sách ngạch lương</h2>
        </Col>
        <Col className="text-end">
          <Button
            variant="primary"
            onClick={() => {
              setShowModal(true);
              resetForm();
            }}
          >
            <FiPlus /> Thêm ngạch lương
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên ngạch</th>
            {/* <th>Mã ngạch</th> */}
            <th>Lương cơ sở</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {ngachLuongs.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                Không có ngạch lương nào.
              </td>
            </tr>
          ) : (
            ngachLuongs.map((ngach, index) => (
              <tr key={ngach.id}>
                <td>{index + 1}</td>
                <td>{ngach.ten || 'N/A'}</td>
                {/* <td>{ngach.maNgach || 'N/A'}</td> */}
                <td>{Intl.NumberFormat().format(ngach.luongCoSo || 0)}</td>
                <td>
                  <Button

                    variant="warning"
                    className="me-2"
                    onClick={() => {
                        idchon.current=ngach;
                        handleEdit(ngach)
                    }}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="danger"
                    // onClick={() => handleDelete(ngach.id)}
                  >
                    Xóa
                  </Button>
                  <Button
                    style={{marginLeft:"10px"}}
                    variant="warning"
                    className="me-2"
                    onClick={() => {
                        axios.get(`http://localhost:8080/api/ngach-luong?ten=${ngach.ten}`)
                        .then((response)=>{
                            setlicchsu(response.data)
                            setShowModal2(true)
                        })
                        .catch(()=>{})
                    }}
                  >
                    Xem lịch sử
                  </Button>
                  <Button
                    style={{marginLeft:"10px"}}
                    variant="warning"
                    className="me-2"
                    onClick={() => {
                        navigate(`/pay-grade?id=${ngach.ten}`)
                        // ngach.id
                    }}
                  >
                    Chi tiết bậc
                  </Button>

                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Modal for Add/Edit */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="d-flex justify-content-center">
            <Modal.Title className="w-100 text-center">
            {editingNgachLuong ? 'Sửa ngạch lương' : 'Thêm ngạch lương'}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form >
            <Form.Group className="mb-3">
                <Form.Label>Tên ngạch lương</Form.Label>
                <Form.Control
                type="text"
                defaultValue={idchon.current?.ten}
                value={formData.NGACH_TEN}
                onChange={e =>
                {
                    idchon.current.ten=e.target.value
                    setFormData({ ...formData, NGACH_TEN: e.target.value })
                }
                }
                isInvalid={!!errors.NGACH_TEN}
                />
                <Form.Control.Feedback type="invalid">
                {errors.NGACH_TEN}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Lương cơ sở</Form.Label>
                <Form.Control
                  type="text"
                  value={Number(idchon.current?.luongCoSo || 0).toLocaleString('vi-VN')}
                  onChange={(e) => {
                    const input = e.target.value;

                    // Loại bỏ dấu phẩy, khoảng trắng → chỉ giữ lại số
                    const cleaned = input.replace(/[^\d]/g, '');
                    const numericValue = parseFloat(cleaned) || 0;

                    // Cập nhật ref
                    idchon.current.luongCoSo = numericValue;

                    // Cập nhật state chính
                    setFormData({ ...formData, NGACH_LUONGCOSO: numericValue });
                  }}
                  isInvalid={!!errors.NGACH_LUONGCOSO}
                />
                <Form.Control.Feedback type="invalid">
                {errors.NGACH_LUONGCOSO}
                </Form.Control.Feedback>
            </Form.Group>
            <div  className="d-flex justify-content-center mt-3">
                <Button onClick={()=>{
                    const today = new Date();
                    const formattedDate = today.toISOString().split('T')[0];
                    idchon.current.ngayApDung = formattedDate;
                    console.log(idchon.current)
                    axios.post("http://localhost:8080/api/ngach-luong",idchon.current)
                    .then((respose)=>{
                        idchon.current={
                            "id": 0,
                            "luongCoSo": 0,
                            "ten": "",
                            "ngayApDung": formattedDate
                        }
                        alert("Lưu thành công")

                    }).catch((erro)=>{
                        alert("Có lỗi xayra")
                    })
                }} variant="primary" >
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
            <p>Bạn có chắc chắn muốn xóa ngạch lương này không?</p>
            <p className="text-danger">Hành động này không thể hoàn tác!</p>
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


<Dialog open={showModal2} onClose={()=>setShowModal2(false)} fullWidth maxWidth="sm">
  <DialogTitle>
    <p style={{textAlign:"center"}}>Lịch sử cập nhật</p>
  </DialogTitle>
  <DialogContent>
  <Table striped bordered hover>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên ngạch</th>
            {/* <th>Mã ngạch</th> */}
            <th>Lương cơ sở</th>
            <th>Ngày cập nhật</th>
          </tr>
        </thead>
        <tbody>
          {lichsu.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                Không có ngạch lương nào.
              </td>
            </tr>
          ) : (
            lichsu.map((ngach, index) => (
              <tr key={ngach.id}>
                <td>{index + 1}</td>
                <td>{ngach.ten || 'N/A'}</td>
                {/* <td>{ngach.maNgach || 'N/A'}</td> */}
                <td>{Intl.NumberFormat().format(ngach.luongCoSo || 0)}</td>
                <td>
                {moment(ngach.ngayApDung).utcOffset('+07:00').format('DD/MM/YYYY HH:mm:ss') || 0}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
  </DialogContent>

</Dialog>
    </Container>
  );
};

export default SalaryScalePage;
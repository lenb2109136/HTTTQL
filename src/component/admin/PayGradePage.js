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
import { useNavigate, useSearchParams } from 'react-router-dom';
function formatDate(inputDate) {
    const date = new Date(inputDate);
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };

    const formattedDate = date.toLocaleString('en-GB', options);
    return formattedDate.replace(',', '');
  }
const SalaryScalePage = () => {

    const [searchParams] = useSearchParams();
const id = searchParams.get('id');
    const [lichsu,setlicchsu]= useState([])
  const [ngachLuongs, setNgachLuongs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate=useNavigate()
  const [load,setload]=useState(false)
  const [editingNgachLuong, setEditingNgachLuong] = useState(null);
  const [formData, setFormData] = useState({
    BAC_TEN: '',
    BAC_HESO: 0,
  });
  const [errors, setErrors] = useState({});
  const [selectedNgachId, setSelectedNgachId] = useState(null);

  const API_URL = 'http://localhost:8080/api';
  const idchon =useRef({
    "id": 0,
    "ten": "",
    "heSo": 1,
    "ngachId":selectedNgachId
})

  useEffect(() => {
    // fetchNgachLuongsTen();
    fetchNgachLuongs();
  }, []);

  // const fetchNgachLuongsTen = async () => {

  //     const response = await axios.get(`http://localhost:8080/api/ngach-luong/${id}`);
  //     console.log('Dữ liệu ngạch lương từ backend:', response.data);
  //     const idFromResponse = response.data.ten;
  //     console.log("ID lấy được:", idFromResponse);

  //     if (idFromResponse) {
  //       setSelectedNgachId(idFromResponse); // ← lưu ra ngoài
  //     }
  //     setNgachLuongs(response.data);

  // };


  const fetchNgachLuongs = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/bac-luong/ngach/${id}/old`);
      console.log('Dữ liệu ngạch lương từ backend:', response.data);
      const idFromResponse = response.data[0]?.ngachLuong?.id;
      console.log("ID lấy được:", idFromResponse);

      if (idFromResponse) {
        setSelectedNgachId(idFromResponse); // ← lưu ra ngoài
      }
      else{
        const response1 = await axios.get(`http://localhost:8080/api/ngach-luong?ten=${id}`);
        console.log('Dữ liệu TÊN:', response1.data);
        const idFromResponse = response1.data[0]?.id;
        console.log("ID lấy được FGFDFDHH:", idFromResponse);
        setSelectedNgachId(idFromResponse);
      }
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
//     if (!formData.BAC_TEN) newErrors.BAC_TEN = 'Tên ngạch lương là bắt buộc';
//     // if (!formData.NL_MA) newErrors.NL_MA = 'Mã ngạch là bắt buộc';
//     if (!formData.BAC_HESO || formData.BAC_HESO <= 0)
//       newErrors.BAC_HESO = 'Hệ số lương phải lớn hơn 0';
//     return newErrors;
//   };



  const handleEdit = ngachLuong => {
    console.log('Chỉnh sửa ngạch lương:', ngachLuong);
    setEditingNgachLuong(ngachLuong);
    setFormData({
      BAC_HESO: ngachLuong.heSoLuong || 0,
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
//         tenNgach: formData.BAC_TEN,
//         heSoLuong: formData.BAC_HESO,
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
      BAC_TEN: '',
      BAC_HESO: 0,
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
      <h1 className="text-center my-4">Quản lý bậc lương {id}</h1>
      <Row className="mb-3 d-flex justify-content-between align-items-center">
        <Col>
          <h2>Danh sách bậc lương</h2>
        </Col>
        <Col className="text-end">
          <Button
            variant="primary"
            onClick={() => {
              setShowModal(true);
              resetForm();
            }}
          >
            <FiPlus /> Thêm bậc lương
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên bậc</th>
            {/* <th>Mã ngạch</th> */}
            <th>Hệ số lương</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {ngachLuongs.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                Không có bậc lương nào.
              </td>
            </tr>
          ) : (
            ngachLuongs.map((ngach, index) => (
              <tr key={ngach.id}>
                <td>{index + 1}</td>
                <td>{ngach.ten || 'N/A'}</td>
                {/* <td>{ngach.maNgach || 'N/A'}</td> */}
                <td>{ngach.heSo || 0}</td>
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
                  {/* <Button
                    variant="danger"
                    // onClick={() => handleDelete(ngach.id)}
                  >
                    Xóa
                  </Button> */}
                  <Button
                    style={{marginLeft:"10px"}}
                    variant="warning"
                    className="me-2"
                    onClick={() => {
                        axios.get(`http://localhost:8080/api/bac-luong?ten=${ngach.ten}`)
                        .then((response)=>{
                            setlicchsu(response.data)
                            setShowModal2(true)
                        })
                        .catch(()=>{})
                    }}
                  >
                    Xem lịch sử
                  </Button>
                  {/* <Button
                    style={{marginLeft:"10px"}}
                    variant="warning"
                    className="me-2"
                    onClick={() => {
                        navigate(`/pay-grade?id=${ngach.id}`)
                    }}
                  >
                    Chi tiết bậc
                  </Button> */}
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
                <Form.Label>Tên bậc lương</Form.Label>
                <Form.Control
                type="text"
                defaultValue={idchon.current?.ten}
                value={formData.BAC_TEN}
                onChange={e =>
                {
                    idchon.current.ten=e.target.value
                    setFormData({ ...formData, BAC_TEN: e.target.value })
                }
                }
                isInvalid={!!errors.BAC_TEN}
                />
                <Form.Control.Feedback type="invalid">
                {errors.BAC_TEN}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Hệ số lương </Form.Label>
                <Form.Control
                type="number"
                step="0.01"
                min="1"
                defaultValue={idchon.current?.heSo}
                // value={formData.BAC_HESO}
                onChange={(e) =>{
                    idchon.current.heSo=e.target.value
                    setFormData({ ...formData, BAC_HESO: parseFloat(e.target.value) || 0 })
                }}
                isInvalid={!!errors.BAC_HESO}
                />
                <Form.Control.Feedback type="invalid">
                {errors.BAC_HESO}
                </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-center mt-3">
                <Button onClick={()=>{
                    const today = new Date();
                    const formattedDate = today.toISOString();
                    idchon.current.ngayApDung = formattedDate;
                    idchon.current.ngachId=selectedNgachId;

                    console.log(idchon.current)

                    // axios.post("http://localhost:8080/api/bac-luong/save",idchon.current)
                    axios.post(`http://localhost:8080/api/bac-luong/${selectedNgachId}`, idchon.current)

                    .then((respose)=>{
                        idchon.current={
                            "id": 0,
                            "heSo": 1,
                            "ten": "",
                        }
                        alert("Lưu thành công")

                    }).catch((erro)=>{
                        alert("Có lỗi xayra")
                    })
                    axios.get(`http://localhost:8080/api/bac-luong/ngach/${selectedNgachId}/latest`)
                    .then((response)=>{
                        setNgachLuongs(response.data);
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
            <th>Tên Bậc</th>
            {/* <th>Mã ngạch</th> */}
            <th>Hệ số lương</th>
            <th>Ngày cập nhật</th>
          </tr>
        </thead>
        <tbody>
          {lichsu.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                Không có bậc lương nào.
              </td>
            </tr>
          ) : (
            lichsu.map((ngach, index) => (
              <tr key={ngach.id}>
                <td>{index + 1}</td>
                <td>{ngach.ten || 'N/A'}</td>
                {/* <td>{ngach.maNgach || 'N/A'}</td> */}
                <td>{ngach.heSo || 0}</td>
                <td>
                {formatDate(ngach.ngayApDung)|| 0}
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
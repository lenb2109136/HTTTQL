import React, { useState, useEffect, useReducer, useRef } from 'react';
import {
  Box,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  TextField,
} from '@mui/material';
import {
  Container,
  Table,
  Button,
  Row,
  Col,
  Modal,
  Form,
} from 'react-bootstrap';
import { FiPlus } from 'react-icons/fi';
import axios from 'axios';
function convertDatetime(dateStr) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}
const EmployeesPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [phongBan, setPhongBan] = useState('');
  const [nghachLuong, setnghachLuong] = useState('');
  const [ngayBatDau, setNgayBatDau] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0]
  );
  const [ngayKetThuc, setNgayKetThuc] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [dsluong, setdsluong] = useState([]);
  const handlePhongBanChange = event => {
    setPhongBan(event.target.value);
  };
  const handlenghachLuongChange = event => setnghachLuong(event.target.value);
  const dongduocchon = useRef({});
  const [dsphongBan, setdsPhongBan] = useState([]);
  const [dsnghachLuong, setdsnghachLuong] = useState([]);
  const handleDownload = () => {
    const url = `http://localhost:8080/getexcel/getexcel?nvid=${0}&nbd=${ngayBatDau}&nkt=${ngayKetThuc}&thang=${selectedMonth}&nam=${selectedYear}`;

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/api/nhanvien/getluongnhanvienbybophan?nvid=0&nbd=${ngayBatDau}&nkt=${ngayKetThuc}&thang=${selectedMonth}&nam=${selectedYear}`
      )
      .then(data => {
        setdsluong(data.data.data);
      })
      .catch(() => {});
  }, [ngayBatDau, ngayKetThuc, selectedMonth, selectedYear]);

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/phongban/getPhongBan')
      .then(response => setdsPhongBan(response.data.data || []))
      .catch(() => console.log('Không lấy được dữ liệu phòng ban'));

    axios
      .get('http://localhost:8080/api/nghachluong/getngachluong')
      .then(response => setdsnghachLuong(response.data.data || []))
      .catch(() => console.log('Không lấy được dữ liệu nghạch lương'));

    axios
      .get(
        `http://localhost:8080/api/nhanvien/getluongnhanvienbybophan?nvid=0&nbd=&nkt=`
      )
      .then(data => {
        setdsluong(data.data.data);
      })
      .catch(() => {});
  }, []);

  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => setShowModal(false);
  const handleModalOpen = () => setShowModal(true);

  const [showModal5, setShowModal5] = useState(false);
  const handleModalClose5 = () => setShowModal5(false);
  const handleModalOpen5 = () => setShowModal5(true);

  return (
    <Container>
      <h1 className="text-center my-4">Quản Lý Lương Nhân Sự</h1>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: 3,
        }}
      >
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="phong-ban-label">Chọn phòng ban</InputLabel>
          <Select
            labelId="phong-ban-label"
            id="phong-ban-select"
            value={phongBan}
            onChange={e => {
              handlePhongBanChange(e);
            }}
            displayEmpty
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                  overflowY: 'auto',
                  zIndex: 1300,
                  backgroundColor: 'white',
                  color: 'black',
                },
              },
            }}
          >
            {dsphongBan.length > 0 ? (
              dsphongBan.map(data => (
                <MenuItem
                  onClick={() => {
                    axios
                      .get(
                        `http://localhost:8080/api/nhanvien/getluongnhanvienbybophan?nvid=${data?.PB_ID}&nbd=${ngayBatDau}&nkt=${ngayKetThuc}`
                      )
                      .then(data => {
                        setdsluong(data.data.data);
                      })
                      .catch(() => {});
                  }}
                  key={data.pb_ID + 'pb'}
                  value={String(data.pb_ID)}
                  sx={{ color: 'black' }}
                >
                  {data.PB_TEN}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>Không có dữ liệu</MenuItem>
            )}
          </Select>
        </FormControl>

        {/* <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="nghach-luong-label">Chọn nghạch lương</InputLabel>
                    <Select labelId="nghach-luong-label" id="nghach-luong-select" value={nghachLuong} onChange={handlenghachLuongChange}>
                        {dsnghachLuong.length > 0 ? (
                            dsnghachLuong?.map((data) => (
                                <MenuItem key={"nl" + data.ngach_ID} value={String(data.ngach_ID)}>{data.ngach_TEN}</MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>Không có dữ liệu</MenuItem>
                        )}
                    </Select>
                </FormControl> */}

        {/* <TextField type="date" label="Ngày bắt đầu" value={ngayBatDau} onChange={(e) => setNgayBatDau(e.target.value)} />
                <TextField type="date" label="Ngày kết thúc" value={ngayKetThuc} onChange={(e) => setNgayKetThuc(e.target.value)} /> */}
      </Box>

      <Row className="mb-3">
        <Col md={3}>
          <Form.Select
            value={selectedMonth}
            onChange={e => {
              setSelectedMonth(e.target.value);
            }}
          >
            {Array.from(
              {
                length:
                  selectedYear == new Date().getFullYear()
                    ? new Date().getMonth() + 1
                    : 12,
              },
              (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </option>
              )
            )}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            value={selectedYear}
            onChange={e => setSelectedYear(parseInt(e.target.value))}
          >
            {Array.from(
              { length: new Date().getFullYear() - 2020 + 1 },
              (_, i) => {
                const year = 2020 + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              }
            )}
          </Form.Select>
        </Col>
      </Row>

      <Row className="mb-3 d-flex justify-content-between align-items-center">
        <Col>
          <h2>Danh sách nhân viên</h2>
        </Col>
        <Col className="text-end">
          <Button
            variant="primary"
            onClick={() => {
              dsluong.map(data => {
                axios
                  .post(
                    'http://localhost:8080/getphieuluongpdf/getphieuluongpdf',
                    data,
                    {
                      responseType: 'blob',
                    }
                  )
                  .then(response => {
                    const url = window.URL.createObjectURL(
                      new Blob([response.data], { type: 'application/pdf' })
                    );
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `phieuluong.pdf`);
                    document.body.appendChild(link);
                    link.click();
                  })
                  .catch(error => {
                    console.error('Có lỗi xảy ra khi tải PDF:', error);
                  });
              });
            }}
          >
            <FiPlus /> Xuất phiếu hàng loạt
          </Button>
          <Button
            style={{ marginLeft: '30px' }}
            variant="primary"
            onClick={() => {
              handleModalOpen5();
            }}
          >
            <FiPlus /> Gửi Thông tin lương đến nhân viên
          </Button>
          <a id="myLink" download></a>

          <Button
            style={{ marginLeft: '30px', marginTop: '20px' }}
            variant="primary"
            onClick={handleDownload}
          >
            <FiPlus /> Xuất bảng tính
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên nhân viên</th>
            <th>Lương cơ bản</th>
            <th>Lương tăng ca</th>
            <th>Lương khấu trừ</th>
            <th>Tổng lương nhân viên</th>
            <th>Lương ứng trước</th>
            <th>Lương thực lãnh</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {dsluong?.map((emp, index) => (
            <tr key={emp.id}>
              <td>{index + 1}</td>
              <td>{emp.thongtinnhanvien.nv_HOTEN}</td>
              <td>{emp.luongcoban}</td>
              <td>{emp.luongtangca}</td>
              <td>{emp.tongkhautru}</td>
              <td>{emp.tongthunhap}</td>
              <td>{emp.tongungluong}</td>
              <td>{emp.luongnhan}</td>
              <td>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => {
                    dongduocchon.current = dsluong[index];
                    setShowModal(true);
                  }}
                >
                  Xem chi tiết
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleModalClose} centered size="lg">
        <Modal.Body
          style={{
            width: '80%',
            height: '70%',
            margin: '0 auto',
            backgroundColor: '#f0f0f0',
          }}
        >
          <h3 style={{ textAlign: 'center' }}>Phiếu Lương</h3>
          <hr></hr>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '100%' }}>
              <p style={{ textAlign: 'center' }}>
                Thời gian lập {ngayBatDau} - {ngayKetThuc}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '50%' }}>
              <p style={{ textAlign: 'center' }}>Thông tin nhân viên</p>
              <hr></hr>
              <p style={{ textAlign: 'center' }}>
                Tên nhân viên:{' '}
                {dongduocchon.current?.thongtinnhanvien?.nv_HOTEN}
              </p>
              <p style={{ textAlign: 'center' }}>
                Số điện thoại: {dongduocchon.current?.thongtinnhanvien?.nv_SDT}
              </p>
              <p style={{ textAlign: 'center' }}>
                Giới tính:{' '}
                {dongduocchon.current?.thongtinnhanvien?.nv_GIOITINH
                  ? 'Nam'
                  : 'Nữ'}
              </p>
              <p style={{ textAlign: 'center' }}>
                email: {dongduocchon.current?.thongtinnhanvien?.nv_EMAIL}
              </p>
            </div>
            <div style={{ width: '50%' }}>
              <p style={{ textAlign: 'center' }}>Thông tin lương cơ bản</p>
              <hr></hr>
              <p style={{ textAlign: 'center' }}>
                Lương cơ sở: {dongduocchon.current?.luongcoban}
              </p>
              <p style={{ textAlign: 'center' }}>
                Lương tăng ca: {dongduocchon.current?.luongtangca}
              </p>
              <p style={{ textAlign: 'center' }}>
                Khoản khấu trừ: {dongduocchon.current?.tongkhautru}
              </p>
              <p style={{ textAlign: 'center' }}>
                Lương thực nhận: {dongduocchon.current?.luongnhan}
              </p>
            </div>
          </div>
          <h5 style={{ textAlign: 'center' }}>Khoản khấu trừ</h5>
          <hr></hr>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Tên khoản khấu trừ</th>
                <th>Thời điểm lập</th>
                <th>Tên Số tiền khấu trừ</th>
              </tr>
            </thead>
            <tbody>
              {dongduocchon.current?.danhsachkhautru?.map((emp, index) => (
                <tr key={emp.id}>
                  <td>{emp?.khautru?.kt_DIENGIAI}</td>
                  <td>{emp?.tienung}</td>
                  <td>{emp?.khautru?.kt_SOTIEN}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <h5 style={{ textAlign: 'center' }}>Khoản ứng lương</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Ngày ứng lương</th>
                <th>Tổng tiền ứng</th>
              </tr>
            </thead>
            <tbody>
              {dongduocchon.current?.danhsachungluong?.map((emp, index) => (
                <tr key={emp.ul_ID}>
                  <td>{convertDatetime(emp?.ul_NGAYUL)}</td>
                  <td>{emp?.ul_TIEN}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Button
          onClick={() => {
            axios
              .post(
                'http://localhost:8080/getphieuluongpdf/getphieuluongpdf',
                dongduocchon.current,
                {
                  responseType: 'blob',
                }
              )
              .then(response => {
                const url = window.URL.createObjectURL(
                  new Blob([response.data], { type: 'application/pdf' })
                );
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                  'download',
                  `NV${dongduocchon.current?.thongtinnhanvien?.nv_ID}.pdf`
                );
                document.body.appendChild(link);
                link.click();
              })
              .catch(error => {
                console.error('Có lỗi xảy ra khi tải PDF:', error);
              });
          }}
          variant="contained"
        >
          Xuất phiếu lương
        </Button>
      </Modal>

      <Modal show={showModal5} onHide={handleModalClose5} centered size="lg">
        <Modal.Body style={{ width: '80%', height: '90%', margin: '0 auto' }}>
          <h3 style={{ textAlign: 'center' }}>Thiết lập thông tin gửi lương</h3>
          <hr></hr>
          <TextField
            fullWidth
            id="tieude"
            label="Tiêu đề"
            variant="outlined"
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            id="noidung"
            label="Nội dung"
            variant="outlined"
            multiline
            rows={3}
            sx={{ marginBottom: 2 }}
          />
        </Modal.Body>
        <Button
          style={{ backgroundColor: '#0d6efd', color: 'white' }}
          onClick={() => {
            dsluong.forEach(f => {
              console.log(f);
              console.log('EMAIL NHÂN VIÊN LÀ: ' + f.thongtinnhanvien.NV_EMAIL);
              let form = new FormData();
              form.append('email', f.thongtinnhanvien.NV_EMAIL);
              form.append('tieude', document.getElementById('tieude').value);
              form.append('noidung', document.getElementById('noidung').value);
              form.append('map', JSON.stringify(f));
              axios.post(
                'http://localhost:8080/getphieuluongpdf/sendemailphieuluong',
                form
              );
            });
            alert('Gửi thông tin thành công');
          }}
          variant="contained"
        >
          Gửi thông tin hàng loạt
        </Button>
      </Modal>
    </Container>
  );
};

export default EmployeesPage;

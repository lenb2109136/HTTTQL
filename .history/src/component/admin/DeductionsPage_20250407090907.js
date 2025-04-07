import React, { useEffect, useRef, useState } from 'react';
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
import { Checkbox, Tab, Tabs } from '@mui/material'; // Import MUI Tab và Tabs
import { Box } from '@mui/material'; // Sử dụng Box để bọc nội dung tab
import axios from 'axios';

const EmployeesPage = () => {
  const [selectedPhongBan, setSelectedPhongBan] = useState(null);
  const [soDienThoai, setSoDienThoai] = useState('');
  const dsduocchon = useRef([]);
  const khautruchon = useRef({});
  const [dsnhanvien, setdsnhanvien] = useState([]);
  const [khautruthuongnien, setkhautruthuongnien] = useState([]);
  const [khautrunoibo, setkhautrunoibo] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [load, setload] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const handleModalOpen3 = data => {
    setShowModal3(true);
  };
  const handleModalClose3 = () => setShowModal3(false);
  const handleModalClose = () => setShowModal2(false);
  const [danhsachphongban, setdanhsachphongban] = useState([]);
  const handleModalOpen = data => {
    khautruchon.current = data;
    setShowModal2(true);
  };
  const [showModal2, setShowModal2] = useState(false);
  const [newDeduction, setNewDeduction] = useState({
    kt_DIENGIAI: '',
    kt_SOTIEN: '',
    kt_LOAITIENKHAUTRU: 'Công Ty',
    kt_THUONGNIEN: false,
  });

  const handleDelete = id => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewDeduction(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = e => {
    const { name, checked } = e.target;
    setNewDeduction(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios
      .post('http://localhost:8080/api/khautru/add', newDeduction)
      .then(response => {
        setkhautruthuongnien(prev => [...prev, response.data]);
        setShowModal(false);
      })
      .catch(error => {
        console.error('Error adding deduction:', error);
      });
  };

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/khautru/getkhautrunoibo')
      .then(data => {
        setkhautrunoibo(data.data.data);
      })
      .catch(() => {});

    axios
      .get('http://localhost:8080/api/khautru/getkhautruthuongnien')
      .then(data => {
        setkhautruthuongnien(data.data.data);
      })
      .catch(() => {});
    axios
      .get('http://localhost:8080/api/phongban/getPhongBan')
      .then(data => {
        setdanhsachphongban(data.data.data);
      })
      .catch(() => {});
    axios
      .get(
        'http://localhost:8080/api/nhanvien/getPhongBanSoDienThoai?idphongban=0&sodienthoai='
      )
      .then(data => {
        setdsnhanvien(data.data.data);
      });
  }, []);
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/khautru/getkhautrunoibo')
      .then(data => {
        setkhautrunoibo(data.data.data);
      })
      .catch(() => {});

    axios
      .get('http://localhost:8080/api/khautru/getkhautruthuongnien')
      .then(data => {
        setkhautruthuongnien(data.data.data);
      })
      .catch(() => {});
  }, [load]);
  return (
    <Container>
      <h1 className="text-center my-4">Quản Lý Khấu trừ</h1>

      {/* Tabs của MUI */}
      <Tabs value={tabValue} onChange={handleChangeTab} aria-label="tab">
        <Tab label="Danh sách nhân viên" />
        <Tab label="Danh sách Khấu trừ" />
      </Tabs>

      {/* Nội dung của từng tab */}
      <Box sx={{ mt: 3 }}>
        {tabValue === 0 && (
          <div>
            <Row className="mb-3 d-flex justify-content-between align-items-center">
              <Col></Col>
              <Col className="text-end">
                <Button variant="primary" onClick={() => setShowModal(true)}>
                  <FiPlus /> Tạo Khấu trừ mới
                </Button>
              </Col>
            </Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên khấu trừ</th>
                  <th>Loại khấu trừ</th>
                  <th>Mức Khấu Trừ</th>
                  <th>Tự động</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {khautruthuongnien.map((emp, index) => (
                  <tr key={emp.kt_ID}>
                    <td>{index + 1}</td>
                    <td>{emp.kt_DIENGIAI}</td>
                    <td>{emp.kt_LOAITIENKHAUTRU}</td>
                    <td>{emp.kt_SOTIEN}</td>
                    <td>{emp?.KT_TUDONG ? 'Có' : 'Không'}</td>
                    <td>
                      <Button
                        onClick={() => {
                          khautruchon.current = emp;
                          handleModalOpen3();
                        }}
                        variant="warning"
                        className="me-2"
                      >
                        Sửa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        {tabValue === 1 && (
          <div>
            <Row className="mb-3 d-flex justify-content-between align-items-center">
              <Col>
                <h2>Danh sách nhân viên</h2>
              </Col>
              <Col className="text-end">
                <Button variant="primary">
                  <FiPlus /> Thêm nhân viên
                </Button>
              </Col>
            </Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên khấu trừ</th>
                  <th>Loại khấu trừ</th>
                  <th>Mức Khấu Trừ</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {khautrunoibo.map((emp, index) => (
                  <tr key={emp.kt_ID}>
                    <td>{index + 1}</td>
                    <td>{emp.kt_DIENGIAI}</td>
                    <td>{emp.kt_LOAITIENKHAUTRU}</td>
                    <td>{emp.kt_SOTIEN}</td>
                    <td>
                      <Button variant="warning" className="me-2">
                        Sửa
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleModalOpen(emp)}
                      >
                        Tạo khấu trừ
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Box>

      {/* Modal for creating new Khấu trừ */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm Khấu trừ mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={e => {
              e.preventDefault();
              const newDeductionObject = {
                kt_THUONGNIEN: newDeduction.kt_THUONGNIEN,
                kt_SOTIEN: parseFloat(newDeduction.kt_SOTIEN),
                kt_LOAITIENKHAUTRU: newDeduction.kt_LOAITIENKHAUTRU,
                kt_DIENGIAI: newDeduction.kt_DIENGIAI,
              };
              axios
                .post(`http://localhost:8080/khautru/create`, newDeduction)
                .then(() => {
                  alert('Thêm khấu trừ thành công');
                  setload(!load);
                })
                .catch(() => {
                  alert('Tạo khấu trừ thất bại');
                });
            }}
          >
            <Form.Group className="mb-3" controlId="kt_DIENGIAI">
              <Form.Label>Tên Khấu trừ</Form.Label>
              <Form.Control
                type="text"
                name="kt_DIENGIAI"
                value={newDeduction.kt_DIENGIAI}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="kt_SOTIEN">
              <Form.Label>Mức Khấu trừ</Form.Label>
              <Form.Control
                type="number"
                name="kt_SOTIEN"
                value={newDeduction.kt_SOTIEN}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="kt_LOAITIENKHAUTRU">
              <Form.Label>Loại Khấu trừ</Form.Label>
              <Form.Control
                type="text"
                name="kt_LOAITIENKHAUTRU"
                value={newDeduction.kt_LOAITIENKHAUTRU}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="kt_THUONGNIEN">
              <Form.Check
                type="checkbox"
                name="kt_THUONGNIEN"
                label="Khấu trừ thường niên"
                checked={newDeduction.kt_THUONGNIEN}
                onChange={handleCheckboxChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Thêm Khấu trừ
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal2} onHide={handleModalClose} centered size="lg">
        <Modal.Body style={{ width: '100%', height: '70%', margin: '0 auto' }}>
          <h3 style={{ textAlign: 'center' }}>Thiết lập khấu trừ</h3>
          <hr />
          <div style={{ display: 'flex', marginBottom: '20px' }}>
            <div style={{ width: '50%', textAlign: 'center' }}>
              Khấu Trừ: {khautruchon.current.kt_DIENGIAI}
            </div>
            <div style={{ width: '50%', textAlign: 'center' }}>
              Phí Khấu trừ: {khautruchon.current.kt_SOTIEN}
            </div>
          </div>
          {/* Bộ lọc phòng ban và số điện thoại */}
          <div className="d-flex gap-3 mb-3">
            <Form.Select
              value={selectedPhongBan}
              onChange={e => {
                setSelectedPhongBan(e.target.value);
                axios
                  .get(
                    `http://localhost:8080/nhanvien/getPhongBanSoDienThoai?idphongban=${e.target.value}&sodienthoai=${soDienThoai}`
                  )
                  .then(data => {
                    setdsnhanvien(data.data.data);
                  });
              }}
            >
              <option value="0">Chọn phòng ban</option>
              {danhsachphongban.map(pb => (
                <option key={pb.pb_ID} value={pb.pb_ID}>
                  {pb.pb_TEN}
                </option>
              ))}
            </Form.Select>

            <Form.Control
              type="text"
              placeholder="Nhập số điện thoại"
              value={soDienThoai}
              onChange={e => {
                setSoDienThoai(e.target.value);
                axios
                  .get(
                    `http://localhost:8080/nhanvien/getPhongBanSoDienThoai?idphongban=${selectedPhongBan}&sodienthoai=${e.target.value}`
                  )
                  .then(data => {
                    setdsnhanvien(data.data.data);
                  });
              }}
            />
          </div>

          {/* Bảng danh sách nhân viên */}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên nhân viên</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {dsnhanvien?.map((emp, index) => {
                const isChecked = dsduocchon.current.some(
                  item => item.nv_ID === emp.nv_ID
                );

                return (
                  <tr key={emp.nv_ID}>
                    <td>{index + 1}</td>
                    <td>{emp.nv_HOTEN}</td>
                    <td>{emp.nv_SDT}</td>
                    <td>{emp.nv_EMAIL}</td>
                    <td>
                      <Checkbox
                        defaultChecked={isChecked}
                        onChange={e => {
                          if (e.target.checked) {
                            dsduocchon.current.push(emp);
                          } else {
                            dsduocchon.current = dsduocchon.current.filter(
                              item => item.nv_ID !== emp.nv_ID
                            );
                          }
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Modal.Body>

        <Button
          onClick={() => {
            let t = {
              dsnhanvien: dsduocchon.current,
              khautru: khautruchon.current,
            };

            axios
              .post(
                'http://localhost:8080/khautru/thietlapkhautru',
                JSON.stringify(t),
                {
                  headers: { 'Content-Type': 'application/json' },
                }
              )
              .then(() => {
                alert('Tạo khấu trừ thành công');
              })
              .catch(() => {
                alert('Tạo khấu trừ thất bại');
              });
          }}
          variant="contained"
        >
          Tạo khấu trừ
        </Button>
      </Modal>

      <Modal show={showModal3} onHide={handleModalClose3} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: 'center' }}>
            Chỉnh sửa thông tin khấu trừ
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={e => {
              e.preventDefault();
              console.log(khautruchon.current);

              axios
                .post(
                  `http://localhost:8080/khautru/update`,
                  khautruchon.current,
                  {
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  }
                )
                .then(() => {
                  alert('Cập nhật thành công');
                  setload(!load);
                })
                .catch(() => {
                  alert('Tạo khấu trừ thất bại');
                });
            }}
          >
            <Form.Group className="mb-3" controlId="kt_DIENGIAI">
              <Form.Label>Tên Khấu trừ</Form.Label>
              <Form.Control
                type="text"
                name="kt_DIENGIAI"
                defaultValue={khautruchon.current.kt_DIENGIAI}
                onChange={e => {
                  khautruchon.current.kt_DIENGIAI = e.target.value;
                }}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="kt_SOTIEN">
              <Form.Label>Mức Khấu trừ</Form.Label>
              <Form.Control
                type="number"
                name="kt_SOTIEN"
                defaultValue={khautruchon.current.kt_SOTIEN}
                onChange={e => {
                  khautruchon.current.kt_SOTIEN = e.target.value;
                }}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="kt_LOAITIENKHAUTRU">
              <Form.Label>Loại Khấu trừ</Form.Label>
              <Form.Control
                type="text"
                name="kt_LOAITIENKHAUTRU"
                defaultValue={khautruchon.current.kt_LOAITIENKHAUTRU}
                onChange={e => {
                  khautruchon.current.kt_LOAITIENKHAUTRU = e.target.value;
                }}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="kt_THUONGNIEN">
              <Form.Check
                type="checkbox"
                name="kt_THUONGNIEN"
                label="Khấu trừ thường niên"
                defaultChecked={khautruchon.current.kt_THUONGNIEN}
                onChange={() => {
                  khautruchon.current.kt_THUONGNIEN =
                    !khautruchon.current.kt_THUONGNIEN;
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="KT_TUDONG">
              <Form.Check
                type="checkbox"
                name="KT_TUDONG"
                label="Tự động khấu trừ"
                defaultChecked={khautruchon.current.KT_TUDONG}
                onChange={() => {
                  khautruchon.current.KT_TUDONG =
                    !khautruchon.current.KT_TUDONG;
                  console.log(khautruchon.current);
                }}
              />
            </Form.Group>
            <Button
              onClick={() => {
                console.log(khautruchon.current);
              }}
              variant="primary"
              type="submit"
            >
              Cập nhật
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default EmployeesPage;

function App() {
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate(); // Thêm useNavigate ở đây

  // Kiểm tra dữ liệu đăng nhập khi ứng dụng khởi động
  useEffect(() => {
    const storedEmployee = localStorage.getItem('employee');
    if (storedEmployee) {
      const parsedEmployee = JSON.parse(storedEmployee);
      setEmployee(parsedEmployee);
      console.log('Đã load employee từ localStorage:', parsedEmployee);
    }
  }, []);

  // Theo dõi sự thay đổi của employee và điều hướng
  useEffect(() => {
    if (employee) {
      console.log('Employee đã được cập nhật, điều hướng về /userhome');
      navigate('/userhome'); // Điều hướng đến /userhome khi employee có giá trị
    } else {
      console.log('Employee là null, điều hướng về /login');
      navigate('/login'); // Điều hướng về /login nếu employee là null
    }
  }, [employee, navigate]);

  // Debug trạng thái employee
  useEffect(() => {
    console.log('Trạng thái employee trong App.js:', employee);
  }, [employee]);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage setEmployee={setEmployee} />}
        />
        <Route
          path="/*"
          element={<MainApp employee={employee} setEmployee={setEmployee} />}
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

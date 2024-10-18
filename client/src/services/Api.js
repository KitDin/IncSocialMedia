import axios from "axios";

export default () => {
  // Lấy token từ localStorage
  const token = localStorage.getItem("token");

  if (!token) {
    // Xử lý khi không có token (ví dụ: điều hướng tới trang login)
    // this.$router.push({ name: 'Login' }); // Điều hướng tùy thuộc vào cấu trúc của bạn
    console.warn("No token found, please login.");
  }

  return axios.create({
    baseURL: `http://localhost:8084/api/users`,
    headers: {
      Authorization: `Bearer ${token}` // Đính kèm token vào header
    }
  });
};

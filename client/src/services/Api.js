import axios from "axios";

export default () => {
  const axiosInstance = axios.create({
    baseURL: `http://localhost:8084/api/users`
  });

  // Thêm request interceptor để đính kèm token
  axiosInstance.interceptors.request.use(
    config => {
      // Lấy token từ localStorage
      const token = localStorage.getItem("token");

      // Nếu có token, đính kèm vào header Authorization
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn("No token found, please login.");
      }

      return config;
    },
    error => {
      // Xử lý lỗi trước khi request được gửi đi
      return Promise.reject(error);
    }
  );

  // Thêm response interceptor để xử lý phản hồi
  axiosInstance.interceptors.response.use(
    response => {
      // Bạn có thể xử lý dữ liệu phản hồi ở đây trước khi trả về cho người gọi
      return response;
    },
    error => {
      // Xử lý lỗi (ví dụ: token hết hạn hoặc không hợp lệ)
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized access - token expired or invalid.");

        // Ví dụ: điều hướng người dùng tới trang đăng nhập nếu token hết hạn
        window.location.href = "/";
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

// import axios from "axios";

// export default axiosInstance;

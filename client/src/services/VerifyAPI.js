// verifyAPI.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `http://localhost:8084/token`
});

export default () => {
  return axiosInstance;
};

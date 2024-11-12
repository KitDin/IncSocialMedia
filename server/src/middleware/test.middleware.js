import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const middlewareController = {
  testMiddleware(req, res, next) {
    try {
      next();
    } catch (error) {}
  },
  verifyToken(req, res, next) {
    try {
      // Lấy token từ header
      if (
        req.path === "/login" ||
        req.path === "/register" ||
        req.path === "/information/upload"
      ) {
        return next(); // Bỏ qua middleware và đi tiếp
      }
      const token = req.headers["authorization"];

      if (!token) {
        return res.status(403).json({ message: "No token provided" });
      }

      //   Giải mã token và xác thực
      const verified = jwt.verify(
        token.split(" ")[1],
        process.env.JSON_WEB_TOKEN_KEY
      ); // JWT_SECRET là khóa bí mật của bạn
      req.user = verified; // Lưu thông tin user vào req để sử dụng trong các controller khác
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  },
};

export default middlewareController;

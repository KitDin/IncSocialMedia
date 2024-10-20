import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const routerToken = express.Router();

routerToken.post("/verifytoken", (req, res) => {
  const token = req.body.token;
  jwt.verify(token, process.env.JSON_WEB_TOKEN_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    // Nếu token hợp lệ, trả về thông tin người dùng
    res.json({ userId: decoded.USER_Id, email: decoded.USER_Email });
  });
});

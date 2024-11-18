import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql
  .createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PW,
    database: process.env.DB,
  })
  .promise();

// Hàm kiểm tra kết nối
export const checkDatabaseConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Kết nối MySQL thành công!");
    connection.release(); // Giải phóng kết nối sau khi kiểm tra
  } catch (error) {
    console.error("Kết nối MySQL thất bại:", error.message);
  }
};

// Gọi hàm kiểm tra khi cần
checkDatabaseConnection();

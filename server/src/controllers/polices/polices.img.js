import multer from "multer";
import { v4 as uuidv4 } from "uuid"; // Import uuid
const storageAvatar = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/uploads/avatar");
  },
  fileFilter: function (req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();
    const mimetyp = file.mimetype;
    if (
      extension !== ".jpg" ||
      extension !== ".jpeg" ||
      extension !== ".png" ||
      mimetyp !== "image/png" ||
      mimetyp !== "image/jpg" ||
      mimetyp !== "image/jpeg"
    ) {
      cb("error message", true);
    }
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "_" + Date.now() + ".jpg");
  },
});

const storageStatus = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/uploads/post");
  },
  fileFilter: function (req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();
    const mimetyp = file.mimetype;
    if (
      extension !== ".jpg" ||
      extension !== ".jpeg" ||
      extension !== ".png" ||
      mimetyp !== "image/png" ||
      mimetyp !== "image/jpg" ||
      mimetyp !== "image/jpeg"
    ) {
      cb("error message", true);
    }
  },
  filename: function (req, file, callback) {
    // callback(null, file.fieldname + "_" + Date.now() + ".jpg");
    const uid = uuidv4(); // Generate a unique uid
    callback(null, uid + ".jpg"); // Use uid as the filename
  },
});

export const upload = multer({
  storage: storageAvatar,
  limits: { fileSize: 1024 * 1024 * 10 }, // 10 MB
});

export const uploadStatus = multer({
  storage: storageStatus,
  limits: { fileSize: 1024 * 1024 * 10 }, // 10 MB
});

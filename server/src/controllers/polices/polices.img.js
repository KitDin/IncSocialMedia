import multer from "multer";
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
    callback(null, file.fieldname + "_" + Date.now() + ".jpg");
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

// middleware/uploadMiddleware.js
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/vnd.ms-powerpoint",
    "application/msword",
  ];

  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only PDF, JPG, PNG, JPEG, DOC, and PPT files are allowed!"),
      false
    );
  }
};

const taskUpload = multer({ storage, fileFilter });

export default taskUpload;

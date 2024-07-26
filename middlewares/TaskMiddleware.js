// middleware/uploadMiddleware.js
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      file.originalname.split(".")[0] +
      "_" +
      Date.now() +
      "_" +
      Math.round(Math.random() * 1e9);
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
    "application/zip",
    "video/mp4",
  ];

  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF, JPG, PNG, JPEG, DOC, PPT, ZIP, and MP4 files are allowed!"
      ),
      false
    );
  }
};

const taskUpload = multer({ storage, fileFilter });

export default taskUpload;

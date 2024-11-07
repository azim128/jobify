import multer from "multer";
import path from "path";

// Multer config
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "logo") {
    // For logo uploads - allow only images
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed for logo!"));
    }
  } else if (file.fieldname === "descriptionFile") {
    // For job description files - allow PDF
    const filetypes = /pdf/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = file.mimetype === "application/pdf";

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed for job descriptions!"));
    }
  } else {
    cb(new Error("Invalid field name"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
});

export default upload;

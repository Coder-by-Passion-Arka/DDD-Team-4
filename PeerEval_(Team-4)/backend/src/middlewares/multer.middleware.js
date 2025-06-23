import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure temp directory exists
const tempDir = ".../../public/temp";
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, tempDir);
  },
  filename: function (request, file, callback) {
    // Generate unique filename with original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const nameWithoutExt = path.parse(file.originalname).name;

    callback(null, `${nameWithoutExt}-${uniqueSuffix}${extension}`);
  },
});

// File filter function
const fileFilter = (request, file, callback) => {
  // Define allowed file types
  const allowedTypes = {
    "image/jpeg": true,
    "image/jpg": true,
    "image/png": true,
    "image/gif": true,
    "image/webp": true,
    "application/pdf": true,
    "application/msword": true,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": true,
    "text/plain": true,
  };

  if (allowedTypes[file.mimetype]) {
    callback(null, true);
  } else {
    callback(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5, // Maximum 5 files per request
  },
});

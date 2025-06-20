import multer from "multer";

const storage = multer.diskStorage({
  destination: function (request, file, callBack) {
    callBack(null, "../public/temp");
  },
  filename: function (request, file, callBack) {
    callBack(null, file.originalname + Date.now() + ".jpg"); // Image of the avatar of an user is saved with a unique name
  },
});

export const upload = multer({ storage });

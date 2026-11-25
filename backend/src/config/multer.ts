import multer from "multer";
import imageFileSchema from "../validate/media.validation.js";
const storage = multer.memoryStorage();
const fileFilter: multer.Options["fileFilter"] = (req, file, callback) => {
  const parsedFile = imageFileSchema.shape.mimetype.safeParse(file.mimetype);
  if (!parsedFile.success) {
    return callback(new Error("Only JPEG, PNG and WebP images are allowed"));
  }
  callback(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});
export default upload;

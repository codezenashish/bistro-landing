import multer from "multer";
const TEMP_UPLOAD_DIRECTORY: string = "./public/temp";

const diskStorageConfiguration = multer.diskStorage({
  destination: function setUploadDestination(request, file, callback) {
    callback(null, TEMP_UPLOAD_DIRECTORY);
  },

  filename: function setUploadedFileName(request, file, callback) {
    callback(null, file.originalname);
  },
});

export const fileUploadMiddleware = multer({
  storage: diskStorageConfiguration,
});

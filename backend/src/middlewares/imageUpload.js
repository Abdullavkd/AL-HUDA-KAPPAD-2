import multer from 'multer';
import { ApiError } from '../utils/apiError.js';

const parser = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1
  },
  fileFilter(req, file, callback) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return callback(new ApiError(400, 'Only JPEG, PNG, and WebP images are allowed'));
    }
    callback(null, true);
  }
});

export function parseImageUpload(req, res, next) {
  parser.single('image')(req, res, error => {
    if (!error) return next();

    if (error instanceof multer.MulterError) {
      const tooLarge = error.code === 'LIMIT_FILE_SIZE';
      return next(new ApiError(
        tooLarge ? 413 : 400,
        tooLarge ? 'Image must be 5 MB or smaller' : 'Invalid image upload'
      ));
    }

    next(error);
  });
}
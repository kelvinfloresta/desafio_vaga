import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { config } from '../../../config';
import { BadRequestError } from '../../../utils/errors';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../../../../uploads'));
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadsDir = path.join(__dirname, '../../../../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'text/plain') {
    cb(null, true);
  } else {
    cb(new BadRequestError('Only .txt files are allowed'));
  }
};

export const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxUploadSize,
  },
});
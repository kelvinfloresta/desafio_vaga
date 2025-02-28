import * as transaction from '@express/controllers/transaction.controller';
import { upload } from '@express/middlewares/file-upload.middleware';
import express from 'express';

const router = express.Router()
  .post('/upload', upload.single('file') as unknown as express.RequestHandler, transaction.upload)
  .get('/', transaction.paginate)

export default router;
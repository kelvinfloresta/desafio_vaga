import transactionCase from '@/usecases/transaction.usecase';
import { BadRequestError } from '@/utils/errors';
import { asyncHandler } from '@express/middlewares/error.middleware';
import { Request, Response } from 'express';
import fs from 'fs';
import { unlink } from 'fs/promises';

export const upload = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new BadRequestError('No file uploaded');
  }

  const filePath = req.file.path;

  const fileStream = fs.createReadStream(filePath);
  
  const result = await transactionCase.processFile(fileStream);
  
  await unlink(filePath);

  return res.status(200).json({
    message: 'File processed successfully',
    data: {
      processedCount: result.processedCount,
      modifiedCount: result.modifiedCount,
      executionTime: result.executionTime,
    },
  });
});

export const paginate = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  const filters = {
    name: req.query.name as string | undefined,
    startDate: req.query.startDate as string | undefined,
    endDate: req.query.endDate as string | undefined,
  };
  
  const result = await transactionCase.get(
    filters,
    { page, limit }
  );
  
  return res.status(200).json({
    data: result,
  });
});
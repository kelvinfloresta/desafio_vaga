import { errorHandler } from '@express/middlewares/error.middleware';
import transactionRoutes from '@express/routes/transaction.routes';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

import { config } from './config';
const app = express()

  // Middleware
  .use(cors())
  .use(express.json())

  // Routes
  .get('/health', (_, res) => res.status(200).json({ message: 'Server is running' }))
  .use('/api/transactions', transactionRoutes)

  // Global error handler
  .use(errorHandler);

(async function main() {
  try {
    await mongoose.connect(config.mongoUri)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }

  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
  })
})()

export default app;
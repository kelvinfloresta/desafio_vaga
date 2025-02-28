import mongoose, { Document, Schema } from 'mongoose';
import { ClientModel } from './client.model';

export interface TransactionModel extends Document {
  transactionId: string;
  client: ClientModel['_id'];
  date: Date;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    transactionId: {
      type: String,
      required: [true, 'Transaction ID is required'],
      unique: true,
      trim: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'Client is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Create index for efficient querying
TransactionSchema.index({ date: -1 }); // Index for sorting by date descending
TransactionSchema.index({ client: 1, date: -1 }); // Compound index for client + date queries

export default mongoose.model<TransactionModel>('Transaction', TransactionSchema);
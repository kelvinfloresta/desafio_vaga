import { RootFilterQuery } from 'mongoose';
import model, { TransactionModel } from '../models/transaction.model';
import clientGateway from './client.gateway';
import * as gateway from './transaction.interface';
export class TransactionGateway implements gateway.ITransactionGateway {
  async bulkUpsert(transactions: gateway.CreateInput[]): Promise<gateway.BulkWriteResult> {
    if (transactions.length === 0) {
      return { insertedCount: 0, modifiedCount: 0, totalProcessed: 0 };
    }

    const bulkOps = transactions.map(transaction => ({
      updateOne: {
        filter: { transactionId: transaction.transactionId },
        update: {
          $set: {
            client: transaction.client,
            date: transaction.date,
            amount: transaction.amount
          }
        },
        upsert: true
      }
    }));

    const result = await model.bulkWrite(bulkOps);

    return {
      insertedCount: result.upsertedCount,
      modifiedCount: result.modifiedCount,
      totalProcessed: transactions.length
    };
  }

  /**
   * Find transactions with filters and pagination
   */
  async paginate(
    input: gateway.PaginateInput,
    { page, limit, sort = { date: -1 } }: gateway.PaginationOptions
  ): Promise<gateway.QueryResult> {
    const skip = (page - 1) * limit;
    const filter: RootFilterQuery<TransactionModel> = {};

    if (input.name) {
      const clients = await clientGateway.list({ name: input.name });

      if (clients.length === 0) {
        return {
          transactions: [],
          totalCount: 0,
          totalPages: 0,
          currentPage: page,
        }
      }

      filter.client = clients.map(client => client.id);
    }

    if (input.startDate || input.endDate) {
      filter.date = {};

      if (input.startDate) {
        filter.date.$gte = new Date(input.startDate);
      }
      
      if (input.endDate) {
        filter.date.$lte = new Date(input.endDate);
      }
    }

    const transactionsPromise = model.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('client', 'name document');

    const countPromise = model.countDocuments(filter);

    const [transactions, totalCount] = await Promise.all([transactionsPromise, countPromise]);

    return {
      transactions,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page
    };
  }
}

export default new TransactionGateway();
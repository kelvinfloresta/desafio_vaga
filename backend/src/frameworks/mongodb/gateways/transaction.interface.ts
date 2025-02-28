import { TransactionModel } from "../models/transaction.model";

export interface ITransactionGateway {
  bulkUpsert(input: CreateInput[]): Promise<BulkWriteResult>;
  paginate(input: PaginateInput, pagination: PaginationOptions): Promise<QueryResult>;
}

export interface CreateInput {
  readonly transactionId: string;
  readonly client: string;
  readonly date: Date;
  readonly amount: number;
}

export interface PaginateInput {
  readonly name?: string;
  readonly startDate?: string;
  readonly endDate?: string;
}

export interface PaginationOptions {
  readonly page: number;
  readonly limit: number;
  readonly sort?: Record<string, 1 | -1>;
}

export interface QueryResult {
  readonly transactions: readonly TransactionModel[];
  readonly totalCount: number;
  readonly totalPages: number;
  readonly currentPage: number;
}

export interface BulkWriteResult {
  readonly insertedCount: number;
  readonly modifiedCount: number;
  readonly totalProcessed: number;
}
import transactionGateway from '@mongodb/gateways/transaction.gateway';
import {
  CreateInput,
  ITransactionGateway,
  PaginationOptions,
  QueryResult
} from '@mongodb/gateways/transaction.interface';
import { ReadStream } from 'fs';
import readline from 'readline';

import clientGateway from '@/frameworks/mongodb/gateways/client.gateway';
import * as client from '@mongodb/gateways/client.interface';

export interface ProcessFileResult {
 readonly processedCount: number;
 readonly modifiedCount: number;
 readonly executionTime: string;
}

export interface TransactionData {
  readonly id: string;
  readonly name: string;
  readonly document: string;
  readonly data: string;
  readonly valor: string;
}

export class TransactionCase {

  constructor(private readonly transactionGateway: ITransactionGateway, private readonly clientGateway: client.IClientGateway) {}

  /**
   * Parse a transaction line into structured data
   */
  private parseLine(line: string): TransactionData {
    const data: Record<string, string> = {};
    
    line.split(';').forEach((item) => {
      if (!item.trim()) return;
      const [key, value] = item.split(':');
      if (key && value) {
        data[key.trim()] = value.trim();
      }
    });

    return {
      id: data.id || '',
      name: data.nome || '',
      document: data.cpfCnpj || '',
      data: data.data || '',
      valor: data.valor || '',
    };
  }

  /**
   * Validate transaction data
   */
  private isValid(data: TransactionData): boolean {
    return !!(data.id && data.name && data.document && data.data && data.valor);
  }

  private async startBulk(clientBatch: client.BulkUpsertInput[], transactionBatch: CreateInput[]) {
      let start = Date.now();
      await this.clientGateway.bulkUpsert(clientBatch);
      const clients = await this.clientGateway.list({ documents: clientBatch.map(item => item.document) });
      let end = Date.now();
      console.log('BULK_UPSERT_CLIENTS', clientBatch.length, 'in', (end - start) / 1000, 'seconds');

      start = Date.now();
      const clientMap = new Map<string, string>();
      clients.forEach(client => {
        clientMap.set(client.document, client.id);
      });

      transactionBatch.forEach((transaction: CreateInput & { client: string }) => {
        transaction.client = clientMap.get(transaction.client) || '';
      });

      const result = await this.transactionGateway.bulkUpsert(transactionBatch);
      end = Date.now();
      console.log('BULK_UPSERT_TRANSACTIONS', transactionBatch.length, 'in', (end - start) / 1000, 'seconds');
      return result;
    }

  /**
   * Process transaction file
   */
  async processFile(fileStream: ReadStream): Promise<ProcessFileResult> {
    const startTime = Date.now();

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let transactionBatch: Array<CreateInput> = [];
    let clientBatch: client.BulkUpsertInput[] = [];
    const BATCH_SIZE = 100000;

    const promises = []
    let lineErrors: string[] = [];

    let start = Date.now();
    for await (const line of rl) {
      const isEmpty = line.trim() === '';
      if (isEmpty) continue;

      const data = this.parseLine(line);

      if (!this.isValid(data)) {
        lineErrors.push(`Invalid data in line: ${line}`);
        continue;
      }

      clientBatch.push({
        name: data.name,
        document: data.document,
      });

      transactionBatch.push({
        transactionId: data.id,
        client: data.document,
        date: new Date(data.data),
        amount: parseInt(data.valor, 10),
      });

      if (clientBatch.length === BATCH_SIZE) {
        const end = Date.now();
        console.log('Prepared ', BATCH_SIZE, 'in', (end - start) / 1000, 'seconds')
        promises.push(this.startBulk(clientBatch, transactionBatch));

        transactionBatch = [];
        clientBatch = [];
        start = Date.now();
      }
    }

    if (transactionBatch.length > 0) {
        const end = Date.now();
        console.log('Prepared ', transactionBatch.length, 'in', (end - start) / 1000, 'seconds')
        promises.push(this.startBulk(clientBatch, transactionBatch));
    }

    const results = await Promise.all(promises);
    let totalProcessed = 0;
    let totalModified = 0;
    for (const result of results) {
      totalProcessed += result.totalProcessed;
      totalModified += result.modifiedCount;
    }

    if (lineErrors.length > 0) {
      console.warn(`Processed with ${lineErrors.length} line errors:`, lineErrors);
    }

    const endTime = Date.now();
    const executionTime = (endTime - startTime) / 1000;

    return {
      processedCount: totalProcessed,
      modifiedCount: totalModified,
      executionTime: `${executionTime} seconds`,
    };
  }


  /**
   * Get transactions with pagination and filters
   */
  async get(
    filters: {
      name?: string;
      startDate?: string;
      endDate?: string;
    },
    pagination: PaginationOptions
  ): Promise<QueryResult> {
    return this.transactionGateway.paginate(filters, pagination);
  }


}

export default new TransactionCase(transactionGateway, clientGateway);
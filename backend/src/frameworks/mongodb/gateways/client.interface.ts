
export interface BulkUpsertInput {
  readonly name: string;
  readonly document: string;
}

export interface ListInput {
  readonly documents?: string[];
  readonly name?: string;
}

export interface ListOutput {
  readonly id: string;
  readonly name: string;
  readonly document: string;
}

export interface IClientGateway {
  bulkUpsert(input: BulkUpsertInput[]): Promise<string[]>;
  list(input: ListInput): Promise<ListOutput[]>;
}

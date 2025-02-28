import model, { ClientModel } from '@mongodb/models/client.model';
import { RootQuerySelector } from 'mongoose';
import * as client from './client.interface';

export class ClientGateway implements client.IClientGateway {
  async list(input: client.ListInput): Promise<client.ListOutput[]> {
    const filter: RootQuerySelector<ClientModel> = {};

    if (input.documents?.length) {
      filter.document = { $in: input.documents };
    }

    if (input.name) {
      filter.name = { $regex: input.name, $options: 'i' };
    }

    return model.find(filter);
  }

  async bulkUpsert(input: client.BulkUpsertInput[]): Promise<string[]> {
    const bulkOperations = input.map((client) => ({
      updateOne: {
        filter: { document: client.document },
        update: { $set: { name: client.name, document: client.document } },
        upsert: true,
      },
    }));

    const result = await model.bulkWrite(bulkOperations);

    return Object.values(result.upsertedIds);
  }
}

export default new ClientGateway();
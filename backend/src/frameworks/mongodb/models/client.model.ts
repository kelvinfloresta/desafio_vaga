import mongoose, { Document, Schema } from 'mongoose';

export interface ClientModel extends Document {
 _id: mongoose.Types.ObjectId;
 name: string;
 document: string;
 createdAt: Date;
 updatedAt: Date;
}

const ClientSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    document: {
      type: String,
      required: [true, 'CPF/CNPJ is required'],
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ClientModel>('Client', ClientSchema);
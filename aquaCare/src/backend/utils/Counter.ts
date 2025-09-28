import mongoose, { Schema, Document } from 'mongoose';

interface ICounter extends Document {
  _id: string;
  sequenceValue: number;
}

const counterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  sequenceValue: { type: Number, default: 0 }
});

const Counter = mongoose.model<ICounter>('Counter', counterSchema);

export default Counter; 
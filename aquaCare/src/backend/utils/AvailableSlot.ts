import mongoose, { Schema, Document } from "mongoose";

export interface IAvailableSlot extends Document {
  employeeId: string;
  poolId?: string;
  date: string;
  time: string;
  isBooked: boolean;
}

const availableSlotSchema = new Schema<IAvailableSlot>({
  employeeId: { type: String, required: true },
  poolId: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
});

const AvailableSlot = mongoose.model<IAvailableSlot>("AvailableSlot", availableSlotSchema);

export default AvailableSlot;

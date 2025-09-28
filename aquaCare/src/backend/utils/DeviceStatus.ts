// models/DeviceStatus.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IDeviceStatus extends Document {
  deviceType: string; // "light" או "heater"
  isOn: boolean;
  userId?: string;
  poolId?: string;
  updatedAt: Date;
}

const DeviceStatusSchema = new Schema<IDeviceStatus>({
  deviceType: { type: String, required: true, enum: ["light", "heater"] },
  isOn: { type: Boolean, required: true },
  userId: { type: String },
  poolId: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

const DeviceStatus = mongoose.models.DeviceStatus || mongoose.model<IDeviceStatus>("DeviceStatus", DeviceStatusSchema);

export default DeviceStatus;


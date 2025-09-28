// models/EmergencyStatus.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IEmergencyStatus extends Document {
  isEmergency: boolean;
  updatedAt: Date;
}

const EmergencyStatusSchema = new Schema<IEmergencyStatus>({
  isEmergency: { type: Boolean, required: true },
  updatedAt: { type: Date, default: Date.now },
});

const EmergencyStatus = mongoose.models.EmergencyStatus || mongoose.model<IEmergencyStatus>("EmergencyStatus", EmergencyStatusSchema);

export default EmergencyStatus;

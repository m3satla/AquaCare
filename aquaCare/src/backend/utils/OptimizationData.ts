import mongoose, { Document, Schema } from "mongoose";

export interface IOptimizationData extends Document {
  poolId: string;
  poolTemperature: number;
  chlorineLevel: number;
  lightingStatus: boolean;
}

const optimizationDataSchema = new Schema<IOptimizationData>({
  poolId: { type: String, required: true, unique: true },
  poolTemperature: { type: Number, required: true },
  chlorineLevel: { type: Number, required: true },
  lightingStatus: { type: Boolean, required: true },
});

// ✅ הגדרה מפורשת של שם הקולקשן - חשוב כדי למנוע 404
const OptimizationData = mongoose.model<IOptimizationData>(
  "OptimizationData",
  optimizationDataSchema,
  "optimizations" // ← תואם לשם הקולקשן במסד
);

export default OptimizationData;

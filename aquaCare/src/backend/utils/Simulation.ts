import mongoose from 'mongoose';

const simulationSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.Mixed, required: true }, // תומך גם במספר וגם במחרוזת
  name: { type: String, required: true },
  temperature: { type: Number, required: true },
  chlorine: { type: Number, required: true },
  showerTemp: { type: Number, required: true },
  acidity: { type: Number, required: true }
}, { timestamps: true });

const SimulationModel = mongoose.model('Simulation', simulationSchema);
export default SimulationModel;

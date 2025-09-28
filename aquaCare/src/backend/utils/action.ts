import mongoose from 'mongoose';

const actionSchema = new mongoose.Schema({
  id: { type: Number }, 
  description: { type: String }, 
  timestamp: { type: String } 
});

const ActionModel = mongoose.model('Action', actionSchema);
export default ActionModel;

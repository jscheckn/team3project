import mongoose from 'mongoose';

const { Schema } = mongoose;

const GoalSchema = new Schema({
  type: { type: String, required: true },
  scale: { type: String },
  amount: { type: Number },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Goal = mongoose.models?.Goal || mongoose.model('Goal', GoalSchema);
export default Goal;

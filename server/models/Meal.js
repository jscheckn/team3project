import mongoose from 'mongoose';

const mealItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number }
  //can add more nutrition fields later
});

const mealSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  items: [mealItemSchema],
  //add this later:  caloriesTotal: { type: Number },
  notes: String
});


const Meal = mongoose.model('Meal', mealSchema);
export default Meal;
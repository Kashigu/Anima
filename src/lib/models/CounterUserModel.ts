import mongoose from 'mongoose';

const CounterUserSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
}, { collection: 'counters' });

const CounterUserModel = mongoose.models.Counter || mongoose.model('Counter', CounterUserSchema);

export default CounterUserModel;

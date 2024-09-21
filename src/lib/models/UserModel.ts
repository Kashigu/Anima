import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
  image_url: { type: String, required: true }
}, { collection: 'users' }); // Explicitly specify collection name if needed

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

export default UserModel;
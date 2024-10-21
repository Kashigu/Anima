import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: String }, 
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  image_url: { type: String, required: false },
  description: { type: String, required: false },
  isBlocked: { type: Boolean, default: false },
}, { collection: 'users' });

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

export default UserModel;

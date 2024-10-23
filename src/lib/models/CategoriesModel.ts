import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({

  id: { type: String, required: true },
  name: { type: String, required: true },
}, { collection: 'categories' }); // Explicitly specify collection name if needed

const CategoryModel = mongoose.models.Category || mongoose.model('Category', CategorySchema);

export default CategoryModel;
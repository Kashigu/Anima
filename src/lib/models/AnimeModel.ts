import mongoose from 'mongoose';

const AnimeSchema = new mongoose.Schema({

  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  genres: { type: [String], required: true },
  image_url: { type: String, required: true },
  big_image_url: { type: String, required: true }
}, { collection: 'animes' }); // Explicitly specify collection name if needed

const AnimeModel = mongoose.models.Anime || mongoose.model('Anime', AnimeSchema);

export default AnimeModel;

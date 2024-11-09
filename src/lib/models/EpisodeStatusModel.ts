import mongoose from 'mongoose';

const EpisodeStatusSchema = new mongoose.Schema({

  id: { type: String, required: true },
  idAnime: { type: String, required: true },
  idUser: { type: String, required: true },
  episodes: { type: String, required: true },
}, { collection: 'episodeStatus' }); // Explicitly specify collection name if needed

const EpisodeStatusModel = mongoose.models.EpisodeStatus || mongoose.model('EpisodeStatus', EpisodeStatusSchema);

export default EpisodeStatusModel;
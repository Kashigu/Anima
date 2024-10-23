import mongoose from 'mongoose';

const EpisodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  idAnime: { type: String, required: true },
  title: { type: String, required: true },
  video_url: { type: String, required: true },
  episodeNumber: { type: String, required: true },
  thumbnail_url: { type: String, required: true }
}, { collection: 'episodes' }); // Explicitly specify collection name if needed

const EpisodeModel = mongoose.models.Episode || mongoose.model('Episode', EpisodeSchema);

export default EpisodeModel;

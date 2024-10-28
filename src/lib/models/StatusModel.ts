import mongoose from 'mongoose';

const StatusSchema = new mongoose.Schema({

  id: { type: String, required: true },
  idAnime: { type: String, required: true },
  idUser: { type: String, required: true },
  statu: { type: String, required: true },
}, { collection: 'status' }); // Explicitly specify collection name if needed

const StatusModel = mongoose.models.Status || mongoose.model('Status', StatusSchema);

export default StatusModel;
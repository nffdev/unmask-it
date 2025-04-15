import mongoose from 'mongoose';

const scanSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  mimetype: String,
  size: Number,
  hash: String,
  scanDate: { type: Date, default: Date.now },
  result: { type: String, default: 'clean' }, 
});

export default mongoose.model('Scan', scanSchema);

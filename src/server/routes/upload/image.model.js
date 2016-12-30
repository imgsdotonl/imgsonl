import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    originalname: String,
    filename: String,
    info: String,
    height: Number,
    width: Number,
    path: String,
    imageId: String,
    thumbnailId: String,
    metadata: {
      size: Number,
      created: { type: Date, default: Date.now },
      ip: Number,
    }
});

export default mongoose.model('Image', ImageSchema);

import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  imageUrl: { type: String, required: true },
  institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', default: null },
  displayOrder: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

export const Gallery = mongoose.model('Gallery', gallerySchema);

import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, default: '' },
  content: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', default: null },
  publishedAt: { type: Date, default: null },
  isPublished: { type: Boolean, default: false }
}, { timestamps: true });

export const News = mongoose.model('News', newsSchema);

import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  startAt: { type: Date, required: true },
  endAt: { type: Date },
  location: { type: String, default: '' },
  institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', default: null },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

export const Event = mongoose.model('Event', eventSchema);

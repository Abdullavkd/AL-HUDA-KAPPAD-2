import mongoose from 'mongoose';

const institutionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  type: { type: String, enum: ['orphanage', 'school', 'madrasa', 'college', 'training_centre', 'other'], default: 'other' },
  shortDescription: { type: String, default: '' },
  description: { type: String, default: '' },
  establishedYear: Number,
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  website: { type: String, default: '' },
  locationUrl: { type: String, default: '' },
  logoUrl: { type: String, default: '' },
  coverImageUrl: { type: String, default: '' },
  gallery: [{ url: String, caption: String }],
  mission: { type: String, default: '' },
  vision: { type: String, default: '' },
  facilities: [String],
  achievements: [String],
  isPublished: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

export const Institution = mongoose.model('Institution', institutionSchema);

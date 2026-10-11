import mongoose from 'mongoose';
import { ALL_ROLES } from '../constants/roles.js';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ALL_ROLES, required: true },
  institutionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Institution' }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);

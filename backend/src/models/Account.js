import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', required: true, index: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['cash', 'bank', 'other'], required: true },
  bankName: { type: String, default: '' },
  accountName: { type: String, default: '' },
  accountNumberMasked: { type: String, default: '' },
  upiId: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Account = mongoose.model('Account', accountSchema);

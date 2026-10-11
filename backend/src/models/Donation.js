import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donorName: { type: String, required: true },
  donorEmail: { type: String, default: '' },
  donorPhone: { type: String, default: '' },
  amount: { type: Number, required: true, min: 1 },
  purpose: { type: String, required: true },
  institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', default: null },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', default: null },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'cash'], default: 'pending' },
  paymentReference: { type: String, default: '' }
}, { timestamps: true });

export const Donation = mongoose.model('Donation', donationSchema);

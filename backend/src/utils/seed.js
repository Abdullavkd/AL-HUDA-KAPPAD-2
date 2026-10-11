import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import { User } from '../models/User.js';
import { Institution } from '../models/Institution.js';
import { SiteSetting } from '../models/SiteSetting.js';
import { ROLES } from '../constants/roles.js';
import { slugify } from './slugify.js';

const institutions = [
  { name: 'Ainul Huda Orphanage', type: 'orphanage', shortDescription: 'Ainul Huda Orphanage, under Al Huda Trust.', displayOrder: 1 },
  { name: 'Jamia Ainul Huda Kappad', type: 'school', shortDescription: 'An educational institution under Al Huda Trust.', displayOrder: 2 },
  { name: 'IES Koyilandy', type: 'school', shortDescription: 'An educational institution under Al Huda Trust.', displayOrder: 3 },
  { name: 'IES Atholi', type: 'school', shortDescription: 'An educational institution under Al Huda Trust.', displayOrder: 4 },
  { name: 'IHSS Kappad', type: 'school', shortDescription: 'An educational institution under Al Huda Trust.', displayOrder: 5 },
  { name: 'IASC Cheliya', type: 'school', shortDescription: 'An educational institution under Al Huda Trust.', displayOrder: 6 }
];

await connectDatabase();
for (const item of institutions) await Institution.updateOne({ slug: slugify(item.name) }, { $setOnInsert: { ...item, slug: slugify(item.name) } }, { upsert: true });
const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'admin@alhudatrust.local').trim().toLowerCase();
if (!(await User.exists({ email: adminEmail }))) {
  const initialPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!initialPassword || initialPassword.length < 12) {
    throw new Error('Set SEED_ADMIN_PASSWORD to a unique password of at least 12 characters before creating the initial Trust Admin.');
  }
  await User.create({
    name: 'Trust Administrator',
    email: adminEmail,
    passwordHash: await bcrypt.hash(initialPassword, 12),
    role: ROLES.TRUST_ADMIN
  });
}
const settings = {
  site: { name: 'Al Huda Trust', publicName: 'Ainul Huda', tagline: 'Education, care and service', description: 'Al Huda Islamic Cultural Establishment and Ainul Huda Orphanage.' },
  hero: { title: 'Building a better future through education and care', subtitle: 'Discover Institutions Under Al Huda Islamic Cultural Establishment and Ainul Huda Orphanage are working together for the community.', slides: [] },
  contact: { address: '', phone: '', email: '', mapUrl: '' },
  social: { facebook: '', instagram: '', youtube: '' }
};
for (const [key, value] of Object.entries(settings)) await SiteSetting.updateOne({ key }, { key, value }, { upsert: true });
console.log('Seed completed. Trust Admin email:', adminEmail);
await mongoose.disconnect();

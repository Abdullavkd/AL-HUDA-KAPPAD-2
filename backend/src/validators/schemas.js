import { z } from 'zod';

const objectRequest = (body) => z.object({
  body,
  params: z.object({}),
  query: z.object({})
});

const optionalText = (max = 5000) => z.string().trim().max(max).optional();
const optionalUrl = () => z.string().trim().url().or(z.literal('')).optional();
const objectId = z.string().regex(/^[a-fA-F0-9]{24}$/);

export const loginSchema = objectRequest(z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(200)
}));

export const contactSchema = objectRequest(z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: optionalText(40),
  subject: optionalText(150),
  message: z.string().trim().min(5).max(5000)
}));

export const userSchema = objectRequest(z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  password: z.string().min(12).max(200),
  role: z.enum(['trust_admin', 'institution_admin', 'principal', 'accountant', 'teacher', 'driver']),
  institutionIds: z.array(objectId).max(20).optional()
}));

const institutionFields = {
  type: z.enum(['orphanage', 'school', 'madrasa', 'college', 'training_centre', 'other']).optional(),
  shortDescription: optionalText(500),
  description: optionalText(10000),
  establishedYear: z.coerce.number().int().min(1800).max(2100).optional(),
  address: optionalText(500),
  phone: optionalText(40),
  email: z.string().trim().email().max(254).or(z.literal('')).optional(),
  website: optionalUrl(),
  locationUrl: optionalUrl(),
  logoUrl: optionalUrl(),
  coverImageUrl: optionalUrl(),
  gallery: z.array(z.object({ url: z.string().url(), caption: optionalText(200) })).max(100).optional(),
  mission: optionalText(3000),
  vision: optionalText(3000),
  facilities: z.array(z.string().trim().max(150)).max(100).optional(),
  achievements: z.array(z.string().trim().max(300)).max(100).optional(),
  isPublished: z.boolean().optional(),
  displayOrder: z.coerce.number().int().min(0).max(10000).optional()
};

export const institutionCreateSchema = objectRequest(z.object({
  name: z.string().trim().min(2).max(150),
  slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  ...institutionFields
}));

export const institutionUpdateSchema = objectRequest(z.object({
  name: z.string().trim().min(2).max(150).optional(),
  slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  ...institutionFields
}).refine(value => Object.keys(value).length > 0, 'At least one permitted field is required'));

export const newsSchema = objectRequest(z.object({
  title: z.string().trim().min(2).max(200),
  slug: z.string().trim().min(2).max(220).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  excerpt: optionalText(500),
  content: z.string().trim().min(1).max(20000),
  imageUrl: optionalUrl(),
  institutionId: objectId,
  publishedAt: z.coerce.date().optional(),
  isPublished: z.boolean().optional()
}));

export const eventSchema = objectRequest(z.object({
  title: z.string().trim().min(2).max(200),
  slug: z.string().trim().min(2).max(220).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  description: optionalText(10000),
  imageUrl: optionalUrl(),
  startAt: z.coerce.date(),
  endAt: z.coerce.date().optional(),
  location: optionalText(300),
  institutionId: objectId,
  isPublished: z.boolean().optional()
}));

export const gallerySchema = objectRequest(z.object({
  title: z.string().trim().min(2).max(200),
  description: optionalText(2000),
  imageUrl: z.string().trim().url().max(2000),
  institutionId: objectId,
  displayOrder: z.coerce.number().int().min(0).max(10000).optional(),
  isPublished: z.boolean().optional()
}));

export const settingSchema = objectRequest(z.object({
  value: z.unknown()
}));

export const accountSchema = objectRequest(z.object({
  institutionId: objectId,
  name: z.string().trim().min(2).max(100),
  type: z.enum(['cash', 'bank', 'other']),
  bankName: z.string().trim().max(100).optional(),
  accountName: z.string().trim().max(100).optional(),
  accountNumberMasked: z.string().trim().max(50).optional(),
  upiId: z.string().trim().max(100).optional()
}));

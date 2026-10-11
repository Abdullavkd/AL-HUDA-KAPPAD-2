import { News } from '../models/News.js';
import { Event } from '../models/Event.js';
import { Gallery } from '../models/Gallery.js';
import { SiteSetting } from '../models/SiteSetting.js';
import { slugify } from '../utils/slugify.js';
import { ApiError } from '../utils/apiError.js';
import { ROLES } from '../constants/roles.js';

function assignedIds(user) {
  return (user.institutionIds || []).map(id => String(id));
}

function assertInstitutionAccess(user, institutionId) {
  if (user.role === ROLES.TRUST_ADMIN) return;

  if (!institutionId || !assignedIds(user).includes(String(institutionId))) {
    throw new ApiError(403, 'You do not have access to this institution');
  }
}

function adminFilter(user) {
  if (user.role === ROLES.TRUST_ADMIN) return {};
  return { institutionId: { $in: user.institutionIds || [] } };
}

function prepareContent(data, user, includePublishedAt = false) {
  assertInstitutionAccess(user, data.institutionId);

  const result = {
    ...data,
    slug: data.slug || slugify(data.title)
  };

  if (user.role !== ROLES.TRUST_ADMIN) {
    result.institutionId = data.institutionId;
  }

  if (includePublishedAt) {
    result.publishedAt = data.isPublished
      ? (data.publishedAt || new Date())
      : null;
  }

  return result;
}

export async function getHomeContent() {
  const [settings, institutions, news, events, gallery] = await Promise.all([
    SiteSetting.find().lean(),
    import('../services/institutionService.js').then(m => m.listPublicInstitutions()),
    News.find({ isPublished: true }).sort({ publishedAt: -1, createdAt: -1 }).limit(6).populate('institutionId', 'name slug').lean(),
    Event.find({ isPublished: true, startAt: { $gte: new Date() } }).sort({ startAt: 1 }).limit(6).populate('institutionId', 'name slug').lean(),
    Gallery.find({ isPublished: true }).sort({ displayOrder: 1, createdAt: -1 }).limit(12).populate('institutionId', 'name slug').lean()
  ]);

  return {
    settings: Object.fromEntries(settings.map(item => [item.key, item.value])),
    institutions,
    news,
    events,
    gallery
  };
}

export async function listNews() {
  return News.find({ isPublished: true }).sort({ publishedAt: -1, createdAt: -1 }).populate('institutionId', 'name slug');
}

export async function listEvents() {
  return Event.find({ isPublished: true }).sort({ startAt: 1 }).populate('institutionId', 'name slug');
}

export async function listGallery() {
  return Gallery.find({ isPublished: true }).sort({ displayOrder: 1, createdAt: -1 }).populate('institutionId', 'name slug');
}

export async function listAdminNews(user) {
  return News.find(adminFilter(user)).sort({ createdAt: -1 });
}

export async function listAdminEvents(user) {
  return Event.find(adminFilter(user)).sort({ startAt: 1 });
}

export async function listAdminGallery(user) {
  return Gallery.find(adminFilter(user)).sort({ displayOrder: 1, createdAt: -1 });
}

export async function createNews(data, user) {
  return News.create(prepareContent(data, user, true));
}

export async function createEvent(data, user) {
  return Event.create(prepareContent(data, user));
}

export async function createGallery(data, user) {
  assertInstitutionAccess(user, data.institutionId);
  return Gallery.create(data);
}

export async function upsertSetting(key, value) {
  if (!/^[a-zA-Z][a-zA-Z0-9_-]{0,79}$/.test(key)) {
    throw new ApiError(400, 'Invalid setting key');
  }
  if (key === 'homepageSlides') {
    if (!Array.isArray(value) || value.length > 20) {
      throw new ApiError(400, 'Homepage slideshow must contain no more than 20 slides');
    }
    for (const slide of value) {
      if (!slide || typeof slide !== 'object' || typeof slide.imageUrl !== 'string' || !/^https:\/\//i.test(slide.imageUrl)) {
        throw new ApiError(400, 'Each homepage slide must have a valid HTTPS image URL');
      }
      if (['title', 'description', 'buttonLabel'].some(field => slide[field] != null && (typeof slide[field] !== 'string' || slide[field].length > (field === 'description' ? 500 : 160)))) {
        throw new ApiError(400, 'Homepage slide text is too long or invalid');
      }
    }
  }
  return SiteSetting.findOneAndUpdate(
    { key },
    { key, value },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );
}

export async function deleteById(Model, id, user) {
  const filter = user.role === ROLES.TRUST_ADMIN
    ? { _id: id }
    : {
        _id: id,
        institutionId: { $in: user.institutionIds || [] }
      };

  const result = await Model.findOneAndDelete(filter);

  if (!result) {
    throw new ApiError(404, 'Item not found or you do not have access to it');
  }

  return result;
}


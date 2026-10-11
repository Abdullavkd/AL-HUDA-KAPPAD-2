import { Institution } from '../models/Institution.js';
import { slugify } from '../utils/slugify.js';
import { ApiError } from '../utils/apiError.js';
import { ROLES } from '../constants/roles.js';

export async function listPublicInstitutions() {
  return Institution.find({ isPublished: true }).sort({ displayOrder: 1, name: 1 });
}

export async function getPublicInstitution(slug) {
  const institution = await Institution.findOne({ slug, isPublished: true });
  if (!institution) throw new ApiError(404, 'Institution not found');
  return institution;
}

export async function listInstitutions(user) {
  if (user.role === ROLES.TRUST_ADMIN) {
    return Institution.find().sort({ displayOrder: 1, name: 1 });
  }

  return Institution.find({
    _id: { $in: user.institutionIds || [] }
  }).sort({ displayOrder: 1, name: 1 });
}

export async function createInstitution(data) {
  return Institution.create({
    ...data,
    slug: data.slug || slugify(data.name)
  });
}

export async function updateInstitution(id, data, user) {
  const isTrustAdmin = user.role === ROLES.TRUST_ADMIN;

  const filter = isTrustAdmin
    ? { _id: id }
    : {
        $and: [
          { _id: id },
          { _id: { $in: user.institutionIds || [] } }
        ]
      };

  const allowedFields = [
    'shortDescription',
    'description',
    'establishedYear',
    'address',
    'phone',
    'email',
    'website',
    'locationUrl',
    'logoUrl',
    'coverImageUrl',
    'gallery',
    'mission',
    'vision',
    'facilities',
    'achievements'
  ];

  const updateData = isTrustAdmin
    ? data
    : Object.fromEntries(
        Object.entries(data).filter(([key]) => allowedFields.includes(key) && (['gallery', 'coverImageUrl'].includes(key) ? user.role === ROLES.INSTITUTION_ADMIN : true))
      );

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, 'No permitted institution fields provided');
  }

  const institution = await Institution.findOneAndUpdate(
    filter,
    updateData,
    { new: true, runValidators: true }
  );

  if (!institution) {
    throw new ApiError(404, 'Institution not found or you do not have access to it');
  }

  return institution;
}



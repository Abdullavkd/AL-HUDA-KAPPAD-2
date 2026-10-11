import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryEnabled } from '../config/cloudinary.js';
import { ApiError } from '../utils/apiError.js';
import { ROLES } from '../constants/roles.js';

function hasValidImageSignature(buffer) {
  if (!buffer || buffer.length < 12) return false;
  const jpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const png = buffer.subarray(0, 8).equals(
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  );
  const webp = buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP';
  return jpeg || png || webp;
}

export async function uploadImage(req, res) {
  if (!req.file) {
    throw new ApiError(400, 'Select an image to upload');
  }

  if (!hasValidImageSignature(req.file.buffer)) {
    throw new ApiError(400, 'The uploaded file is not a valid JPEG, PNG, or WebP image');
  }

  const institutionId = req.body?.institutionId;
  if (!mongoose.isValidObjectId(institutionId)) {
    throw new ApiError(400, 'A valid institutionId is required');
  }

  if (req.user.role !== ROLES.TRUST_ADMIN) {
    const assignedIds = (req.user.institutionIds || []).map(String);
    if (!assignedIds.includes(String(institutionId))) {
      throw new ApiError(403, 'You do not have access to this institution');
    }
  }

  if (!cloudinaryEnabled) {
    throw new ApiError(503, 'Image uploads are not configured on this server');
  }

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({
      folder: `al-huda-trust/${institutionId}`,
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 2400, height: 2400, crop: 'limit' }]
    }, (error, uploaded) => {
      if (error) reject(error);
      else resolve(uploaded);
    });
    stream.end(req.file.buffer);
  });

  res.status(201).json({
    success: true,
    data: {
      imageUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes
    }
  });
}
